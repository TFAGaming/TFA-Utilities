import { EmbedBuilder, GuildMember } from "discord.js";

export default {
    lockdown: {
        channels: []
    },
    moderation: {
        protectedRoles: []
    },
    automod: {
        protectedRoles: []
    },
    welcome: {
        channelId: '',
        joinMessage: (member: GuildMember): { content?: string, embeds?: EmbedBuilder[] } => {
            return {
                content: `Welcome ${member.toString()}!`
            }
        },
        leftMessage: (member: GuildMember): { content?: string, embeds?: EmbedBuilder[]  } => {
            return {
                content: `${member.toString()} has the left the server, goodbye...`
            }
        },
        roles: []
    }
};