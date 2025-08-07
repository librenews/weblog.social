export const supportedLexicons = {
  blog: 'app.bsky.feed.post', 
  sapphire: 'app.bsky.feed.post', 
  longform: 'app.bsky.feed.post', 
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

export function getLexiconInfo() {
  return {
    supported: Object.keys(supportedLexicons),
    default: supportedLexicons.default,
    descriptions: {
      blog: 'Standard Bluesky post (280 chars max, auto-threads longer content)',
      sapphire: 'Standard Bluesky post (same as blog)',
      longform: 'Standard Bluesky post with automatic threading support',
    },
    limits: {
      maxSinglePost: 280,
      threadSupport: true,
      autoThreading: true,
      lexiconsImplemented: false, // Currently all map to standard posts
    },
    note: 'All categories currently map to standard Bluesky posts (app.bsky.feed.post)'
  };
}
