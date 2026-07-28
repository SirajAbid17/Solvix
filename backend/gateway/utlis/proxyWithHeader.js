import proxy from "express-http-proxy"

export const ProxyWithHeader=(serviceUrl)=>{
return proxy(serviceUrl,{
    proxyReqOptDecorator:(proxyReqsOpts,srcReq)=>{
        if(srcReq.user){
     proxyReqsOpts.headers["x-user-id"]=srcReq.user.userId
        }
       
    }
})
}