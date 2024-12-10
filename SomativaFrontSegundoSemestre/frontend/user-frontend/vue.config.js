const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  productionSourceMap: false,
};

module.exports = {
  configureWebpack: {
    optimization: {
      minimize: true,
    },
  },
};
