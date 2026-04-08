import Fastify from 'fastify'
import { Pool } from 'pg'

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "sistema_chamados"
})

const servidor = Fastify();

servidor.post('/chamados', async (request, reply) => {
    const body = request.body;
    if(!body || !body.titulo || !body.descricao || !body.usuario_id){
        return reply.status(400).send({ message: "Dados não encontrados verifique o título, a descrição ou o id do usuário!"});
    }
    await sql.query('INSERT INTO chamados (titulo, descricao, usuario_id) VALUES ($1, $2, $3)', [body.titulo, body.descricao, body.usuario_id]);
    reply.status(201).send({ message: 'Chamado foi aberto com sucesso!'});
})  

servidor.post('/usuarios', async (request, reply) => {
    const body = request.body;
    if(!body || !body.nome || !body.email || !body.senha){
        return reply.status(400).send({ message: "Dados não encontrados verifique os dados do usuário!"});
    }
    await sql.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [body.nome, body.email, body.senha]);
    reply.status(201).send({ message: 'Chamado foi aberto com sucesso!'});
})

servidor.get('/usuarios/:id', async (request, reply) => {
    const resultado = await sql.query('SELECT * FROM usuarios');
    reply.status(201).send({message : "Tudo está correto, veja os chamados referentes ao usuário solicitado!", dados: resultado.rows});
});

servidor.delete('/chamados/:id', async (request, reply) => {
    const body = request.body;
    if(!body || !body.id){
        return reply.status(400).send({ message: "Não foi possível deletar esse chamado, tente novamente!"});
    }
    await sql.query('DELETE FROM chamados WHERE id = $1', [body.id]);
    reply.status(201).send({message : "Tudo está correto, seu chamado foi deletado!"});
});

servidor.put('/chamados/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;
    if(!body){
        return reply.status(400).send({ message: "Há algo de errado na sua atualização"})
    }
    await sql.query('UPDATE chamados SET titulo = $1, descricao = $2 where id = $3', [body.titulo, body.descricao, id]);
    reply.status(200).send({message: "Seus dados foram atualizados, verifique no GET!"})
});

servidor.listen({
    port: 3000
})
