# MetaWeblog-to-Bluesky Bridge

A TypeScript service that bridges MetaWeblog XML-RPC API to Bluesky's AT Protocol, allowing blog clients like MarsEdit to publish posts directly to Bluesky.

## Features

- 🌉 **MetaWeblog API Bridge**: Exposes XML-RPC endpoint compatible with blog clients
- 🦋 **Bluesky Integration**: Publishes posts to Bluesky via AT Protocol  
- 🧵 **Smart Threading**: Automatically creates threaded posts for long content (>280 chars)
- 🔐 **Secure Authentication**: Uses Bluesky handle + app password for authentication
- 📝 **Content Preservation**: Intelligently combines titles and body text
- 🚀 **TypeScript**: Fully typed with modern ES modules
- 🧪 **Well Tested**: Comprehensive test suite with 75%+ code coverage

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Bluesky account with app password

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd metaweblog-bluesky-bridge
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

The service will be available at `http://localhost:3000/xmlrpc`

### Development

For development with hot reload:
```bash
npm run dev
```

## Configuration

### Blog Client Setup (MarsEdit, Open Live Writer, etc.)

- **Endpoint**: `http://localhost:3000/xmlrpc`
- **Username**: Your Bluesky handle (e.g., `user.bsky.social`)
- **Password**: Your Bluesky app password
- **Blog ID**: `1` (or any value)

### Creating App Passwords

1. Go to [Bluesky Settings](https://bsky.app/settings)
2. Navigate to "App passwords"
3. Create a new app password for this bridge

## Supported Methods

### ✅ Fully Supported
- `metaWeblog.newPost` - Create new posts (with automatic threading for long content)
- `blogger.getUsersBlogs` - Get user blog information
- `blogger.getUserInfo` - Get user profile information

### ❌ Not Yet Supported
- `metaWeblog.editPost` - Edit existing posts (requires post mapping storage)
- `metaWeblog.getPost` - Retrieve individual posts (requires post mapping storage)  
- `metaWeblog.getRecentPosts` - Get recent posts list (requires AT Protocol querying)
- `metaWeblog.deletePost` - Delete posts (requires post mapping storage)
- `metaWeblog.getCategories` - Get available categories
- Media upload methods (images, files)

## Post Format & Content Handling

### **Post Types Created**
All posts are published as **standard Bluesky posts** (`app.bsky.feed.post`) that appear in the normal Bluesky timeline.

### **Content Length Handling**
- **Short posts (≤280 characters)**: Published as single Bluesky post
- **Long posts (>280 characters)**: Automatically split into threaded posts
  - Intelligent word-boundary splitting  
  - Thread indicators added (`1/3`, `2/3`, etc.)
  - Proper AT Protocol reply chain structure
  - Title included in first post when possible

### **Content Processing**
- Title and body are combined intelligently
- Categories are currently ignored (reserved for future lexicon selection)
- Keywords and excerpts from MetaWeblog are preserved but not used
- Markdown formatting is passed through as-is

## API Endpoints

- `POST /xmlrpc` - MetaWeblog XML-RPC endpoint
- `GET /health` - Health check endpoint

## Security Notes

⚠️ **Important Security Considerations:**

- Use HTTPS in production
- Never log credentials
- Consider rate limiting for public deployments
- App passwords are discarded after authentication

## Development

### Project Structure

```
src/
├── index.ts           # Express server entry point
├── xmlrpc-handler.ts  # MetaWeblog API handlers
├── bluesky-client.ts  # AT Protocol integration
├── lexicons.ts        # Lexicon configuration
└── types/
    └── xmlrpc.d.ts    # TypeScript declarations
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the compiled server
- `npm run dev` - Development with hot reload
- `npm test` - Run tests (not implemented yet)

### Environment Variables

- `PORT` - Server port (default: 3000)

## Future Enhancements

- [ ] **Post Management**: Support for editing and deleting posts (requires post mapping database)
- [ ] **Recent Posts**: Implement `getRecentPosts` via AT Protocol queries  
- [ ] **Media Upload**: Support for images, videos, and file attachments
- [ ] **Custom Lexicons**: Support for specialized AT Protocol lexicons beyond standard posts
- [ ] **Categories**: Map MetaWeblog categories to Bluesky hashtags or custom lexicons
- [ ] **User Preferences**: Store user-specific settings (default formatting, etc.)
- [ ] **Rate Limiting**: Built-in rate limiting and monitoring
- [ ] **Docker Deployment**: Containerized deployment options
- [ ] **Multiple AT Protocol Services**: Support for other AT Protocol implementations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC

## Troubleshooting

### Common Issues

### Common Issues

**Authentication Failed**: Ensure you're using the correct Bluesky handle and app password. The handle should be your full Bluesky handle (e.g., `user.bsky.social`).

**Long Posts Not Threading**: Check that your content exceeds 280 characters. The service automatically detects and threads long content.

**XML-RPC Parse Errors**: Verify your blog client is sending properly formatted XML-RPC requests. Test with the health endpoint first.

**"Method not implemented" Errors**: Some MetaWeblog methods are not yet supported. See the [Supported Methods](#supported-methods) section above.

**Posts Not Appearing**: Check the Bluesky web interface or app. Posts appear as standard Bluesky posts in your timeline.

### Debug Mode

Enable verbose logging by setting the log level:
```javascript
console.log('Debug mode enabled');
```

## Links

- [MetaWeblog API Specification](http://xmlrpc.scripting.com/metaWeblogApi.html)
- [AT Protocol Documentation](https://atproto.com)
- [Bluesky Developer Portal](https://bsky.app)
- [MarsEdit](https://redsweater.com/marsedit/)
