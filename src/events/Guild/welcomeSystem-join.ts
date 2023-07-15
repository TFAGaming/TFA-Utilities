import { TextChannel } from "discord.js";
import { client } from "../..";
import { Event } from "../../class/Builders";
import config from "../../config";

const channel = client.channels.cache.get(config.welcome?.channelId) as TextChannel;

export default new Event('guildMemberAdd', async (member) => {
    if (!config.welcome) return;
    if (!channel) return;

    await channel.send({
        content: config.welcome.joinMessage ? config.welcome.joinMessage(member).content : undefined,
        embeds: config.welcome.joinMessage ? config.welcome.joinMessage(member).embeds : []
    });

    for (const role of config.welcome.roles) {
        const fetched = channel.guild.roles.cache.get(role);

        if (!fetched) continue;

        await member.roles.add(fetched.id);
    };
});