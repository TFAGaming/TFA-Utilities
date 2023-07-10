import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update a warn reason.')
        .addSubcommandGroup((s) =>
            s.setName('warn')
                .setDescription('Update a warn reason.')
                .addSubcommand((s) =>
                    s.setName('reason')
                        .setDescription('Update a warn reason.')
                        .addStringOption((o) =>
                            o.setName('id')
                                .setDescription('The ID of the warn.')
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o.setName('new-reason')
                                .setDescription('The new reason of the warning.')
                                .setRequired(true)
                        )
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const id = interaction.options.getString('id', true);
        const reason = interaction.options.getString('new-reason', true);

        await interaction.deferReply({ ephemeral: true });

        const count = await db.infraction.count({
            where: {
                id: id,
                type: 'Warn'
            }
        });

        if (count === 0) {
            await interaction.followUp({
                embeds: [
                    embed('Invalid ID provided, or the type of infraction is not **Warn**.', 'error')
                ]
            });

            return;
        };

        await db.infraction.update({
            where: {
                id: id
            },
            data: {
                reason: reason
            }
        })

        await interaction.followUp({
            embeds: [
                embed('The warning reason from the ID \`' + id + '\` has been updated.', 'info')
            ]
        });
    }
);