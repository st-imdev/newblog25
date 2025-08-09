export type Category = 'posts' | 'essays' | 'op-eds' | 'interviews';

export interface ContentItem {
  category: Category;
  slug: string;
  title: string;
  date?: string;
  description?: string;
  body: string[];
}

export const content: ContentItem[] = [
  {
    category: "posts",
    slug: "my-journey-to-co-founding-entourage",
    title: "My journey to co-founding entourage",
    date: "2025-07-31",
    description: "Back in 2017, AI was still quite a niche area. The journey from EdTech founder to AI entrepreneur and co-founding entourage.",
    body: [
      "Back in 2017, AI was still quite a niche area. It was more focused on deep learning, particularly Recurrent Neural Networks (RNNs) and Convolutional Neural Networks (CNNs). If you are part of that cohort, you'll fondly remember OpenAI's website having all of these agents chasing each other in mazes playing various games as they explored reinforcement learning.",
      "At the time I was running miDrive, a startup that I had raised ~$10m for, focused on the EdTech sector - bringing learning to drive into the digital age (and all of the transactions that go along with it: first car, insurance, etc.). After much reflection, I had grown the company to a stage that I could feel proud about, and completed much of the innovative product work. And I couldn't help but keep being drawn to artificial intelligence at the weekend.",
      "Always being a founder, and thinking a few horizons out - I knew that AI would be the transformational technology of my lifetime. And I wanted to be living and breathing it.",
      "That's when I made a calculated bet to go to a large corporate (with deep pockets) and no external pressures other than focusing on learning and building my expertise amongst some of the world's leading scientists. I joined a large asset manager as global head of AI products, and was tasked with infusing AI, ML, and NLP throughout the portfolio management.",
      "Armed with deep technical knowledge and battle-tested experience deploying AI at scale, I was ready to return to my founder roots. The years as a senior executive at a large publicly traded company at the forefront of AI adoption had given me something invaluable: credibility that would matter when fundraising, coupled with insights into the real challenges enterprises face when implementing AI systems.",
      "That journey led to **[entourage](https://entourage.tech/)**. I've always admired systems that get smarter through collaboration. Think of open-source projects where one coder's fix helps thousands. Now apply that to AI agents. Most agents today work in silos. They tackle problems, but their lessons vanish after the task.",
      "We started entourage to fix that. Our core idea is a shared memory protocol for AI agents. Agents capture experiences during tasks—successes, failures, patterns—and assimilate them into reusable knowledge. This isn't offline training; it's real-time learning embedded in the work. Retrieve what's needed based on context, and the whole network improves."
    ]
  },
  {
    category: "posts",
    slug: "jack-dorseys-bitchat-and-why-tinkering-matters",
    title: "Jack Dorsey's bitchat and why tinkering matters",
    date: "2025-07-30",
    description: "I admire people who build things from scratch. Jack Dorsey's latest project, Bitchat, shows why experimental building matters.",
    body: [
      "I admire people who build things from scratch. Jack Dorsey is one of them. He co-founded Twitter, and although I never agreed with all his decisions there (some moderation choices felt too heavy-handed, too centralised), I like that he keeps experimenting. His latest project, Bitchat, shows why that matters.",
      "Last year, I watched Britain's Online Safety Act pass. It aimed to curb online harm, but it gave the government tools to scan messages and demand backdoors from platforms. I thought, this erodes privacy. We need alternatives. Then Dorsey announced **[Bitchat](https://bitchat.free/)** on X. He built it over a weekend to explore Bluetooth mesh networks. No internet needed.",
      "Some commentators note its raw edges—it's an experiment, not a polished product. X posts praise its decentralisation; one user called it 'a hack against surveillance.' Others point out flaws, like potential for spam in dense areas. Dorsey shared an 'ugly whitepaper' openly, inviting fixes. That's the tinkerer in him: prototype, share, iterate.",
      "It's not about perfection; it's about reclaiming control. In a country where laws now force platforms to police speech, a tool like this lets people communicate off-grid. No overseers. Just direct links.",
      "Dorsey's approach fits how I view innovation. He doesn't wait for permission. He hacks together code to test ideas on relays and encryption. That inspires me. We all face systems that centralise power—governments, tech giants. But what if we built our own?",
      "In Britain today, with censorship rising, tools like this feel essential. They push back by existing. If you're like me and value decentralisation, try it (available on iOS/macOS). Poke at the edges. Build something yourself.",
      "Small acts of tinkering add up to real change."
    ]
  },
  {
    category: "posts",
    slug: "ai-adhd",
    title: "Anyone else got AI ADHD?",
    date: "2025-01-25",
    description: "If you're anything like me and always have ideas for products, the advent of AI coding assistants has created a new kind of overwhelm.",
    body: [
      "If you're anything like me and always have ideas for products, the advent of the AI coding assistant has made it much easier (and quicker) to prove out a hypothesis - alone.",
      "Trouble is, my mind never switches off! I now have a long list of trials that I want to experiment with, leading to slight burnout as my brain goes into overdrive.",
      "Want to invent an LLM protocol similar to sitemaps? No problem, just fire up `Cursor`. Want to build a health tracking app? No problem, just fire up `Cursor`.",
      "I've finally started to be a bit more rigorous about what I allow to take up the couple of spare hours I have per day, rather than nursing an ever expanding portfolio of apps & ideas.",
      "I can't be the only one that feels slight overwhelm at this new found superpower."
    ]
  },
  {
    category: "posts",
    slug: "you-can-just-build-things",
    title: "You can just build things",
    date: "2025-01-03",
    description: "There was a meme going around X highlighting that if you want to change something, you can just build it. 2025 will be the year of builders.",
    body: [
      "There was a meme going around X over the past few days highlighting that if you want to change something, make something, or usher something into existence that 'you can just build'.",
      "And it has never been more true.",
      "2025 is going to be the year of builders who just jump in with both feet, hack around, inject some creativity, build in public and listen to the feedback loop.",
      "I truly think the non-tech / product manager route has come to an end. And that's speaking as someone who has been 'product' for over a decade. The pivotal fork in the road is for those who ended up becoming more technical (I'd count myself in here) and those who didn't.",
      "So go play around with all the AI tooling out there, start to learn tech stacks, dream something up and just build it. I can promise you won't regret it."
    ]
  },
  {
    category: "posts",
    slug: "typography-demo",
    title: "Typography and Style Demo",
    description: "A comprehensive demonstration of typography, formatting, and content presentation styles used throughout this site.",
    body: [
      "This page demonstrates the various **typography** and *formatting* options available for content presentation. It serves as both a reference and a testing ground for different styling approaches.",
      "We can emphasize text using **bold formatting** for strong emphasis, or *italic formatting* for subtle emphasis. Sometimes we might need `inline code snippets` when discussing technical concepts like `useState()` hooks or `API endpoints`.",
      "For important insights, we can use ==highlight syntax== to draw attention, similar to using a highlighter pen on paper. This ==creates a subtle yellow background== that makes key points stand out without being overwhelming.",
      "> This is a blockquote that can be used for highlighting important quotes or statements from other sources. It provides visual distinction from regular paragraph text.",
      "Lists help organize information clearly without unnecessary spacing. Here are some principles of good typography:",
      "• Consistent spacing creates visual rhythm and flow",
      "• Appropriate contrast ensures readability in all conditions", 
      "• Clear hierarchy guides the reader's attention naturally",
      "• Generous white space prevents cognitive overload",
      "• Semantic markup improves accessibility for all users",
      "Numbered lists work well for sequential information and step-by-step processes:",
      "1. First, establish clear visual hierarchy with headings",
      "2. Then, ensure consistent spacing throughout the document", 
      "3. Test the design across different devices and screen sizes",
      "4. Gather user feedback and iterate on the design",
      "5. Document the design system for future reference",
      "CODE_BLOCK_PYTHON",
      "Images can be included with proper captions for context and accessibility:",
      "![Chart visualization example](DEMO_CHART)",
      "CODE_BLOCK_REACT",
      "![Code editor interface](DEMO_CODE)",
      "Links should be clearly distinguishable and provide [helpful context](https://example.com) about their destination. External links open in new tabs while internal navigation maintains the current browsing context."
    ]
  }
];

export function getContent(category: string, slug: string): ContentItem | undefined {
  return content.find(
    (c) => c.category === (category as Category) && c.slug === slug
  );
}