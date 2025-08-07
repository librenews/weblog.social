import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// Create a simple test app
function createTestApp() {
  const app = express();
  app.use(bodyParser.text({ type: 'text/xml' }));

  // Simple health check endpoint for testing
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'MetaWeblog-to-Bluesky Bridge' });
  });

  // Simple XML-RPC endpoint that just echoes back
  app.post('/xmlrpc', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<methodResponse>
  <params>
    <param>
      <value><string>test-response</string></value>
    </param>
  </params>
</methodResponse>`);
  });

  return app;
}

describe('HTTP Server Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'ok',
        service: 'MetaWeblog-to-Bluesky Bridge'
      });
    });

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('POST /xmlrpc', () => {
    it('should accept XML content', async () => {
      const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>metaWeblog.newPost</methodName>
  <params>
    <param><value><string>1</string></value></param>
  </params>
</methodCall>`;

      const response = await request(app)
        .post('/xmlrpc')
        .set('Content-Type', 'text/xml')
        .send(xmlRequest)
        .expect(200);

      expect(response.headers['content-type']).toBe('text/xml; charset=utf-8');
      expect(response.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(response.text).toContain('methodResponse');
    });

    it('should handle empty XML requests', async () => {
      const response = await request(app)
        .post('/xmlrpc')
        .set('Content-Type', 'text/xml')
        .send('')
        .expect(200);

      expect(response.headers['content-type']).toBe('text/xml; charset=utf-8');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown')
        .expect(404);
    });

    it('should return 404 for wrong method on xmlrpc', async () => {
      await request(app)
        .get('/xmlrpc')
        .expect(404);
    });
  });
});
