# Discord to n8n Bot 🤖

A lightweight, Docker-ready Discord bot that monitors a specific channel and forwards all messages (including embeds, components, and attachments) to an n8n webhook for automation.

## Features

- **Channel Monitoring**: Listens to a specific channel defined in environment variables.
- **Rich Content Support**: Captures not just text, but also Embeds, Buttons, Menus, and Attachments.
- **Docker Ready**: Includes `Dockerfile` and `docker-compose.yml` for easy deployment.
- **Secure**: Uses environment variables for sensitive data.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Discord Bot Token (with Message Content Intent enabled)
- An n8n Webhook URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/flaviofagundespro/discord-n8n.git
   cd discord-n8n
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   TOKEN_DISCORD=your_discord_bot_token_here
   N8N_WEBHOOK_URL=your_n8n_webhook_url_here
   DISCORD_CHANNEL_NAME=channel-name-to-monitor
   ```

4. **Run the Bot**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment (VPS/Server)

This project is optimized for Docker Swarm or Docker Compose.

### Quick Deploy

1. **Copy files to your server**
2. **Create the `.env` file** on the server with your credentials.
3. **Run with Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

### Docker Swarm

```bash
docker stack deploy -c docker-compose.yml discord_bot
```

## 🛠️ Configuration Details

| Variable | Description |
|----------|-------------|
| `TOKEN_DISCORD` | Your Discord Bot Token (Get it from Discord Developer Portal) |
| `N8N_WEBHOOK_URL` | The URL of your n8n Webhook node (POST) |
| `DISCORD_CHANNEL_NAME` | The exact name of the channel to monitor (e.g., `general`, `alerts`) |

## 📦 What gets sent to n8n?

The bot sends a JSON payload with the following structure:

```json
{
  "messageId": "123456789...",
  "content": "Hello World",
  "timestamp": "2023-10-27T10:00:00.000Z",
  "author": "User123",
  "channel": "alerts",
  "embeds": [...],
  "components": [...],
  "attachments": [...]
}
```

## License

This project is licensed under the ISC License.
