// Mock the @atproto/api module
jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    session: { did: 'did:plc:test123' },
    com: {
      atproto: {
        repo: {
          createRecord: jest.fn()
        }
      }
    }
  }))
}));

import { BskyAgent } from '@atproto/api';
import { publishToBluesky, authenticateUser } from '../src/bluesky-client';

const mockBskyAgent = BskyAgent as jest.MockedClass<typeof BskyAgent>;

describe('Bluesky Client', () => {
  let mockAgent: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAgent = {
      login: jest.fn(),
      session: { did: 'did:plc:test123' },
      com: {
        atproto: {
          repo: {
            createRecord: jest.fn()
          }
        }
      }
    };
    mockBskyAgent.mockImplementation(() => mockAgent);
  });

  describe('publishToBluesky', () => {
    const mockPost = {
      title: 'Test Title',
      body: 'Test content that is short enough for a single post.',
      tags: ['test'],
      lexicon: 'app.bsky.feed.post'
    };

    it('should publish a short post successfully', async () => {
      mockAgent.login.mockResolvedValue(undefined);
      mockAgent.com.atproto.repo.createRecord.mockResolvedValue({
        data: { uri: 'at://did:plc:test/app.bsky.feed.post/123', cid: 'bafytest' }
      });

      const result = await publishToBluesky('test.bsky.social', 'app-password', mockPost);

      expect(mockBskyAgent).toHaveBeenCalledWith({ service: 'https://bsky.social' });
      expect(mockAgent.login).toHaveBeenCalledWith({
        identifier: 'test.bsky.social',
        password: 'app-password'
      });
      expect(mockAgent.com.atproto.repo.createRecord).toHaveBeenCalledWith({
        repo: 'did:plc:test123',
        collection: 'app.bsky.feed.post',
        record: expect.objectContaining({
          text: 'Test Title\n\nTest content that is short enough for a single post.',
          $type: 'app.bsky.feed.post',
          createdAt: expect.any(String)
        })
      });
      expect(result).toBe('at://did:plc:test/app.bsky.feed.post/123');
    });

    it('should create a thread for long posts', async () => {
      const longPost = {
        title: 'Long Title',
        body: 'This is a very long post content that exceeds the 280 character limit. '.repeat(10),
        tags: ['longform'],
        lexicon: 'app.bsky.feed.post'
      };

      mockAgent.login.mockResolvedValue(undefined);
      mockAgent.com.atproto.repo.createRecord
        .mockResolvedValueOnce({
          data: { uri: 'at://did:plc:test/app.bsky.feed.post/123', cid: 'bafytest1' }
        })
        .mockResolvedValueOnce({
          data: { uri: 'at://did:plc:test/app.bsky.feed.post/124', cid: 'bafytest2' }
        })
        .mockResolvedValueOnce({
          data: { uri: 'at://did:plc:test/app.bsky.feed.post/125', cid: 'bafytest3' }
        });

      const result = await publishToBluesky('test.bsky.social', 'app-password', longPost);

      expect(mockAgent.com.atproto.repo.createRecord).toHaveBeenCalledTimes(3);
      expect(result).toBe('at://did:plc:test/app.bsky.feed.post/123'); // Should return first post URI
    });

    it('should handle posts without titles', async () => {
      const postWithoutTitle = {
        title: '',
        body: 'Just body content without a title.',
        tags: [],
        lexicon: 'app.bsky.feed.post'
      };

      mockAgent.login.mockResolvedValue(undefined);
      mockAgent.com.atproto.repo.createRecord.mockResolvedValue({
        data: { uri: 'at://did:plc:test/app.bsky.feed.post/125', cid: 'bafytest3' }
      });

      await publishToBluesky('test.bsky.social', 'app-password', postWithoutTitle);

      expect(mockAgent.com.atproto.repo.createRecord).toHaveBeenCalledWith({
        repo: 'did:plc:test123',
        collection: 'app.bsky.feed.post',
        record: expect.objectContaining({
          text: 'Just body content without a title.',
          $type: 'app.bsky.feed.post'
        })
      });
    });

    it('should throw error for missing credentials', async () => {
      await expect(publishToBluesky('', 'app-password', mockPost))
        .rejects.toThrow('Handle and app password are required');

      await expect(publishToBluesky('test.bsky.social', '', mockPost))
        .rejects.toThrow('Handle and app password are required');

      expect(mockAgent.login).not.toHaveBeenCalled();
    });

    it('should throw error for authentication failure', async () => {
      mockAgent.session = null; // Simulate auth failure

      await expect(publishToBluesky('test.bsky.social', 'wrong-password', mockPost))
        .rejects.toThrow('Failed to authenticate with Bluesky');
    });

    it('should handle login errors gracefully', async () => {
      mockAgent.login.mockRejectedValue(new Error('Invalid identifier or password'));

      await expect(publishToBluesky('test.bsky.social', 'wrong-password', mockPost))
        .rejects.toThrow('Invalid Bluesky handle or app password');
    });

    it('should handle createRecord errors', async () => {
      mockAgent.login.mockResolvedValue(undefined);
      mockAgent.com.atproto.repo.createRecord.mockRejectedValue(new Error('Network error'));

      await expect(publishToBluesky('test.bsky.social', 'app-password', mockPost))
        .rejects.toThrow('Network error');
    });
  });

  describe('authenticateUser', () => {
    it('should return true for successful authentication', async () => {
      mockAgent.login.mockResolvedValue(undefined);

      const result = await authenticateUser('test.bsky.social', 'app-password');

      expect(result).toBe(true);
      expect(mockAgent.login).toHaveBeenCalledWith({
        identifier: 'test.bsky.social',
        password: 'app-password'
      });
    });

    it('should return false for failed authentication', async () => {
      mockAgent.login.mockRejectedValue(new Error('Invalid credentials'));

      const result = await authenticateUser('test.bsky.social', 'wrong-password');

      expect(result).toBe(false);
    });

    it('should return false for missing session', async () => {
      mockAgent.login.mockResolvedValue(undefined);
      mockAgent.session = null;

      const result = await authenticateUser('test.bsky.social', 'app-password');

      expect(result).toBe(false);
    });
  });
});
