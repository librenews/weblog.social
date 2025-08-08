import { supportedLexicons, getLexiconByCategory, getLexiconInfo, createWhitewindEntry, isWhitewindLexicon, getLexiconFromPost } from '../src/lexicons.js';

describe('Lexicons', () => {
  describe('supportedLexicons', () => {
    it('should have all lexicons pointing to standard Bluesky posts', () => {
      expect(supportedLexicons.blog).toBe('app.bsky.feed.post');
      expect(supportedLexicons.sapphire).toBe('app.bsky.feed.post');
      expect(supportedLexicons.longform).toBe('app.bsky.feed.post');
      expect(supportedLexicons.default).toBe('app.bsky.feed.post');
    });
  });

  describe('getLexiconByCategory', () => {
    it('should return default lexicon for empty categories', () => {
      expect(getLexiconByCategory([])).toBe(supportedLexicons.default);
      expect(getLexiconByCategory()).toBe(supportedLexicons.default);
    });

    it('should return correct lexicon for recognized categories', () => {
      expect(getLexiconByCategory(['blog'])).toBe(supportedLexicons.blog);
      expect(getLexiconByCategory(['sapphire'])).toBe(supportedLexicons.sapphire);
      expect(getLexiconByCategory(['longform'])).toBe(supportedLexicons.longform);
    });

    it('should be case insensitive', () => {
      expect(getLexiconByCategory(['BLOG'])).toBe(supportedLexicons.blog);
      expect(getLexiconByCategory(['Blog'])).toBe(supportedLexicons.blog);
      expect(getLexiconByCategory(['bLoG'])).toBe(supportedLexicons.blog);
    });

    it('should return first matching category', () => {
      expect(getLexiconByCategory(['blog', 'sapphire'])).toBe(supportedLexicons.blog);
      expect(getLexiconByCategory(['unknown', 'longform'])).toBe(supportedLexicons.longform);
    });

    it('should return default for unrecognized categories', () => {
      expect(getLexiconByCategory(['unknown'])).toBe(supportedLexicons.default);
      expect(getLexiconByCategory(['random', 'categories'])).toBe(supportedLexicons.default);
    });
  });

  describe('getLexiconInfo', () => {
    it('should return comprehensive lexicon information', () => {
      const info = getLexiconInfo();
      
      expect(info).toHaveProperty('supported');
      expect(info).toHaveProperty('default');
      expect(info).toHaveProperty('descriptions');
      expect(info).toHaveProperty('limits');
      
      expect(Array.isArray(info.supported)).toBe(true);
      expect(info.supported).toContain('blog');
      expect(info.supported).toContain('sapphire');
      expect(info.supported).toContain('longform');
      
      expect(info.default).toBe(supportedLexicons.default);
      
      expect(info.limits.maxSinglePost).toBe(280);
      expect(info.limits.threadSupport).toBe(true);
      expect(info.limits.autoThreading).toBe(true);
    });

    it('should have descriptions for all supported lexicons', () => {
      const info = getLexiconInfo();
      
      expect(info.descriptions).toHaveProperty('blog');
      expect(info.descriptions).toHaveProperty('sapphire');
      expect(info.descriptions).toHaveProperty('longform');
      
      expect(typeof info.descriptions.blog).toBe('string');
      expect(typeof info.descriptions.sapphire).toBe('string');
      expect(typeof info.descriptions.longform).toBe('string');
    });
  });

  describe('Whitewind support', () => {
    it('should recognize whitewind category', () => {
      expect(getLexiconByCategory(['whitewind'])).toBe('com.whtwnd.blog.entry');
    });

    it('should identify whitewind lexicon correctly', () => {
      expect(isWhitewindLexicon('com.whtwnd.blog.entry')).toBe(true);
      expect(isWhitewindLexicon('app.bsky.feed.post')).toBe(false);
    });

    it('should create valid whitewind entry', () => {
      const title = 'Test Blog Post';
      const content = 'This is a test blog post content that can be much longer than a regular social media post.';
      const subtitle = 'A test subtitle';

      const entry = createWhitewindEntry(title, content, subtitle);

      expect(entry.$type).toBe('com.whtwnd.blog.entry');
      expect(entry.title).toBe(title);
      expect(entry.content).toBe(content);
      expect(entry.subtitle).toBe(subtitle);
      expect(entry.visibility).toBe('public');
      expect(entry.createdAt).toBeDefined();
      expect(new Date(entry.createdAt)).toBeInstanceOf(Date);
    });

    it('should create whitewind entry without subtitle', () => {
      const title = 'Test Blog Post';
      const content = 'This is a test blog post content.';

      const entry = createWhitewindEntry(title, content);

      expect(entry.$type).toBe('com.whtwnd.blog.entry');
      expect(entry.title).toBe(title);
      expect(entry.content).toBe(content);
      expect(entry.subtitle).toBeUndefined();
      expect(entry.visibility).toBe('public');
    });
  });

  describe('getLexiconFromPost', () => {
    it('should prefer lexicon parameter over categories', () => {
      expect(getLexiconFromPost('whitewind', ['blog'])).toBe('com.whtwnd.blog.entry');
      expect(getLexiconFromPost('blog', ['whitewind'])).toBe('app.bsky.feed.post');
    });

    it('should fallback to categories when no lexicon parameter', () => {
      expect(getLexiconFromPost(undefined, ['whitewind'])).toBe('com.whtwnd.blog.entry');
      expect(getLexiconFromPost(undefined, ['blog'])).toBe('app.bsky.feed.post');
    });

    it('should return default when neither lexicon nor categories match', () => {
      expect(getLexiconFromPost('unknown', ['unknown'])).toBe('app.bsky.feed.post');
      expect(getLexiconFromPost(undefined, [])).toBe('app.bsky.feed.post');
    });

    it('should handle full collection names in lexicon parameter', () => {
      expect(getLexiconFromPost('com.whtwnd.blog.entry')).toBe('com.whtwnd.blog.entry');
      expect(getLexiconFromPost('app.bsky.feed.post')).toBe('app.bsky.feed.post');
      expect(getLexiconFromPost('com.example.custom')).toBe('com.example.custom');
    });

    it('should be case insensitive for known lexicons', () => {
      expect(getLexiconFromPost('WHITEWIND')).toBe('com.whtwnd.blog.entry');
      expect(getLexiconFromPost('Blog')).toBe('app.bsky.feed.post');
    });
  });
});
