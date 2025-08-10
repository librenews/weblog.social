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
    any,
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
    const lexiconField = post.custom_fields.find((field: any) => 
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

  console.log('Getting post with ID:', postId);
  console.log('For user:', handle);

  try {
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    await agent.login({ identifier: handle, password: appPassword });

    if (!agent.session?.did) {
      throw new Error('Failed to authenticate with Bluesky');
    }

    // Parse AT Protocol URI: at://did:plc:xxx/collection/recordkey
    const postUri = postId;
    if (!postUri.startsWith('at://')) {
      console.error('Invalid AT Protocol URI format:', postUri);
      throw new Error('Invalid post URI format - must be AT Protocol URI');
    }

    // Split at:// URI: at://did:plc:xxx/collection/recordkey
    const uriWithoutProtocol = postUri.slice(5); // Remove "at://"
    const parts = uriWithoutProtocol.split('/');
    
    if (parts.length < 3) {
      console.error('AT Protocol URI has insufficient parts:', parts);
      throw new Error('Invalid AT Protocol URI structure');
    }
    
    const did = parts[0]; // did:plc:xxx
    const collection = parts[1]; // e.g., "app.bsky.feed.post" or "com.whtwnd.blog.entry"
    const rkey = parts[2]; // The record key

    if (!collection || !rkey) {
      console.error('Failed to extract collection and rkey from URI:', postUri);
      throw new Error('Could not extract collection and record key from URI');
    }

    console.log('Parsed URI - DID:', did, 'Collection:', collection, 'RKey:', rkey);

    // Verify the DID matches the authenticated user
    if (did !== agent.session.did) {
      console.error('DID mismatch - URI DID:', did, 'Session DID:', agent.session.did);
      throw new Error('Post does not belong to authenticated user');
    }

    const response = await agent.com.atproto.repo.getRecord({
      repo: agent.session.did,
      collection: collection,
      rkey: rkey,
    });

    console.log('Successfully retrieved record:', response.data.uri);

    // The AT Protocol response structure has the record data in response.data.value
    const record = response.data.value as any;

    // Handle different record types
    if (collection === 'com.whtwnd.blog.entry') {
      // Whitewind blog entry
      return {
        postid: postId,
        title: record.title || 'Untitled Post',
        description: record.content || '',
        dateCreated: new Date(record.createdAt || Date.now()),
        categories: [],
        custom_fields: [
          { key: 'lexicon', value: 'whitewind' }
        ]
      };
    } else {
      // Standard Bluesky post
      return {
        postid: postId,
        title: record.title || 'Untitled Post',
        description: record.text || '',
        dateCreated: new Date(record.createdAt || Date.now()),
        categories: record.tags || [],
      };
    }
  } catch (error) {
    console.error('Failed to retrieve post from Bluesky:', error);
    console.error('Error details:', {
      postId,
      handle,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to retrieve post: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
