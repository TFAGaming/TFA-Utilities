import { GuildMember, TextChannel } from "discord.js";
import { client } from "../..";
import { Event } from "../../class/Builders";
import config from "../../config";

const channel = client.channels.cache.get(config.welcome?.channelId) as TextChannel;

export default new Event('guildMemberRemove', async (member: GuildMember) => {
    if (!config.welcome) return;
    if (!channel) return;

    await channel.send({
        content: config.welcome.leftMessage ? config.welcome.leftMessage(member).content : undefined,
        embeds: config.welcome.leftMessage ? config.welcome.leftMessage(member).embeds : []
    });
});