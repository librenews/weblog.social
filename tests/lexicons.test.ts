import { getLexiconByCategory, getLexiconInfo, supportedLexicons } from '../src/lexicons';

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
});
