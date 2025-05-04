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
  const mdContent = `---\ndate: ${yyyyMmDd} ${now.toTimeString().slice(0, 5)}\n---\n\n${note}\n`;

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

  return { statusCode: 200, body: "Note saved; site rebuilding." };
} 