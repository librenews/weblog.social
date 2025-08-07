export const supportedLexicons = {
  blog: 'app.bsky.feed.post', // Standard Bluesky post
  sapphire: 'app.bsky.feed.post', // Use standard for now
  longform: 'app.bsky.feed.post', // Standard feed post
  default: 'app.bsky.feed.post', // Use standard Bluesky posts as default
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
      blog: 'Standard Bluesky post (280 chars, threads for longer content)',
      sapphire: 'Standard Bluesky post format',
      longform: 'Standard Bluesky post with thread support for long content',
    },
    limits: {
      maxSinglePost: 280,
      threadSupport: true,
      autoThreading: true
    }
  };
}
