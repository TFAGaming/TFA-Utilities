import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import ms from "ms";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to mute.')
                .setRequired(true)
        )
        .addStringOption((o) =>
            o.setName('reason')
                .setDescription('The reason of the mute.')
                .setRequired(false)
        )
        .addStringOption((o) =>
            o.setName('duration')
                .setDescription('The duration of the mute. By default, 6 hours.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const member = interaction.guild.members.cache.get(interaction.options.getUser('user', true).id);
        const reason = interaction.options.getString('reason') || 'No reason was provided';
        const duration = interaction.options.getString('duration') ? ms(interaction.options.getString('duration', true)) : ms('6h');

        await interaction.deferReply({ ephemeral: true });

        try {
            if (member.isCommunicationDisabled().valueOf()) {
                await interaction.followUp({
                    embeds: [
                        embed('The user is already muted.')
                    ]
                });

                return;
            };

            await db.infraction.create({
                data: {
                    id: interaction.id,
                    guildId: interaction.guildId,
                    userId: member.user.id,
                    moderatorId: interaction.user.id,
                    expires: null,
                    since: BigInt(Date.now()),
                    type: 'Mute',
                    reason: reason
                }
            });

            await member.timeout(duration, reason).catch(() => { });

            await interaction.followUp({
                embeds: [
                    embed('Successfully muted ' + member.user.toString() + '!', 'info')
                ]
            });

            await interaction.channel.send({
                embeds: [
                    embed(`${member.user.toString()} has been **muted** with the ID: \`${interaction.id}\``, 'warn')
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