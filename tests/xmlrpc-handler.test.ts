import { handleMetaWeblogCall } from '../src/xmlrpc-handler';
import * as blueskyClient from '../src/bluesky-client';

// Mock the bluesky client
jest.mock('../src/bluesky-client');
const mockPublishToBluesky = jest.mocked(blueskyClient.publishToBluesky);

// Mock the @atproto/api module for getPost testing
jest.mock('@atproto/api', () => ({
  BskyAgent: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    session: { did: 'did:plc:test123' },
    com: {
      atproto: {
        repo: {
          getRecord: jest.fn()
        }
      }
    }
  }))
}));

import { BskyAgent } from '@atproto/api';

describe('XML-RPC Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleMetaWeblogCall', () => {
    describe('metaWeblog.newPost', () => {
      it('should handle new post creation successfully', async () => {
        const mockUri = 'at://did:plc:example/app.bsky.feed.post/123';
        mockPublishToBluesky.mockResolvedValue(mockUri);

        const params = [
          '1', // blogId
          'test.bsky.social', // handle
          'app-password', // appPassword
          {
            title: 'Test Post',
            description: 'This is a test post content.',
            categories: ['blog']
          },
          true // publish
        ];

        const result = await handleMetaWeblogCall('metaWeblog.newPost', params);
        
        expect(result).toBe(mockUri);
        expect(mockPublishToBluesky).toHaveBeenCalledWith(
          'test.bsky.social',
          'app-password',
          {
            title: 'Test Post',
            body: 'This is a test post content.',
            tags: ['blog'],
            lexicon: 'app.bsky.feed.post',
            keywords: undefined,
            excerpt: undefined
          }
        );
      });

      it('should handle posts without title', async () => {
        const mockUri = 'at://did:plc:example/app.bsky.feed.post/123';
        mockPublishToBluesky.mockResolvedValue(mockUri);

        const params = [
          '1',
          'test.bsky.social',
          'app-password',
          {
            description: 'Content without title.',
            categories: []
          },
          true
        ];

        const result = await handleMetaWeblogCall('metaWeblog.newPost', params);
        
        expect(result).toBe(mockUri);
        expect(mockPublishToBluesky).toHaveBeenCalledWith(
          'test.bsky.social',
          'app-password',
          {
            title: 'Untitled Post',
            body: 'Content without title.',
            tags: [],
            lexicon: 'app.bsky.feed.post',
            keywords: undefined,
            excerpt: undefined
          }
        );
      });

      it('should handle posts with metadata', async () => {
        const mockUri = 'at://did:plc:example/app.bsky.feed.post/123';
        mockPublishToBluesky.mockResolvedValue(mockUri);

        const params = [
          '1',
          'test.bsky.social',
          'app-password',
          {
            title: 'Post with Metadata',
            description: 'Content with extra metadata.',
            categories: ['tech', 'programming'],
            mt_keywords: 'javascript, typescript, coding',
            mt_excerpt: 'A brief excerpt of the post'
          },
          true
        ];

        const result = await handleMetaWeblogCall('metaWeblog.newPost', params);
        
        expect(mockPublishToBluesky).toHaveBeenCalledWith(
          'test.bsky.social',
          'app-password',
          {
            title: 'Post with Metadata',
            body: 'Content with extra metadata.',
            tags: ['tech', 'programming'],
            lexicon: 'app.bsky.feed.post',
            keywords: 'javascript, typescript, coding',
            excerpt: 'A brief excerpt of the post'
          }
        );
      });

      it('should throw error for missing credentials', async () => {
        const params = [
          '1',
          '', // empty handle
          'app-password',
          { title: 'Test', description: 'Test content' },
          true
        ];

        await expect(handleMetaWeblogCall('metaWeblog.newPost', params))
          .rejects.toThrow('Handle and app password are required');

        expect(mockPublishToBluesky).not.toHaveBeenCalled();
      });

      it('should throw error for empty post content', async () => {
        const params = [
          '1',
          'test.bsky.social',
          'app-password',
          { title: '', description: '' }, // both empty
          true
        ];

        await expect(handleMetaWeblogCall('metaWeblog.newPost', params))
          .rejects.toThrow('Post must have either title or description');

        expect(mockPublishToBluesky).not.toHaveBeenCalled();
      });
    });

    describe('metaWeblog.getPost', () => {
      it('should retrieve a post successfully', async () => {
        const mockBskyAgent = jest.mocked(BskyAgent);
        const mockAgent = {
          login: jest.fn().mockResolvedValue(undefined),
          session: { did: 'did:plc:test123' },
          com: {
            atproto: {
              repo: {
                getRecord: jest.fn().mockResolvedValue({
                  data: {
                    value: {
                      text: 'Test post content',
                      createdAt: '2023-08-07T10:00:00.000Z'
                    }
                  }
                })
              }
            }
          }
        };
        mockBskyAgent.mockImplementation(() => mockAgent as any);

        const params = ['at://did:plc:test/app.bsky.feed.post/123', 'test.bsky.social', 'app-password'];
        
        const result = await handleMetaWeblogCall('metaWeblog.getPost', params);
        
        expect(result).toEqual({
          title: 'Untitled Post',
          description: 'Test post content',
          dateCreated: '2023-08-07T10:00:00.000Z',
          categories: []
        });
        expect(mockAgent.login).toHaveBeenCalledWith({
          identifier: 'test.bsky.social',
          password: 'app-password'
        });
        expect(mockAgent.com.atproto.repo.getRecord).toHaveBeenCalledWith({
          repo: 'did:plc:test123',
          collection: 'app.bsky.feed.post',
          rkey: '123'
        });
      });
    });

    describe('blogger.getUsersBlogs', () => {
      it('should return user blog information', async () => {
        const result = await handleMetaWeblogCall('blogger.getUsersBlogs', []);
        
        expect(result).toEqual([{
          blogid: '1',
          blogName: 'Bluesky Blog',
          url: 'https://bsky.social'
        }]);
      });
    });

    describe('blogger.getUserInfo', () => {
      it('should return user information', async () => {
        const params = ['test.bsky.social', 'app-password'];
        
        const result = await handleMetaWeblogCall('blogger.getUserInfo', params);
        
        expect(result).toEqual({
          userid: 'test.bsky.social',
          nickname: 'test.bsky.social',
          email: 'test.bsky.social@bsky.social',
          lastname: '',
          firstname: 'test',
          url: 'https://bsky.social/profile/test.bsky.social'
        });
      });

      it('should handle handles without dots', async () => {
        const params = ['testuser', 'app-password'];
        
        const result = await handleMetaWeblogCall('blogger.getUserInfo', params) as any;
        
        expect(result.firstname).toBe('testuser');
        expect(result.url).toBe('https://bsky.social/profile/testuser');
      });
    });

    describe('unsupported methods', () => {
      it('should throw error for editPost', async () => {
        await expect(handleMetaWeblogCall('metaWeblog.editPost', []))
          .rejects.toThrow('Post editing is not yet supported');
      });

      it('should throw error for getPost with missing parameters', async () => {
        await expect(handleMetaWeblogCall('metaWeblog.getPost', []))
          .rejects.toThrow('Post ID, handle, and app password are required');
      });

      it('should throw error for getRecentPosts', async () => {
        await expect(handleMetaWeblogCall('metaWeblog.getRecentPosts', []))
          .rejects.toThrow('Getting recent posts is not yet supported');
      });

      it('should throw error for unknown methods', async () => {
        await expect(handleMetaWeblogCall('unknown.method', []))
          .rejects.toThrow('Method unknown.method not implemented');
      });
    });
  });
});
