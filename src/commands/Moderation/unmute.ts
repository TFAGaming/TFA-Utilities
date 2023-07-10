import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to unmute.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const member = interaction.guild.members.cache.get(interaction.options.getUser('user', true).id);

        await interaction.deferReply({ ephemeral: true });

        try {
            if (member.isCommunicationDisabled() === false) {
                await interaction.followUp({
                    embeds: [
                        embed('The user is already unmuted.')
                    ]
                });

                return;
            };

            await member.timeout(0);

            await interaction.followUp({
                embeds: [
                    embed('Successfully unmuted ' + member.user.toString() + '!', 'info')
                ]
            });

            await interaction.channel.send({
                embeds: [
                    embed(`${member.user.toString()} has been **unmuted** with the ID: \`${interaction.id}\``, 'info')
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