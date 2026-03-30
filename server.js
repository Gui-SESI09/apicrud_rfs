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

//POST RF01 E RF08: Criar chamado com responsável E conter título e descrição.
servidor.post('/chamados', async (request, reply) => {
    
    const body = request.body;
    if(!body || !body.titulo || !body.descricao || !body.usuario_id){
        return reply.status(400).send({ message: "Dados não encontrados verifique o título, a descrição ou o id do usuário!"});
    }
    
    await sql.query('INSERT INTO chamados (titulo, descricao, usuario_id) VALUES ($1, $2, $3)', [body.titulo, body.descricao, body.usuario_id]);
    
    reply.status(201).send({ message: 'Chamado foi aberto com sucesso!'});
})

//POST RF02 E RF03: Chamados através de um filtro por responsável.
servidor.get('/chamados/:usuario_id', async (request, reply) => {
    const body = request.body;
    if(!body || !body.id){
        return reply.status(400).send({ message: "ID de usuário não existe ou foi inserido incorretamente!"});
    }
    await sql.query('SELECT * FROM chamados WHERE usuario_id = $1,' [body.usuario_id]);
    
    reply.status(201).send({message : "Tudo está correto, veja os chamados referentes ao usuário solicitado!"});
});

//POST RF05: Deletar Chamados
servidor.delete('/chamados/:id', async (request, reply) => {
    const body = request.body;
    if(!body || !body.id){
        return reply.status(400).send({ message: "Não foi possível deletar esse chamado, tente novamente!"});
    }
    await sql.query('DELETE FROM chamados WHERE id = $1', [body.id]);
    reply.status(201).send({message : "Tudo está correto, seu chamado foi deletado!"});
});

servidor.listen({
    port: 3000
})
