# Telegram Authentication Setup Guide

This guide will help you set up Telegram authentication for Boost Legends.

## Prerequisites

- Node.js 18+ installed
- A Telegram account
- Basic knowledge of environment variables

## Step 1: Telegram Bot Configuration

Your bot has already been created:
- **Bot Username**: @legendsbundler_bot
- **Bot Token**: `8204685943:AAEJHPugVMk5zYi-51KNJLJDEHe0QI4SRWU`

To configure the bot with BotFather:
1. Open Telegram and search for `@BotFather`
2. Send `/setdomain`
3. Select @legendsbundler_bot
4. Enter: `https://solana-bundler-gamma.vercel.app`

## Step 2: Set Up the Bot Server

1. Navigate to the `telegram-bot` directory:
   ```bash
   cd telegram-bot
   ```

2. Copy the environment template:
   ```bash
   cp env.example .env
   ```

3. Edit `.env` with your bot credentials:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_BOT_USERNAME=your_bot_username_here
   JWT_SECRET=generate_a_random_secret_here
   FRONTEND_URL=http://localhost:3000
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the bot server:
   ```bash
   npm run dev
   ```

The bot server will run on `http://localhost:3001`

## Step 3: Configure the Frontend

1. Navigate to the main app directory:
   ```bash
   cd solana-bundler-ui
   ```

2. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

3. Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username_here
   NEXT_PUBLIC_BOT_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Install dependencies (if not already done):
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Step 4: Test the Integration

1. Open your browser and go to `http://localhost:3000`
2. Click on "Launch App Now" or go directly to `/login`
3. You'll see two authentication options:
   - **Telegram Login Widget**: Click the blue Telegram button
   - **Bot Login**: Click the bot username to open Telegram and use `/login` command

## How It Works

### Login Widget Flow
1. User clicks the Telegram login button
2. Telegram shows an authorization dialog
3. User approves the login
4. Telegram sends auth data to our bot server
5. Bot server verifies the data and creates a JWT token
6. User is logged in and redirected to the dashboard

### Bot Login Flow
1. User opens the bot in Telegram
2. User sends `/login` command
3. Bot generates a secure session link
4. User clicks the link to open the web app
5. Web app verifies the session and logs the user in

## Security Features

- **Data Verification**: All Telegram auth data is cryptographically verified
- **JWT Tokens**: Sessions are managed using secure JWT tokens
- **HTTPS Required**: In production, always use HTTPS
- **Session Expiry**: Tokens expire after 7 days (configurable)

## Production Deployment

### Bot Server Deployment

1. Deploy the bot server to your preferred hosting (Heroku, DigitalOcean, AWS, etc.)
2. Set production environment variables
3. Update `FRONTEND_URL` to your production domain
4. Use a process manager like PM2 for reliability

### Frontend Deployment

1. Update `.env.production` with production values
2. Deploy to Vercel, Netlify, or your preferred platform
3. Ensure `NEXT_PUBLIC_BOT_API_URL` points to your production bot server

## Troubleshooting

### Bot Not Responding
- Check if the bot token is correct
- Ensure the bot server is running
- Check server logs for errors

### Login Not Working
- Verify CORS settings on the bot server
- Check browser console for errors
- Ensure environment variables are set correctly

### Session Issues
- Clear browser cookies and localStorage
- Check JWT expiration settings
- Verify time sync between client and server

## Additional Bot Commands

- `/start` - Welcome message and command list
- `/login` - Generate a login link
- `/profile` - View your Telegram profile
- `/help` - Get help and support

## Support

If you encounter any issues, please:
1. Check the troubleshooting section
2. Review server and browser logs
3. Open an issue on GitHub with details