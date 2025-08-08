export const supportedLexicons = {
  blog: 'app.bsky.feed.post', 
  sapphire: 'app.bsky.feed.post', 
  longform: 'app.bsky.feed.post',
  whitewind: 'com.whtwnd.blog.entry',
  default: 'app.bsky.feed.post', // All posts use standard Bluesky format
} as const;

export type LexiconKey = keyof typeof supportedLexicons;

export function getLexiconByCategory(categories: string[] = []): string {
  for (const category of categories) {
    const normalized = category.toLowerCase() as LexiconKey;
    if (supportedLexicons[normalized]) {
      return supportedLexicons[normalized];
    }
  }
  return supportedLexicons.default;
}

// New function to get lexicon from custom field or direct parameter
export function getLexiconFromPost(lexiconParam?: string, categories: string[] = []): string {
  // First check direct lexicon parameter
  if (lexiconParam) {
    const normalized = lexiconParam.toLowerCase() as LexiconKey;
    if (supportedLexicons[normalized]) {
      return supportedLexicons[normalized];
    }
    // If lexicon param is a full collection name, return it directly
    if (lexiconParam.includes('.')) {
      return lexiconParam;
    }
  }
  
  // Fallback to category-based detection for backward compatibility
  return getLexiconByCategory(categories);
}

export function getLexiconInfo() {
  return {
    supported: Object.keys(supportedLexicons),
    default: supportedLexicons.default,
    descriptions: {
      blog: 'Standard Bluesky post (280 chars max, auto-threads longer content)',
      sapphire: 'Standard Bluesky post (same as blog)',
      longform: 'Standard Bluesky post with automatic threading support',
      whitewind: 'Whitewind blog entry (long-form content, titles, full HTML support)',
    },
    limits: {
      maxSinglePost: 280,
      threadSupport: true,
      autoThreading: true,
      lexiconsImplemented: false, // Currently all map to standard posts
    },
    note: 'Blog/sapphire/longform map to standard Bluesky posts (app.bsky.feed.post). Whitewind creates blog entries (com.whtwnd.blog.entry)'
  };
}

// Whitewind blog entry interface
export interface WhitewindBlogEntry {
  $type: 'com.whtwnd.blog.entry';
  content: string;
  createdAt: string;
  title?: string;
  subtitle?: string;
  visibility?: 'public' | 'url' | 'author';
}

// Create a Whitewind blog entry record
export function createWhitewindEntry(
  title: string, 
  content: string, 
  subtitle?: string
): WhitewindBlogEntry {
  const entry: WhitewindBlogEntry = {
    $type: 'com.whtwnd.blog.entry',
    content,
    createdAt: new Date().toISOString(),
    title,
    visibility: 'public'
  };
  
  if (subtitle) {
    entry.subtitle = subtitle;
  }
  
  return entry;
}

// Check if a lexicon is Whitewind
export function isWhitewindLexicon(lexicon: string): boolean {
  return lexicon === 'com.whtwnd.blog.entry';
}
