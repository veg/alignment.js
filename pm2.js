module.exports = {
  apps: [
    {
      name: "alignment.js",
      script: "./src/server.js",
      watch: false,
      env: {
        PORT: 8001,
        NODE_ENV: "prod"
      }
    }
  ]
};
