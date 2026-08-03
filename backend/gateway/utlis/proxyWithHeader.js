// utils/proxyWithHeader.js
import proxy from "express-http-proxy"

export const ProxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    // Forward headers
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward user ID if authenticated
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
      }
      
      // Forward all important headers
      if (srcReq.headers['authorization']) {
        proxyReqOpts.headers['authorization'] = srcReq.headers['authorization']
      }
      if (srcReq.headers['cookie']) {
        proxyReqOpts.headers['cookie'] = srcReq.headers['cookie']
      }
      
      // Debug logging
      console.log('[Proxy] Forwarding to:', serviceUrl);
      console.log('[Proxy] Headers:', proxyReqOpts.headers);
      
      return proxyReqOpts
    },
    
    // Preserve the original URL path
    proxyReqPathResolver: (req) => {
      console.log('[Proxy] Original URL:', req.originalUrl);
      console.log('[Proxy] Path:', req.path);
      return req.originalUrl || req.url;
    },
    
    // Handle errors
    proxyErrorHandler: (err, res, next) => {
      console.error('[Proxy Error]', err);
      res.status(500).json({ 
        message: 'Proxy error', 
        error: err.message 
      });
    },
    
    // Add timeout
    timeout: 30000,
    
    // Preserve the request body
    preserveHostHdr: true,
    
    // Parse response body
    parseReqBody: true
  })
}