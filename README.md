# <samp>T.F.A's Utilities</samp> (Open-source version)

**T.F.A's Utilities** is a powerful and advanced Discord moderation bot built for **T.F.A 7524 - Development**. This project uses [Prisma ORM](https://www.prisma.io/) and [discord.js](https://npmjs.com/package/discord.js) v14, and the main database SQLite. You can change the database to another one (examples: MongoDB, PostgreSQL... etc.) but you need to edit the model in `prisma/schema.prisma`.

> **Warning** This bot is made for a single-server only. If you make your bot public, you need a huge database and some other configuration for the commands. This bot is **NOT** made for public servers.

<img src="https://media.discordapp.net/attachments/1111644651036876822/1128008344033050727/17219288-modified_1.png" width=100> <img src="https://media.discordapp.net/attachments/1111644651036876822/1128008343097716916/telechargement-modified.png" width=100> <img src="https://media.discordapp.net/attachments/1111644651036876822/1128008343772987412/typescript-icon-icon-1024x1024-vh3pfez8-modified.png?width=640&height=640" width=100>


## Features

### Administration
- Custom slash (`/`) commands (5 max)

### Auto-moderation
- Anti-swear
- Anti-link
- Anti-Discord server invites
- Anti-caps
- Anti-mass mention
- Anti-walls (number of lines per message)
- Anti-emoji spam (number of emojis per message)
- Anti-IP addresses (avoid any IPv4 or/and IPv6 in any message)
- Message update anti-bypasser (avoid members to bypass automod by editing their messages)

### Moderation
- Auto-mod infractions
- Infractions
    - Automod
        - 3x warnings: 3h timeout 
- Infractions expiration time
    - Automod
        - Warning: 6h
        - Mute: Permanent
    - Manual
        - Warning: 7d / Permanent
        - Mute: Permanent
        - Ban: Permanent
        - Kick: Permanent
- Slowmode
- Channel lock & unlock
- Server lockdown & unlock
- Yeet (troll command)
- Note system
- Protected moderator roles (avoid staff members to punish other staff members)

### Utility
- AFK system
- Welcome system & autorole
- Server & user info
- Help with mentionable commands & autocomplete options

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

5. Rename `.env.example` to `.env` and `example.config.ts` (in `src/`) to `config.ts`, and then fill all required values in each file.

**.env**:
```apache
# The database URL ("file:./dev.db" for SQLite)
DATABASE_URL="file:./dev.db"

# The Discord bot token
CLIENT_TOKEN=""
# The Discord bot ID
CLIENT_ID=""

# The developer ID (You)
OWNER_ID=""
```

**config.ts**:
```ts
export default {
    lockdown: {
        // The channel IDs to update whenever the server is on lockdown.
        channels: string[]
    },
    moderation: {
        // The role IDs to protect other staff members whenever a staff tries to punish them.
        protectedRoles: string[]
    },
    automod: {
        // The role IDs to ignore people (have at least one of the roles) who breaks the automod rules.
        protectedRoles: string[]
    },
    welcome: {
        channelId: string, // The welcome/leave channel ID.
        joinMessage: (member: GuildMember) => { // The join message.
            return {
                content: string,
                embeds: EmbedBuilder[]
            }
        },
        leftMessage: (member: GuildMember) => { // The left message.
            return {
                content: string,
                embeds: EmbedBuilder[]
            }
        },
        roles: string[] // The roles IDs to add to the joined new members.
    }
};
```

6. Run the following command to compile the TypeScript files into JavaScript files, and then starts from the main file `lib/index.js`.

```
npm run build
```

## Developer
- [TFAGaming](https://www.github.com/TFAGaming)

## License
[GPL-3.0](./LICENSE), General Public License v3.0