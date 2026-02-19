# Instruções de Deploy na VPS (Docker Swarm)

Para rodar este bot na sua VPS 24/7, siga estes passos:

## 1. Copiar os arquivos para a VPS
Você precisa copiar a pasta `bot-n8n` para dentro da sua VPS. Pelo terminal do seu computador (PowerShell), você pode usar o comando `scp` (se tiver chave SSH configurada) ou criar a pasta lá manualmente.

**Opção mais simples (Criar manual lá):**
1. Acesse sua VPS: `ssh ubuntu@seu-ip`
2. Crie a pasta: `mkdir -p ~/discord-n8n`
3. Entre nela: `cd ~/discord-n8n`
4. Crie os arquivos `Dockerfile`, `package.json`, `index.js` e `docker-compose.yml` copiando o conteúdo daqui.

## 2. Configurar as Variáveis de Ambiente
Na VPS, crie o arquivo `.env` com seus dados (use o comando `nano .env`):

```bash
TOKEN_DISCORD=seu_token_aqui
N8N_WEBHOOK_URL=https://n8n.webmarketing360.com.br/webhook/discord00
DISCORD_CHANNEL_NAME=⛔┊notificações
```

## 3. Build e Deploy
Ainda dentro da pasta na VPS, rode:

```bash
# 1. Construir a imagem
docker build -t discord-n8n:latest .

# 2. Rodar como serviço no Swarm (usando o arquivo docker-compose.yml que criamos)
docker stack deploy -c docker-compose.yml discord_bot
```

## 4. Verificar se está rodando
```bash
docker service ls
docker service logs -f discord_bot_discord-n8n
```
