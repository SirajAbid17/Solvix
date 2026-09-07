import proxy from "express-http-proxy";

export const ProxyWithHeader = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId || srcReq.user._id;
        proxyReqOpts.headers["x-user-email"] = srcReq.user.email || "";
        proxyReqOpts.headers["x-user-name"] = srcReq.user.name || "";
        proxyReqOpts.headers["x-user-admin"] = srcReq.user.isAdmin ? "true" : "false"; // ✅ Admin flag in headers
      }
      
      if (srcReq.headers['authorization']) {
        proxyReqOpts.headers['authorization'] = srcReq.headers['authorization'];
      }
      if (srcReq.headers['cookie']) {
        proxyReqOpts.headers['cookie'] = srcReq.headers['cookie'];
      }
      
      console.log('[Proxy] Forwarding to:', serviceUrl);
      console.log('[Proxy] Headers:', proxyReqOpts.headers);
      
      return proxyReqOpts;
    },
    
    proxyReqPathResolver: (req) => {
      console.log('[Proxy] Original URL:', req.originalUrl);
      console.log('[Proxy] Path:', req.path);
      return req.originalUrl || req.url;
    },
    
    proxyErrorHandler: (err, res, next) => {
      console.error('[Proxy Error]', err);
      res.status(500).json({ 
        message: 'Proxy error', 
        error: err.message 
      });
    },
    
    timeout: 30000,
    preserveHostHdr: true,
    parseReqBody: true
  });
};