import { publishToBluesky } from './bluesky-client.js';
import { getLexiconByCategory, getLexiconFromPost } from './lexicons.js';
import { BskyAgent } from '@atproto/api';

interface MetaWeblogPost {
  title: string;
  description: string;
  categories?: string[];
  dateCreated?: Date;
  mt_keywords?: string;
  mt_excerpt?: string;
  custom_fields?: Array<{
    key: string;
    value: string;
  }>;
  // Support direct lexicon field (some clients)
  lexicon?: string;
}

export async function handleMetaWeblogCall(methodName: string, params: any[]) {
  switch (methodName) {
    case 'metaWeblog.newPost':
      return await handleNewPost(params);
    
    case 'metaWeblog.editPost':
      return await handleEditPost(params);
    
    case 'metaWeblog.getPost':
      return await handleGetPost(params);
    
    case 'metaWeblog.getRecentPosts':
      return await handleGetRecentPosts(params);
    
    case 'blogger.getUsersBlogs':
      return await handleGetUserBlogs(params);
    
    case 'blogger.getUserInfo':
      return await handleGetUserInfo(params);
    
    default:
      throw new Error(`Method ${methodName} not implemented`);
  }
}

async function handleNewPost(params: any[]) {
  const [blogId, handle, appPassword, post, publish] = params as [
    string,
    string,
    string,
    MetaWeblogPost,
    boolean
  ];

  if (!handle || !appPassword) {
    throw new Error('Handle and app password are required');
  }

  if (!post.title && !post.description) {
    throw new Error('Post must have either title or description');
  }

  // Extract lexicon from custom fields or direct parameter
  let lexiconParam = post.lexicon;
  if (!lexiconParam && post.custom_fields) {
    const lexiconField = post.custom_fields.find(field => 
      field.key.toLowerCase() === 'lexicon'
    );
    lexiconParam = lexiconField?.value;
  }

  // Determine lexicon from custom field, categories, or use default
  const lexicon = getLexiconFromPost(lexiconParam, post.categories);
  
  try {

  const blueskyPost = {
    title: post.title || 'Untitled Post',
    body: post.description || '',
    tags: post.categories || [],
    lexicon,
    keywords: post.mt_keywords,
    excerpt: post.mt_excerpt
  };

  const result = await publishToBluesky(handle, appPassword, blueskyPost);
  return result;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

async function handleEditPost(params: any[]) {
  // For now, editing is not supported in AT Protocol
  // This would require storing post mappings
  throw new Error('Post editing is not yet supported');
}

async function handleGetPost(params: any[]) {
  const [postId, handle, appPassword] = params as [string, string, string];

  if (!postId || !handle || !appPassword) {
    throw new Error('Post ID, handle, and app password are required');
  }

  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: handle, password: appPassword });

    if (!agent.session?.did) {
      throw new Error('Failed to authenticate with Bluesky');
    }

    const response = await agent.com.atproto.repo.getRecord({
      repo: agent.session.did,
      collection: 'app.bsky.feed.post',
      rkey: postId.split('/').pop()!, // Extract record key from the post URL
    });

    // The AT Protocol response structure has the record data in response.data.value
    const record = response.data.value as any;

    return {
      title: record.title || 'Untitled Post',
      description: record.text || '',
      dateCreated: record.createdAt || new Date().toISOString(),
      categories: record.tags || [],
    };
  } catch (error) {
    console.error('Failed to retrieve post from Bluesky:', error);
    throw new Error('Failed to retrieve post');
  }
}

async function handleGetRecentPosts(params: any[]) {
  // For now, getting recent posts is not supported
  // This would require querying the AT Protocol repo
  throw new Error('Getting recent posts is not yet supported');
}

async function handleGetUserBlogs(params: any[]) {
  // Return a single blog entry for the user
  return [{
    blogid: '1',
    blogName: 'Bluesky Blog',
    url: 'https://bsky.social'
  }];
}

async function handleGetUserInfo(params: any[]) {
  const [handle, appPassword] = params as [string, string];
  
  return {
    userid: handle,
    nickname: handle,
    email: `${handle}@bsky.social`,
    lastname: '',
    firstname: handle.split('.')[0] || handle,
    url: `https://bsky.social/profile/${handle}`
  };
}
