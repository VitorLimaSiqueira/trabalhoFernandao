const API_URL = 'http://localhost:3000/api/alunos';

// Elementos do DOM
const alunoForm = document.getElementById('aluno-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const alunosList = document.getElementById('alunos-list');

// Estado da aplicação
let editMode = false;
let currentEditId = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadAlunos();
  
  alunoForm.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', resetForm);
});

// Funções para manipulação da API
async function loadAlunos() {
  try {
    const response = await fetch(API_URL);
    const alunos = await response.json();
    displayAlunos(alunos);
    
    // Salvar no localStorage também
    localStorage.setItem('alunos', JSON.stringify(alunos));
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
    // Fallback para localStorage se a API não estiver disponível
    const alunosLocal = JSON.parse(localStorage.getItem('alunos') || '[]');
    displayAlunos(alunosLocal);
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const alunoData = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    telefone: document.getElementById('telefone').value,
    email: document.getElementById('email').value,
    matricula: document.getElementById('matricula').value,
    aluno: document.getElementById('aluno').value,
    escola: document.getElementById('escola').value
  };
  
  try {
    if (editMode) {
      await updateAluno(currentEditId, alunoData);
    } else {
      await createAluno(alunoData);
    }
    
    resetForm();
    loadAlunos();
  } catch (error) {
    console.error('Erro ao salvar aluno:', error);
    alert('Erro ao salvar aluno. Verifique o console para mais detalhes.');
  }
}

async function createAluno(alunoData) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alunoData)
    });
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    
    return await response.json();
  } catch (error) {
    // Fallback para localStorage
    const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
    const newId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
    const newAluno = { id: newId, ...alunoData };
    alunos.push(newAluno);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    return newAluno;
  }
}

async function updateAluno(id, alunoData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alunoData)
    });
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    
    return await response.json();
  } catch (error) {
    // Fallback para localStorage
    const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
    const index = alunos.findIndex(a => a.id === parseInt(id));
    if (index !== -1) {
      alunos[index] = { id: parseInt(id), ...alunoData };
      localStorage.setItem('alunos', JSON.stringify(alunos));
    }
    return alunos[index];
  }
}

async function deleteAluno(id) {
  if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Erro na requisição');
    }
    
    loadAlunos();
  } catch (error) {
    console.error('Erro ao excluir aluno:', error);
    // Fallback para localStorage
    const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
    const filteredAlunos = alunos.filter(a => a.id !== parseInt(id));
    localStorage.setItem('alunos', JSON.stringify(filteredAlunos));
    loadAlunos();
  }
}

// Funções para manipulação da UI
function displayAlunos(alunos) {
  alunosList.innerHTML = '';
  
  if (alunos.length === 0) {
    alunosList.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
    return;
  }
  
  alunos.forEach(aluno => {
    const alunoCard = document.createElement('div');
    alunoCard.className = 'aluno-card';
    alunoCard.innerHTML = `
      <h3>${aluno.nome}</h3>
      <p><strong>CPF:</strong> ${aluno.cpf}</p>
      <p><strong>Telefone:</strong> ${aluno.telefone}</p>
      <p><strong>E-mail:</strong> ${aluno.email}</p>
      <p><strong>Matrícula:</strong> ${aluno.matricula}</p>
      <p><strong>Aluno:</strong> ${aluno.aluno}</p>
      <p><strong>Escola:</strong> ${aluno.escola}</p>
      <div class="aluno-actions">
        <button class="edit-btn" data-id="${aluno.id}">Editar</button>
        <button class="delete-btn" data-id="${aluno.id}">Excluir</button>
      </div>
    `;
    
    alunosList.appendChild(alunoCard);
  });
  
  // Adicionar event listeners aos botões
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      editAluno(id);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      deleteAluno(id);
    });
  });
}

function editAluno(id) {
  const alunos = JSON.parse(localStorage.getItem('alunos') || '[]');
  const aluno = alunos.find(a => a.id === parseInt(id));
  
  if (aluno) {
    document.getElementById('aluno-id').value = aluno.id;
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('cpf').value = aluno.cpf;
    document.getElementById('telefone').value = aluno.telefone;
    document.getElementById('email').value = aluno.email;
    document.getElementById('matricula').value = aluno.matricula;
    document.getElementById('aluno').value = aluno.aluno;
    document.getElementById('escola').value = aluno.escola;
    
    editMode = true;
    currentEditId = aluno.id;
    formTitle.textContent = 'Editar Aluno';
    submitBtn.textContent = 'Atualizar';
    cancelBtn.style.display = 'inline-block';
  }
}

function resetForm() {
  alunoForm.reset();
  document.getElementById('aluno-id').value = '';
  editMode = false;
  currentEditId = null;
  formTitle.textContent = 'Adicionar Novo Aluno';
  submitBtn.textContent = 'Salvar';
  cancelBtn.style.display = 'none';
}