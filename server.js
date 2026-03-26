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

servidor.metodo('/a', async (request, reply) => {
    // 1. Pegar os dados que o usuário enviou (body ou params)
    
    // 2. Executar o comando SQL usando os dados acima
     
    // 3. Devolver uma resposta (sucesso ou erro)
     
})

//POST RF01 E RF08: Criar chamado com responsável E conter título e descrição.
servidor.post('/chamados', async (request, reply) => {
    
    const body = request.body;
    if(!body || !body.titulo || !body.descricao || !body.usuario_id){
        return reply.status(400).send({ message: "Dados não encontrados verifique o título, a descrição ou o id do usuário!"})
    }
    
    await sql.query('INSERT INTO chamados (titulo, descricao, usuario_id) VALUES ($1, $2, $3)', [body.titulo, body.descricao, body.usuario_id]) 
    
    reply.status(201).send({ message: 'Chamado foi aberto com sucesso!'})
})

servidor.listen({
    port: 3000
})