# MetaWeblog-to-Bluesky Bridge

A TypeScript service that bridges MetaWeblog XML-RPC API to Bluesky's AT Protocol, allowing blog clients like MarsEdit to publish posts directly to Bluesky.

## Features

- 🌉 **MetaWeblog API Bridge**: Exposes XML-RPC endpoint compatible with blog clients
- 🦋 **Bluesky Integration**: Publishes posts to Bluesky via AT Protocol
- 🔐 **Secure Authentication**: Uses Bluesky handle + app password for authentication
- 📝 **Custom Lexicons**: Support for different post types via lexicon selection
- 🚀 **TypeScript**: Fully typed with modern ES modules

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

- ✅ `metaWeblog.newPost` - Create new posts
- ✅ `blogger.getUsersBlogs` - Get user blog info
- ✅ `blogger.getUserInfo` - Get user information
- ⚠️ `metaWeblog.editPost` - Not yet supported
- ⚠️ `metaWeblog.getPost` - Not yet supported
- ⚠️ `metaWeblog.getRecentPosts` - Not yet supported

## Lexicons

The bridge supports multiple AT Protocol lexicons for different post types:

- `org.sapphire.topic.post` (default) - Sapphire topic posts
- `com.example.blog.post` - Standard blog posts
- `app.bsky.feed.post` - Standard Bluesky posts

Select lexicon by including category tags in your post (e.g., "sapphire", "blog", "longform").

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

- [ ] Support for post editing and deletion
- [ ] Media upload support (images, videos)
- [ ] User preferences storage
- [ ] Rate limiting and monitoring
- [ ] Docker deployment
- [ ] Multiple AT Protocol service support

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

**Authentication Failed**: Ensure you're using the correct Bluesky handle and app password.

**XML-RPC Parse Errors**: Check that your blog client is sending properly formatted XML-RPC requests.

**Lexicon Errors**: Verify the lexicon exists and you have permission to create records with it.

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
