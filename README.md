# <samp>T.F.A's Utilities</samp> (Open-source version)

**T.F.A's Utilities** is a powerful Discord moderation bot built for **T.F.A 7524 - Development**. This project uses [Prisma ORM](https://www.prisma.io/) and [discord.js](https://npmjs.com/package/discord.js) v14. The main database SQLite, you can change the database to another one but you need to change the model in `prisma/schema.prisma`.

## Features

### Administration
- Custom `/` commands

### Auto-moderation
- Anti-swear
- Anti-link & Anti-Discord server invites
- Anti-caps
- Anti-mass mention
- Anti-walls (lines per message)
- Anti-emoji spam (number of emojis per message)
- Anti-IP addresses (IPv4 or IPv6)

### Moderation
- Auto-mod infractions
- Expiration time
    - Automod
        - Warning: 6h
        - Mute: Permanent
    - Manual
        - Warning: 7d / Permanent
        - Mute: Permanent
        - Ban: Permanent
        - Kick: Permanent
- Slowmode
- Lock & Unlock
- Yeet (troll command)
- Note system

### Utility
- AFK
- Help command with mentionable commands

## Setup

1. Run the following command to initialize a new package:
```
npm init -y
```

2. Install **tsc**, **prisma**, and **@types/ms** as a dev dependencies:
```
npm install --save-dev tsc prisma @types/ms
```

3. Run a migration to create your database tables with prisma: ([Learn more here](https://www.prisma.io/docs/getting-started/quickstart))
```
npx prisma migrate dev --name init
```

4. Install other required packages:

```
npm install @prisma/client aqify.js axios discord.js dotenv ms
```

5. Rename `.env.example` to `.env` and fill all required values.

6. Run the following command to compile the TypeScript files into JavaScript files, and then starts from the main file `lib/index.js`.

```
npm run build
```

Or:
```
npx tsc
node .
```