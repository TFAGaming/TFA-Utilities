import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear all user infractions.')
        .addSubcommand((s) =>
            s.setName('infractions')
                .setDescription('Clear all user infractions.')
                .addUserOption((o) =>
                    o.setName('user')
                        .setDescription('The user to clear it\'s infractions.')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const user = interaction.options.getUser('user', true);

        await interaction.deferReply({ ephemeral: true });

        const count = await db.infraction.count({
            where: {
                guildId: interaction.guildId,
                userId: user.id
            }
        });

        if (count === 0) {
            await interaction.followUp({
                embeds: [
                    embed('No infractions were found for that user.')
                ]
            });

            return;
        };

        await db.infraction.deleteMany({
            where: {
               guildId: interaction.guildId,
               userId: user.id 
            }
        });

        await interaction.followUp({
            embeds: [
                embed('Successfully cleared all infractions from ' + user.toString() + '.', 'info')
            ]
        });
    }
);