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
  console.log(`🤖 Bot connected as ${client.user.tag}`);
  console.log(`🔍 Monitoring messages in channel: ${process.env.DISCORD_CHANNEL_NAME}`);
});

client.on('messageCreate', async (message) => {
  console.log(`📨 Message detected in channel: ${message.channel.name} from: ${message.author.username}`);

  if (message.content === '!test') {
    message.channel.send('Bot is working!');
    console.log('✅ Test command responded!');
  }

  if (message.channel.name === process.env.DISCORD_CHANNEL_NAME) {
    console.log(`✅ Message in the correct channel!`);

    try {
      // Extract embeds and components
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

      // Extract components (buttons, menus, etc.)
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
        content: message.cleanContent || message.content,
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

      console.log(`📤 Message sent to n8n with status: ${response.status}`);
    } catch (err) {
      console.error(`❌ Error sending to n8n: ${err.message}`);
    }
  }
});

client.on('error', (error) => {
  console.error(`🔴 Discord client error: ${error.message}`);
});

client.login(process.env.TOKEN_DISCORD)
  .catch(error => {
    console.error(`🔴 Login error: ${error.message}`);
  });