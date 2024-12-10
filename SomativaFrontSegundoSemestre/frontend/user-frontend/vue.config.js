const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // Transpile dependencies
  transpileDependencies: true,

  // Produção sem source maps
  productionSourceMap: false,

  // Configurações de otimização
  configureWebpack: {
    optimization: {
      minimize: true,
    },
  },

  // Configuração do devServer para escutar a porta fornecida pelo Render
  devServer: {
    port: process.env.PORT || 8080, // Configura para a variável de ambiente PORT ou 8080 como fallback
    open: true, // Opcional: abre o navegador automaticamente
  },
});