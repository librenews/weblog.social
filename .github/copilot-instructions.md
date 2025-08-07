<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a MetaWeblog-to-Bluesky bridge service built with TypeScript and Node.js. The service:

1. Exposes a MetaWeblog XML-RPC endpoint for blog clients like MarsEdit
2. Authenticates users with Bluesky using handle + app password
3. Converts blog posts to AT Protocol records using custom lexicons
4. Publishes posts to Bluesky via the AT Protocol

Key components:
- Express server with XML-RPC handling
- AT Protocol integration via @atproto/api
- Support for multiple lexicons for different post types
- MetaWeblog API compatibility

When working with this codebase:
- Follow TypeScript best practices and strict typing
- Use ES modules (import/export syntax)
- Handle errors gracefully, especially for network operations
- Log important operations for debugging
- Follow the MetaWeblog API specification for compatibility
- Use the AT Protocol SDK properly for Bluesky integration
