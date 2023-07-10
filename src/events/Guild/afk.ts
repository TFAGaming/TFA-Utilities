import { wait } from "aqify.js";
import { client } from "../..";
import { Event } from "../../class/Builders";

export default new Event('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const data = await client.db.afk.findFirst({
        where: {
            guildId: message.guildId,
            userId: message.author.id
        }
    });

    if (data) {
        await client.db.afk.deleteMany({
            where: {
                guildId: message.guildId,
                userId: message.author.id
            }
        });

        await message.reply({
            content: `**Welcome back**! I have removed your AFK status.`
        }).then(async (sent) => {
            await wait(5000);

            await sent.delete().catch(() => { });
        }).catch(() => { });
    } else {
        const member = message.mentions.members.first();
        if (!member) return;

        const memberData = await client.db.afk.findFirst({
            where: {
                guildId: message.guildId,
                userId: member.user.id
            }
        });

        if (!memberData) return;

        await message.reply({
            content: `${member.toString()} is currently **AFK**. | ${memberData.reason}`,
            allowedMentions: {
                parse: []
            }
        }).catch(() => { });
    };

});