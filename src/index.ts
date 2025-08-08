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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MetaWeblog-to-Bluesky Bridge' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MetaWeblog -> Bluesky bridge running on http://localhost:${PORT}/xmlrpc`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
