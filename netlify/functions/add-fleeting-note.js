export async function handler(event) {
  // Accept POST only
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Basic secret header check
  if (event.headers["x-secret"] !== process.env.NL_SECRET) {
    return { statusCode: 401, body: "Unauthorised" };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (_) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const note = (body.note || "").trim();
  if (!note) {
    return { statusCode: 400, body: "note field required" };
  }

  // Build markdown content and path
  const now = new Date();
  const yyyyMmDd = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const mdPath = `_fleeting/${yyyyMmDd}.md`;
  const mdContent = `---\ndate: ${yyyyMmDd} ${now.toTimeString().slice(0, 5)}\nslug: "${yyyyMmDd}"\nlayout: fleeting\n---\n\n${note}\n`;

  // GitHub details from env vars
  const { GH_OWNER, GH_REPO, GH_TOKEN } = process.env;
  const ghUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(mdPath)}`;

  let sha = undefined;
  let newContentEncoded;
  const checkRes = await fetch(ghUrl, {
    headers: { Authorization: `token ${GH_TOKEN}` },
  });
  if (checkRes.ok) {
    const json = await checkRes.json();
    sha = json.sha;
    const existing = Buffer.from(json.content, "base64").toString("utf8");
    newContentEncoded = Buffer.from(existing.trimEnd() + "\n\n" + note + "\n").toString("base64");
  } else {
    newContentEncoded = Buffer.from(mdContent).toString("base64");
  }

  // Create or update file
  const res = await fetch(ghUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `update fleeting note ${yyyyMmDd}`,
      content: newContentEncoded,
      sha,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { statusCode: res.status, body: text };
  }

  // ----- Create placeholder files for past and future days -----
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const results = [];
  
  // Create placeholders for 3 days in the past and 3 days in the future
  for (let offset = -3; offset <= 3; offset++) {
    if (offset === 0) continue; // Skip today as it's already created above
    
    const targetDate = new Date(now.getTime() + offset * ONE_DAY_MS);
    const dateStr = targetDate.toISOString().slice(0, 10);
    const filePath = `_fleeting/${dateStr}.md`;
    const fileUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(filePath)}`;

    try {
      // Check if file already exists
      const exists = await fetch(fileUrl, { 
        headers: { Authorization: `token ${GH_TOKEN}` } 
      });
      
      if (!exists.ok) {
        // Create placeholder file
        const placeholder = `---\ndate: ${dateStr}\nslug: "${dateStr}"\nlayout: fleeting\n---\n\n`;
        const createRes = await fetch(fileUrl, {
          method: "PUT",
          headers: {
            Authorization: `token ${GH_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `add placeholder for ${dateStr}`,
            content: Buffer.from(placeholder).toString("base64"),
          }),
        });
        
        if (createRes.ok) {
          results.push(`Created placeholder for ${dateStr}`);
        } else {
          results.push(`Failed to create placeholder for ${dateStr}`);
        }
      }
    } catch (err) {
      console.error(`Error with date ${dateStr}:`, err);
    }
  }

  return { 
    statusCode: 200, 
    body: `Note saved; site rebuilding. ${results.length ? '\n' + results.join('\n') : ''}` 
  };
} 