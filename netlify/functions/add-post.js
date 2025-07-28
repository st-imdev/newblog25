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

  const { title, tags, content } = body;

  if (!title || !content) {
    return { statusCode: 400, body: "Title and content are required" };
  }

  // Simple HTML to Markdown conversion function
  function htmlToMarkdown(html) {
    return html
      // Convert headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      // Convert paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      // Convert bold and italic
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      // Convert links
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      // Convert lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      // Convert blockquotes
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
      // Convert code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      // Convert line breaks
      .replace(/<br[^>]*>/gi, '\n')
      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  // Create a slug from the title
  function createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  // Get current date
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const slug = createSlug(title);
  const filename = `${slug}.md`;
  const mdPath = `_notes/${filename}`;

  // Convert HTML content to Markdown
  const markdownContent = htmlToMarkdown(content);

  // Build the markdown content with frontmatter
  let mdContent = `---\ntitle: ${title}\ndate: ${dateStr}`;
  
  if (tags && tags.trim()) {
    // Clean up tags - split by comma, trim whitespace, filter empty
    const cleanTags = tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .join(' ');
    if (cleanTags) {
      mdContent += `\ntags: ${cleanTags}`;
    }
  }
  
  mdContent += `\n---\n\n${markdownContent}\n`;

  // GitHub details from env vars
  const { GH_OWNER, GH_REPO, GH_TOKEN } = process.env;
  const ghUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(mdPath)}`;

  // Check if file already exists (to prevent overwrites)
  const checkRes = await fetch(ghUrl, {
    headers: { Authorization: `token ${GH_TOKEN}` },
  });

  if (checkRes.ok) {
    return { statusCode: 409, body: "A post with this title already exists. Please choose a different title." };
  }

  // Create the file
  const contentEncoded = Buffer.from(mdContent).toString("base64");
  
  const res = await fetch(ghUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Add new post: ${title}`,
      content: contentEncoded,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('GitHub API error:', text);
    return { statusCode: res.status, body: `Failed to create post: ${text}` };
  }

  return { 
    statusCode: 200, 
    body: `Post "${title}" created successfully! Site is rebuilding...` 
  };
} 