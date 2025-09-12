const express = require('express');
const router = express.Router();
const db = require('../dados/database.js');

// GET - Listar todos os alunos
router.get('/', (req, res) => {
  try {
    const alunos = db.getAll();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// GET - Buscar aluno por ID
router.get('/:id', (req, res) => {
  try {
    const aluno = db.getById(req.params.id);
    if (aluno) {
      res.json(aluno);
    } else {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
});

// POST - Criar novo aluno
router.post('/', (req, res) => {
  try {
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    
    if (!nome || !cpf || !telefone || !email || !matricula || !aluno || !escola) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const novoAluno = db.create({
      nome, cpf, telefone, email, matricula, aluno, escola
    });
    
    res.status(201).json(novoAluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
});

// PUT - Atualizar aluno
router.put('/:id', (req, res) => {
  try {
    const { nome, cpf, telefone, email, matricula, aluno, escola } = req.body;
    
    if (!nome || !cpf || !telefone || !email || !matricula || !aluno || !escola) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const alunoAtualizado = db.update(req.params.id, {
      nome, cpf, telefone, email, matricula, aluno, escola
    });
    
    if (alunoAtualizado) {
      res.json(alunoAtualizado);
    } else {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// DELETE - Remover aluno
router.delete('/:id', (req, res) => {
  try {
    const alunoRemovido = db.delete(req.params.id);
    if (alunoRemovido) {
      res.json({ message: 'Aluno removido com sucesso' });
    } else {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover aluno' });
  }
});

module.exports = router;
