import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to unban.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const user = interaction.options.getUser('user', true);

        await interaction.deferReply({ ephemeral: true });

        try {
            const bans = await interaction.guild.bans.fetch();

            if (!bans.has(user.id)) {
                await interaction.followUp({
                    embeds: [
                        embed('That user is already unbanned, or never been banned before.', 'error')
                    ]
                });

                return;
            };

            await interaction.guild.members.unban(user);

            await interaction.followUp({
                embeds: [
                    embed('Successfully unbanned ' + user.toString() + '!', 'info')
                ]
            });

            await interaction.channel.send({
                embeds: [
                    embed(`${user.toString()} has been **unbanned** with the ID: \`${interaction.id}\``, 'info')
                ]
            });

        } catch (e) {
            console.error(e);

            await interaction.editReply({
                embeds: [
                    embed('Unable to run the command properly, please check the console.', 'error')
                ]
            });
        };
    }
);