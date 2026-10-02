import { app } from "./app";
import { env } from "./env";

app.listen({
    port: env.PORT,
    host: '0.0.0.0',
}).then(() => {
    console.log('Iniciando servidor CodeGuilds...')
    console.log('0 ===========================> 100%')
    console.log(`Servidor CodeGuilds rodando na porta ${env.PORT}!`)
    console.log('Bem vindo de Volta Danilo Amaral ^-^')
})
