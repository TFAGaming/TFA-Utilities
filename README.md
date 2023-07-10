# <samp>T.F.A's Utilities</samp> (Open-source version)

**T.F.A's Utilities** is a powerful Discord moderation bot built for **T.F.A 7524 - Development**. This project uses [Prisma ORM](https://www.prisma.io/) and [discord.js](https://npmjs.com/package/discord.js) v14, and the main database SQLite. You can change the database to another one (examples: MongoDB, PostgreSQL... etc.) but you need to edit the model in `prisma/schema.prisma`.

This bot can be used in multiple servers, but it's recommended to use it in a single server only.

<img src="https://media.discordapp.net/attachments/1111644651036876822/1128008344033050727/17219288-modified_1.png" width=100> <img src="https://media.discordapp.net/attachments/1111644651036876822/1128008343097716916/telechargement-modified.png" width=100> <img src="https://media.discordapp.net/attachments/1111644651036876822/1128008343772987412/typescript-icon-icon-1024x1024-vh3pfez8-modified.png?width=640&height=640" width=100>


## Features

### Administration
- Custom slash (`/`) commands

### Auto-moderation
- Anti-swear
- Anti-link & Anti-Discord server invites
- Anti-caps
- Anti-mass mention
- Anti-walls (number of lines per message)
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
- AFK system
- Help with mentionable commands

## Setup

1. Run the following command to initialize a new package:
```
npm init -y
```

2. Install **tsc**, **prisma**, and **@types/ms** as dev dependencies:
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

```apache
# The database URL ("file:./dev.db" for SQLite)
DATABASE_URL="file:./dev.db"

# The Discord bot token
CLIENT_TOKEN=""
# The Discord bot ID
CLIENT_ID=""

# The developer Discord account ID (You)
OWNER_ID=""
```

6. Run the following command to compile the TypeScript files into JavaScript files, and then starts from the main file `lib/index.js`.

```
npm run build
```

Or:
```
npx tsc
node .
```

## License
[GPL-3.0](./LICENSE), General Public License v3.0