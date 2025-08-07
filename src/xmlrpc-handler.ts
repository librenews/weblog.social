import { publishToBluesky } from './bluesky-client.js';
import { getLexiconByCategory } from './lexicons.js';

interface MetaWeblogPost {
  title: string;
  description: string;
  categories?: string[];
  dateCreated?: Date;
  mt_keywords?: string;
  mt_excerpt?: string;
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

  // Determine lexicon from categories or use default
  const lexicon = getLexiconByCategory(post.categories);

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
}

async function handleEditPost(params: any[]) {
  // For now, editing is not supported in AT Protocol
  // This would require storing post mappings
  throw new Error('Post editing is not yet supported');
}

async function handleGetPost(params: any[]) {
  // For now, getting individual posts is not supported
  // This would require storing post mappings
  throw new Error('Getting individual posts is not yet supported');
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
