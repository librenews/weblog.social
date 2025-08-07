import express from 'express';
import bodyParser from 'body-parser';
import * as xmlrpc from 'xmlrpc';
import { handleMetaWeblogCall } from './xmlrpc-handler.js';

const app = express();
app.use(bodyParser.text({ type: 'text/xml' }));

app.post('/xmlrpc', async (req, res) => {
  xmlrpc.parseMethodCall(req.body, async (error: any, methodName: string, params: any[]) => {
    if (error) {
      console.error('XML-RPC parse error:', error);
      return res.status(500).send('Invalid XML-RPC request');
    }

    try {
      console.log(`Handling method: ${methodName}`);
      const response = await handleMetaWeblogCall(methodName, params);
      const xml = xmlrpc.serializeMethodResponse(response);
      res.set('Content-Type', 'text/xml');
      res.send(xml);
    } catch (err) {
      console.error('Method call error:', err);
      const fault = xmlrpc.serializeFault({ 
        faultCode: 1, 
        faultString: (err as Error).message 
      });
      res.set('Content-Type', 'text/xml');
      res.send(fault);
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MetaWeblog-to-Bluesky Bridge' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`MetaWeblog -> Bluesky bridge running on http://localhost:${PORT}/xmlrpc`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
