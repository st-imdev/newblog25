import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getContent } from '@/content/content';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import demoChart from '@/assets/demo-chart.jpg';
import demoCode from '@/assets/demo-code.jpg';

// Enhanced content formatting - processes entire content at once to handle lists properly
const processContent = (bodyArray: string[]): JSX.Element[] => {
  // Join all content with newlines to process lists across paragraphs
  const fullContent = bodyArray.join('\n');
  
  // Split on special markers first - include full markdown patterns for images
  const parts = fullContent.split(/(CODE_BLOCK_\w+|!\[Chart visualization example\]\(DEMO_CHART\)|!\[Code editor interface\]\(DEMO_CODE\))/);
  
  return parts.map((part, index) => {
    // Handle code blocks
    if (part === 'CODE_BLOCK_PYTHON') {
      return (
        <div key={index} className="my-8">
          <SyntaxHighlighter
            language="python"
            style={oneDark}
            customStyle={{
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            showLineNumbers={true}
          >
            {`def generate_response(prompt: str) -> str:
    """Generate a thoughtful response to the given prompt."""
    context = analyze_context(prompt)
    reasoning = apply_reasoning(context)
    
    # Apply safety filters and alignment checks
    if not passes_safety_check(reasoning):
        return generate_fallback_response()
    
    return format_response(reasoning)`}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    if (part === 'CODE_BLOCK_REACT') {
      return (
        <div key={index} className="my-8">
          <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            customStyle={{
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            showLineNumbers={true}
          >
            {`const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  );
};`}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    // Handle demo images - match full markdown patterns
    if (part === '![Chart visualization example](DEMO_CHART)') {
      return (
        <figure key={index} className="my-8">
          <img src={demoChart} alt="Chart visualization example" className="w-full rounded-lg shadow-sm" />
          <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">Chart visualization example</figcaption>
        </figure>
      );
    }
    
    if (part === '![Code editor interface](DEMO_CODE)') {
      return (
        <figure key={index} className="my-8">
          <img src={demoCode} alt="Code editor interface" className="w-full rounded-lg shadow-sm" />
          <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">Code editor interface</figcaption>
        </figure>
      );
    }
    
    // Process regular content with proper list handling
    if (part.trim()) {
      const processedHtml = part
        // Replace DEMO placeholders and their markdown syntax completely
        .replace(/!\[([^\]]*)\]\(DEMO_CHART\)/g, '')
        .replace(/!\[([^\]]*)\]\(DEMO_CODE\)/g, '')
        // Clean up any remaining parentheses from incomplete replacements
        .replace(/\)\s*$/gm, '')
        // Handle markdown h2 headings and add proper ids
        .replace(/^## (.+)$/gm, (match, title) => {
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return `<h2 id="${id}" class="text-lg sm:text-xl font-semibold text-foreground mt-8 sm:mt-12 mb-4 sm:mb-6 first:mt-0">${title}</h2>`;
        })
        // Process highlight syntax first
        .replace(/==(.*?)==/g, '<span class="highlight">$1</span>')
        // Handle blockquotes
        .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-accent pl-6 py-4 my-8 italic text-lg text-muted-foreground bg-muted/10 rounded-r-md">$1</blockquote>')
        // Handle image placeholders
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-8"><img src="$2" alt="$1" class="w-full rounded-lg shadow-sm" /><figcaption class="text-sm text-muted-foreground mt-2 text-center italic">$1</figcaption></figure>')
        // Handle inline code
        .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground border">$1</code>')
        // Handle bold text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
        // Handle italic text
        .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
        // Handle links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="link-underline text-foreground font-medium">$1</a>')
        // Process numbered lists (look for consecutive numbered items)
        .replace(/(?:^(\d+)\.\s*(.+)$\n?)+/gm, (match) => {
          const items = match.trim().split('\n').map(line => {
            const itemMatch = line.match(/^(\d+)\.\s*(.+)$/);
            return itemMatch ? `<li>${itemMatch[2]}</li>` : '';
          }).filter(Boolean).join('');
          return `<ol class="my-6 list-decimal list-inside [&>li]:marker:text-muted-foreground [&>li]:marker:font-medium space-y-1">${items}</ol>`;
        })
        // Process bullet lists (look for consecutive bullet items)
        .replace(/(?:^•\s*(.+)$\n?)+/gm, (match) => {
          const items = match.trim().split('\n').map(line => {
            const itemMatch = line.match(/^•\s*(.+)$/);
            return itemMatch ? `<li class="relative pl-6"><span class="absolute left-0 text-muted-foreground font-bold">•</span>${itemMatch[1]}</li>` : '';
          }).filter(Boolean).join('');
          return `<ul class="my-6">${items}</ul>`;
        })
        // Convert remaining single lines to paragraphs
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          // Skip lines that are already formatted as HTML elements
          if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
            return trimmed;
          }
          return `<p class="mb-4 sm:mb-6 leading-relaxed text-foreground">${trimmed}</p>`;
        })
        .filter(Boolean)
        .join('\n');
      
      return (
        <div 
          key={index}
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      );
    }
    
    return null;
  }).filter(Boolean);
};

const ContentPage: React.FC = () => {
  const { category = '', slug = '' } = useParams();
  const item = getContent(category, slug);

  if (!item) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <section className="container py-16">
          <div className="max-w-prose">
            <header className="mb-10">
              <h1 className="h1">Not found</h1>
              <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
            </header>
            <Link to="/" className="link-underline">Return home</Link>
          </div>
        </section>
      </main>
    );
  }

  // Generate table of contents by parsing actual content for h2 headings
  const tableOfContents = React.useMemo(() => {
    const fullContent = item.body.join('\n');
    const headingMatches = fullContent.match(/^## (.+)$/gm);
    
    if (!headingMatches) return [];
    
    return headingMatches.map(heading => {
      const title = heading.replace('## ', '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return { id, title };
    });
  }, [item.body]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{item.title} — Scott Taylor</title>
        <meta name="description" content={item.description || `${item.title} by Scott Taylor`} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : `/${category}/${slug}`} />
      </Helmet>

      <div className="container py-4 sm:py-8 flex gap-8 max-w-6xl">
        {/* Left Sidebar - Table of Contents - Only show if there are headings */}
        {tableOfContents.length > 0 && (
          <aside className="w-64 shrink-0 hidden lg:block">
            <div className="sticky top-8">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Contents</h2>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <nav className="space-y-2">
                  {tableOfContents.map((section, i) => (
                    <a
                      key={i}
                      href={`#${section.id}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className={`flex-1 px-4 sm:px-0 ${tableOfContents.length > 0 ? 'max-w-2xl' : 'max-w-prose'}`}>
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </div>
          
          <article className="animate-fade-in">
            <header className="mb-8">
              <h1 className="h1 mb-4">{item.title}</h1>
              {item.date && (
                <p className="text-sm sm:text-base text-muted-foreground">{new Date(item.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</p>
              )}
            </header>

            <div className="prose prose-lg max-w-none">
              {processContent(item.body)}
            </div>

            <footer className="mt-16 pt-8 border-t border-border">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-foreground transition-colors underline decoration-1 underline-offset-4"
              >
                ← Back to home
              </Link>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
};

export default ContentPage;