// Simulando um banco de dados em memória
let alunos = [];
let nextId = 1;

// Funções para manipular os dados
const db = {
  getAll: () => alunos,
  
  getById: (id) => alunos.find(aluno => aluno.id === parseInt(id)),
  
  create: (alunoData) => {
    const novoAluno = {
      id: nextId++,
      nome: alunoData.nome,
      cpf: alunoData.cpf,
      telefone: alunoData.telefone,
      email: alunoData.email,
      matricula: alunoData.matricula,
      aluno: alunoData.aluno,
      escola: alunoData.escola
    };
    alunos.push(novoAluno);
    return novoAluno;
  },
  
  update: (id, alunoData) => {
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index !== -1) {
      alunos[index] = { ...alunos[index], ...alunoData };
      return alunos[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = alunos.findIndex(aluno => aluno.id === parseInt(id));
    if (index !== -1) {
      return alunos.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = db;