// Scheduled Netlify Function: runs every day just after midnight London time
// It ensures placeholder markdown files exist for tomorrow and the day after
// so the calendar strip always shows two future days.

export const handler = async () => {
  const { GH_OWNER, GH_REPO, GH_TOKEN } = process.env;
  if (!GH_TOKEN) {
    return { statusCode: 500, body: "GH_TOKEN missing" };
  }

  const today = new Date();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (let offset = 1; offset <= 2; offset++) {
    const future = new Date(today.getTime() + offset * ONE_DAY);
    const yyyyMmDd = future.toISOString().slice(0, 10);
    const mdPath = `_fleeting/${yyyyMmDd}.md`;
    const ghUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(mdPath)}`;

    // Check if exists
    const exists = await fetch(ghUrl, { headers: { Authorization: `token ${GH_TOKEN}` } });
    if (!exists.ok) {
      const placeholder = `---\ndate: ${yyyyMmDd}\nslug: ${yyyyMmDd}\nlayout: fleeting\n---\n\n`;
      await fetch(ghUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${GH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `daily placeholder for ${yyyyMmDd}`,
          content: Buffer.from(placeholder).toString("base64"),
        }),
      });
    }
  }

  return { statusCode: 200, body: "placeholders ensured" };
};

export const config = {
  // Run at 00:10 London time daily (10 minutes after midnight)
  schedule: "10 0 * * *",
}; 