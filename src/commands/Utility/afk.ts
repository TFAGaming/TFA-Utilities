import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set yourself AFK on the server.')
        .addStringOption((o) =>
            o.setName('reason')
                .setDescription('The reason of the AFK.')
                .setRequired(false)
        )
        .setDMPermission(false),
    async (client, interaction, db) => {
        const reason = interaction.options.getString('reason') || 'No reason was provided';

        await interaction.deferReply({ ephemeral: true });

        const data = await db.afk.findFirst({
            where: {
                guildId: interaction.guildId,
                userId: interaction.user.id
            }
        });

        if (data?.afk) {
            await interaction.followUp({
                embeds: [
                    embed('You are AFK already, send a message to remove this AFK status.')
                ]
            });

            return;
        };

        await db.afk.create({
            data: {
               guildId: interaction.guildId,
               userId: interaction.user.id,
               afk: true,
               reason: reason 
            }
        });

        await interaction.followUp({
            embeds: [
                embed('You are now marked as AFK!', 'info')
            ]
        });

        await interaction.channel?.send({
            content: `${interaction.user.toString()} is now **AFK**. | ${reason}`,
            allowedMentions: {
                parse: []
            }
        });
    }
);