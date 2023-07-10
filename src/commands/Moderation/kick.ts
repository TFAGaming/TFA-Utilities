import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to kick.')
                .setRequired(true)
        )
        .addStringOption((o) =>
            o.setName('reason')
                .setDescription('The reason of the kick.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason was provided';

        await interaction.deferReply({ ephemeral: true });

        try {
            await interaction.guild.members.kick(user, reason);

            await db.infraction.create({
                data: {
                    id: interaction.id,
                    guildId: interaction.guildId,
                    userId: user.id,
                    moderatorId: interaction.user.id,
                    since: BigInt(Date.now()),
                    expires: null,
                    type: 'Kick',
                    reason: reason
                }
            });

            await interaction.followUp({
                embeds: [
                    embed('Successfully kicked ' + user.toString() + '!', 'info')
                ]
            });

            await interaction.channel.send({
                embeds: [
                    embed(`${user.toString()} has been **kicked** with the ID: \`${interaction.id}\``, 'warn')
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