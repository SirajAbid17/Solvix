
export const addUserHeadersToProxy = (proxyReqOpts, srcReq) => {
  
  if (srcReq.user) {
    const userId =
      srcReq.user._id || srcReq.user.userId || srcReq.user?.user?._id;

    if (userId) {
      proxyReqOpts.headers["x-user-id"] = String(userId);
      proxyReqOpts.headers["x-user-email"] =
        srcReq.user.email || srcReq.user?.user?.email || "";
      proxyReqOpts.headers["x-user-name"] =
        srcReq.user.name || srcReq.user?.user?.name || "";
    }
  }

  
  if (srcReq.headers.cookie) {
    proxyReqOpts.headers.cookie = srcReq.headers.cookie;
  }

  
  if (srcReq.headers.authorization) {
    proxyReqOpts.headers.authorization = srcReq.headers.authorization;
  }

  
  if (srcReq.headers["content-type"]) {
    proxyReqOpts.headers["content-type"] = srcReq.headers["content-type"];
  }

  return proxyReqOpts;
};


export const shouldParseBody = (req) => {
  const contentType = req.headers["content-type"] || "";
  const isMultipart = contentType.includes("multipart/form-data");
  return !isMultipart;
};


export const createProxyErrorHandler = (serviceName) => {
  return (err, res) => {
    console.error(`${serviceName} Proxy Error:`, err.message);
    res.status(500).json({
      success: false,
      message: err.message || `${serviceName} service unavailable`,
    });
  };
};