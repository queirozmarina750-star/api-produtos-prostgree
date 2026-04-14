// =============================================
// script.js — Lógica do Front-end (PRODUTOS)
// =============================================

// Variável global
let produtoEmEdicao = null;


// ═════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═════════════════════════════════════════════

function mostrarMensagem(mensagem) {
  const modal = document.getElementById('modalMessage');
  const modalText = document.getElementById('modalText');

  modalText.textContent = mensagem;
  modal.style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modalMessage').style.display = 'none';
}

function limparFormulario() {
  document.getElementById('productForm').reset();
  produtoEmEdicao = null;

  document.querySelector('.form-section h2').textContent =
    'Adicionar ou Editar Produto';
}

function escaparAspa(valor) {
  if (!valor) return '';
  return String(valor).replace(/'/g, "\\'");
}


// ═════════════════════════════════════════════
// CRUD - API
// ═════════════════════════════════════════════

async function carregarProdutos() {
  const loading = document.getElementById('loadingMessage');
  const empty = document.getElementById('emptyMessage');
  const list = document.getElementById('productsList');

  loading.style.display = 'block';
  empty.style.display = 'none';
  list.innerHTML = '';

  try {
    const res = await fetch('/produtos');
    if (!res.ok) throw new Error();

    const produtos = await res.json();

    loading.style.display = 'none';

    if (produtos.length === 0) {
      empty.style.display = 'block';
    } else {
      exibirTabela(produtos);
    }

  } catch (e) {
    loading.style.display = 'none';
    empty.style.display = 'block';
    mostrarMensagem('Erro ao carregar produtos');
  }
}

async function criarProduto(dados) {
  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!res.ok) throw new Error();

    mostrarMensagem('Produto criado com sucesso!');
    limparFormulario();
    carregarProdutos();

  } catch {
    mostrarMensagem('Erro ao criar produto');
  }
}

async function atualizarProduto(id, dados) {
  try {
    const res = await fetch(`/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!res.ok) throw new Error();

    mostrarMensagem('Produto atualizado!');
    limparFormulario();
    carregarProdutos();

  } catch {
    mostrarMensagem('Erro ao atualizar produto');
  }
}

async function deletarProduto(id) {
  if (!confirm('Deseja deletar este produto?')) return;

  try {
    const res = await fetch(`/produtos/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error();

    mostrarMensagem('Produto deletado!');
    carregarProdutos();

  } catch {
    mostrarMensagem('Erro ao deletar produto');
  }
}


// ═════════════════════════════════════════════
// TABELA + EDIÇÃO
// ═════════════════════════════════════════════

function exibirTabela(produtos) {
  const list = document.getElementById('productsList');

  let html = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Estoque</th>
          <th>Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  produtos.forEach(p => {
    html += `
      <tr>
        <td>#${p.id}</td>
        <td>${p.nome}</td>
        <td>${p.descricao}</td>
        <td>R$ ${parseFloat(p.preco).toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>${p.categoria}</td>
        <td>
          <button class="btn btn-edit"
            onclick="editarProduto(
              ${p.id},
              '${escaparAspa(p.nome)}',
              '${escaparAspa(p.descricao)}',
              ${p.preco},
              ${p.estoque},
              '${escaparAspa(p.categoria)}'
            )">
            ✏️
          </button>
          <button class="btn btn-danger"
            onclick="deletarProduto(${p.id})">
            🗑
          </button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  list.innerHTML = html;
}

function editarProduto(id, nome, descricao, preco, estoque, categoria) {
  produtoEmEdicao = id;

  document.getElementById('nome').value = nome;
  document.getElementById('descricao').value = descricao;
  document.getElementById('preco').value = preco;
  document.getElementById('estoque').value = estoque;
  document.getElementById('categoria').value = categoria;

  document.querySelector('.form-section h2').textContent =
    `Editando Produto #${id}`;
}


// ═════════════════════════════════════════════
// BUSCA
// ═════════════════════════════════════════════

async function buscarProdutos(tipo, valor) {
  const loading = document.getElementById('loadingMessage');
  const empty = document.getElementById('emptyMessage');
  const list = document.getElementById('productsList');

  loading.style.display = 'block';
  empty.style.display = 'none';
  list.innerHTML = '';

  try {
    let url = tipo === 'nome'
      ? `/produtos/nome/${encodeURIComponent(valor)}`
      : `/produtos/${valor}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error();

    let produtos = await res.json();
    if (!Array.isArray(produtos)) produtos = [produtos];

    loading.style.display = 'none';

    if (produtos.length === 0) {
      empty.style.display = 'block';
      empty.textContent = 'Nenhum produto encontrado.';
    } else {
      exibirTabela(produtos);
    }

  } catch {
    loading.style.display = 'none';
    empty.style.display = 'block';
    mostrarMensagem('Erro na busca');
  }
}

function filtrarProdutos() {
  const valor = document.getElementById('searchInput').value.trim();
  const tipo = document.getElementById('searchType').value;

  if (!valor) carregarProdutos();
  else buscarProdutos(tipo, valor);
}


// ═════════════════════════════════════════════
// EVENTOS
// ═════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  carregarProdutos();

  document.getElementById('productForm')
    .addEventListener('submit', e => {
      e.preventDefault();

      const dados = {
        nome: document.getElementById('nome').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        preco: parseFloat(document.getElementById('preco').value),
        estoque: parseInt(document.getElementById('estoque').value),
        categoria: document.getElementById('categoria').value.trim()
      };

      if (produtoEmEdicao) {
        atualizarProduto(produtoEmEdicao, dados);
      } else {
        criarProduto(dados);
      }
    });

  document.getElementById('btnLimpar')
    .addEventListener('click', limparFormulario);

  document.getElementById('btnRecarregar')
    .addEventListener('click', carregarProdutos);

  document.getElementById('btnBuscar')
    .addEventListener('click', filtrarProdutos);

  document.getElementById('searchInput')
    .addEventListener('keyup', e => {
      if (e.key === 'Enter') filtrarProdutos();
    });

  document.getElementById('modalMessage')
    .addEventListener('click', function (e) {
      if (e.target === this) fecharModal();
    });

});