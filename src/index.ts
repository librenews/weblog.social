import express from 'express';
import bodyParser from 'body-parser';
import * as xmlrpc from 'xmlrpc';
import { handleMetaWeblogCall } from './xmlrpc-handler.js';

const app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

app.post('/xmlrpc', async (req, res) => {
  try {
    // Dynamic import of xmlrpc internal modules
    // @ts-ignore - xmlrpc internal modules don't have type declarations
    const { default: Deserializer } = await import('xmlrpc/lib/deserializer.js');
    // @ts-ignore - xmlrpc internal modules don't have type declarations
    const Serializer = await import('xmlrpc/lib/serializer.js');

    // Create deserializer instance
    const deserializer = new Deserializer();

    // Create a readable stream from the request body
    const { Readable } = await import('stream');
    const stream = new Readable();
    stream.push(req.body);
    stream.push(null); // End the stream

    // Parse the XML-RPC method call
    deserializer.deserializeMethodCall(stream, async (error: any, methodName: string, params: any[]) => {
      if (error) {
        console.error('XML-RPC parse error:', error);
        return res.status(500).send('Invalid XML-RPC request');
      }

      try {
        console.log(`Handling method: ${methodName}`);
        const response = await handleMetaWeblogCall(methodName, params);
        const xml = Serializer.serializeMethodResponse(response);
        res.set('Content-Type', 'text/xml');
        res.send(xml);
      } catch (err: unknown) {
        console.error('Method call error:', err);
        const fault = Serializer.serializeFault({
          faultCode: 1,
          faultString: (err as Error).message,
        });
        res.set('Content-Type', 'text/xml');
        res.send(fault);
      }
    });
  } catch (importError) {
    console.error('Failed to import xmlrpc modules:', importError);
    res.status(500).send('Server configuration error');
  }
});

// Home page with documentation and marketing content
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MetaWeblog-to-Bluesky Bridge</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .hero {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 40px;
            margin-bottom: 30px;
            text-align: center;
        }
        h1 {
            color: #2563eb;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 1.2em;
            color: #6b7280;
            margin-bottom: 30px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .feature h3 {
            color: #1e40af;
            margin-bottom: 10px;
        }
        .docs {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 40px;
        }
        .docs h2 {
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .setup-step {
            background: #f8fafc;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .setup-step h3 {
            color: #1e40af;
            margin-bottom: 10px;
        }
        code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
        }
        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            overflow-x: auto;
        }
        .endpoint {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: white;
        }
        .footer a {
            color: #bfdbfe;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>🌉 MetaWeblog ↔ Bluesky Bridge</h1>
            <p class="subtitle">Connect your favorite blog editor to Bluesky's decentralized social network</p>
            
            <div class="features">
                <div class="feature">
                    <h3>📝 Blog Editors</h3>
                    <p>Use MarsEdit, Windows Live Writer, or any MetaWeblog-compatible editor</p>
                </div>
                <div class="feature">
                    <h3>🦋 Bluesky Integration</h3>
                    <p>Posts are published directly to your Bluesky account via AT Protocol</p>
                </div>
                <div class="feature">
                    <h3>� Multiple Formats</h3>
                    <p>Supports standard posts and Whitewind blog entries with full content</p>
                </div>
            </div>
        </div>

        <div class="docs">
            <h2>🚀 Quick Setup Guide</h2>

            <div class="setup-step">
                <h3>Step 1: Get Your Bluesky App Password</h3>
                <p>Go to <strong>Bluesky Settings > Privacy and Security > App Passwords</strong> and create a new app password for this bridge service.</p>
                <div class="warning">
                    <strong>⚠️ Important:</strong> Use an app password, not your main Bluesky password!
                </div>
            </div>

            <div class="setup-step">
                <h3>Step 2: Configure Your Blog Editor</h3>
                <p>Add a new blog account in your MetaWeblog-compatible editor with these settings:</p>
                <div class="endpoint">
                    <strong>XML-RPC Endpoint:</strong> <code>https://weblog.social/xmlrpc</code><br>
                    <strong>Blog ID:</strong> <code>1</code> (any value works)<br>
                    <strong>Username:</strong> Your Bluesky handle (e.g., <code>username.bsky.social</code>)<br>
                    <strong>Password:</strong> Your Bluesky app password
                </div>
                <div class="warning">
                    <strong>💡 Post Format:</strong> Use a custom field to control post format:
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li><strong>Custom Field:</strong> <code>lexicon = whitewind</code> - Creates Whitewind blog entries</li>
                        <li><strong>Custom Field:</strong> <code>lexicon = blog</code> - Standard Bluesky posts (auto-threaded)</li>
                        <li><strong>No custom field</strong> - Default Bluesky posts</li>
                    </ul>
                    <p style="margin-top: 10px;"><em>In MarsEdit: Blog Settings > Custom Fields > Add "lexicon"</em></p>
                </div>
            </div>

            <div class="setup-step">
                <h3>Step 3: Start Publishing!</h3>
                <p>Create and publish posts from your editor - they'll appear on Bluesky automatically! Long posts are split into threads, and you can retrieve previously published posts.</p>
            </div>

            <h2>📖 Supported Methods</h2>
            <ul style="margin-left: 30px; margin-bottom: 20px;">
                <li><strong>metaWeblog.newPost</strong> - Create new posts (✅ Fully supported)</li>
                <li><strong>metaWeblog.getPost</strong> - Retrieve individual posts (✅ Fully supported)</li>
                <li><strong>blogger.getUsersBlogs</strong> - Get blog information (✅ Supported)</li>
                <li><strong>blogger.getUserInfo</strong> - Get user information (✅ Supported)</li>
                <li><strong>metaWeblog.editPost</strong> - Edit existing posts (❌ Not supported by AT Protocol)</li>
                <li><strong>metaWeblog.getRecentPosts</strong> - Get recent posts (🔄 Coming soon)</li>
            </ul>

            <h2>🎯 Popular Blog Editors</h2>
            <div class="features">
                <div class="feature">
                    <h3>MarsEdit (Mac)</h3>
                    <p>Premium blog editor with excellent MetaWeblog support</p>
                </div>
                <div class="feature">
                    <h3>Open Live Writer</h3>
                    <p>Free, open-source editor for Windows</p>
                </div>
                <div class="feature">
                    <h3>BlogDesk</h3>
                    <p>Lightweight Windows blog editor</p>
                </div>
            </div>

            <h2>🔧 Advanced Features</h2>
            <ul style="margin-left: 30px;">
                <li><strong>Custom Field Support:</strong> Use <code>lexicon</code> custom field to control post format</li>
                <li><strong>Multiple Lexicons:</strong> Support for Bluesky posts and Whitewind blog entries</li>
                <li><strong>Thread Creation:</strong> Long posts automatically split into Twitter-style threads</li>
                <li><strong>Full Content Support:</strong> Whitewind entries support long-form content without truncation</li>
                <li><strong>Error Handling:</strong> Detailed error messages for troubleshooting</li>
                <li><strong>Authentication:</strong> Secure app password authentication</li>
            </ul>

            <h2>📝 Supported Post Types</h2>
            <div class="features">
                <div class="feature">
                    <h3>Standard Bluesky Posts</h3>
                    <p>Default format, 280 chars, auto-threaded for longer content</p>
                    <code>lexicon = blog (or no custom field)</code>
                </div>
                <div class="feature">
                    <h3>Whitewind Blog Entries</h3>
                    <p>Long-form blog posts with titles, subtitles, and full content</p>
                    <code>lexicon = whitewind</code>
                </div>
            </div>

            <div class="warning">
                <strong>🔒 Privacy Note:</strong> This bridge service processes your credentials locally and communicates directly with Bluesky. Your app password is never stored or logged.
            </div>
        </div>

        <div class="footer">
            <p>Built with ❤️ for the decentralized web</p>
            <p><a href="https://weblog.social/health">Health Check</a> | <a href="https://github.com/librenews/weblog.social">Source Code</a></p>
        </div>
    </div>
</body>
</html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MetaWeblog-to-Bluesky Bridge' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MetaWeblog -> Bluesky bridge running on http://localhost:${PORT}/xmlrpc`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
