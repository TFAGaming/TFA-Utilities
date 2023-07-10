import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove an infraction from a user.')
        .addSubcommand((s) =>
            s.setName('infraction')
                .setDescription('Remove an infraction from a user.')
                .addStringOption((o) =>
                    o.setName('id')
                        .setDescription('The ID of the infraction.')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const id = interaction.options.getString('id', true);

        await interaction.deferReply({ ephemeral: true });

        const count = await db.infraction.count({
            where: {
                id: id
            }
        });
        
        if (count === 0) {
            await interaction.followUp({
                embeds: [
                    embed('Invalid ID provided.', 'error')
                ]
            });

            return;
        };

        await db.infraction.delete({
            where: {
                id: id
            }
        });

        await interaction.followUp({
            embeds: [
                embed('The ID \`' + id + '\` has been successfully removed.', 'info')
            ]
        });
    }
);