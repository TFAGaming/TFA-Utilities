import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to ban.')
                .setRequired(true)
        )
        .addStringOption((o) =>
            o.setName('reason')
                .setDescription('The reason of the ban.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason was provided';

        await interaction.deferReply({ ephemeral: true });

        try {
            const bans = await interaction.guild.bans.fetch();

            if (bans.has(user.id)) {
                await interaction.followUp({
                    embeds: [
                        embed('That user is already banned.', 'error')
                    ]
                });

                return;
            };

            await interaction.guild.members.ban(user, { reason: reason });

            await db.infraction.create({
                data: {
                    id: interaction.id,
                    guildId: interaction.guildId,
                    userId: user.id,
                    moderatorId: interaction.user.id,
                    since: BigInt(Date.now()),
                    type: 'Ban',
                    expires: null,
                    reason: reason
                }
            });

            await interaction.followUp({
                embeds: [
                    embed('Successfully banned ' + user.toString() + '!', 'info')
                ]
            });

            await interaction.channel.send({
                embeds: [
                    embed(`${user.toString()} has been **banned** with the ID: \`${interaction.id}\``, 'error')
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