const path = require("path");

module.exports = {
  css: {
    extract: process.env.NODE_ENV === "production" ? false : true,
  },
  outputDir: process.env.NODE_ENV === "production" ? path.resolve(__dirname, "dist") : path.resolve(__dirname, "example-dist"),
  // publicPath: process.env.NODE_ENV === "production" ? "/" : "/example/",
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      return {};
    } else {
      config.entry = { app: "./example/main.js" };
      // return {
      //   entry: { app: "./example/main.js" }, // 项目入口
      //   resolve: {
      //     alias: {
      //       "@": path.resolve(__dirname, "example", "src"),
      //     },
      //   },
      // };
      console.log("what is config", config);
    }
  },
};
