require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on('ready', () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
  console.log(`🔍 Monitorando mensagens no canal: ${process.env.DISCORD_CHANNEL_NAME}`);
});

client.on('messageCreate', async (message) => {
  console.log(`📨 Mensagem detectada no canal: ${message.channel.name} de: ${message.author.username}`);

  if (message.content === '!teste') {
    message.channel.send('Bot funcionando!');
    console.log('✅ Comando de teste respondido!');
  }

  if (message.channel.name === process.env.DISCORD_CHANNEL_NAME) {
    console.log(`✅ Mensagem no canal correto!`);

    try {
      // Extrair embeds e componentes
      const embeds = message.embeds.map(embed => {
        return {
          title: embed.title,
          description: embed.description,
          fields: embed.fields?.map(field => ({
            name: field.name,
            value: field.value,
            inline: field.inline
          })),
          color: embed.color,
          footer: embed.footer?.text,
          image: embed.image?.url,
          thumbnail: embed.thumbnail?.url
        };
      });

      // Extrair componentes (botões, menus, etc.)
      const components = [];
      if (message.components && message.components.length > 0) {
        message.components.forEach(row => {
          if (row.components && row.components.length > 0) {
            row.components.forEach(comp => {
              components.push({
                type: comp.type,
                style: comp.style,
                label: comp.label,
                customId: comp.customId,
                url: comp.url
              });
            });
          }
        });
      }

      const payload = {
        messageId: message.id,
        content: message.content,
        timestamp: message.createdAt,
        author: message.author.username,
        authorId: message.author.id,
        isBot: message.author.bot,
        channel: message.channel.name,
        embeds: embeds,
        components: components,
        attachments: Array.from(message.attachments.values())
      };

      console.log(`📦 Payload: ${JSON.stringify(payload).substring(0, 200)}...`);

      const response = await axios.post(process.env.N8N_WEBHOOK_URL, payload, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`📤 Mensagem enviada para o n8n com status: ${response.status}`);
    } catch (err) {
      console.error(`❌ Erro ao enviar para o n8n: ${err.message}`);
    }
  }
});

client.on('error', (error) => {
  console.error(`🔴 Erro no cliente Discord: ${error.message}`);
});

client.login(process.env.TOKEN_DISCORD)
  .catch(error => {
    console.error(`🔴 Erro ao fazer login: ${error.message}`);
  });