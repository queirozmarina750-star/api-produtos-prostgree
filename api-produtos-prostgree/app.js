// ============================================================
// APP.JS - Arquivo Principal com dotenv
// ============================================================

// Carregar variáveis de ambiente ANTES de tudo
require('dotenv').config();

const express = require('express');
const app = express();

// Porta vem do .env, ou usa 3000 como padrão
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARES
// ============================================================

// Serve arquivos estáticos (frontend)
app.use(express.static('public'));

// Permite trabalhar com JSON
app.use(express.json());

// ============================================================
// ROTAS
// ============================================================

// Rotas de produtos
const produtoRoutes = require('./src/routes/produtosRoutes');
app.use('/produtos', produtoRoutes);

// Rotas de clientes
const userRoutes = require('./src/routes/produtosRoutes');
app.use('/clientes', userRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API de Produtos com PostgreSQL',
    versao: '3.0',
    ambiente: process.env.NODE_ENV || 'development',
    banco: 'PostgreSQL'
  });
});

// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Servidor rodando!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💾 Banco: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});