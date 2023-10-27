const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // Proxy all requests starting with '/api' to the backend
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
};
