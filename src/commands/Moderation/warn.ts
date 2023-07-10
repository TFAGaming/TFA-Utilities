import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import ms from 'ms';
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user.')
        .addUserOption((o) =>
            o.setName('user')
                .setDescription('The user to warn.')
                .setRequired(true)
        )
        .addStringOption((o) =>
            o.setName('reason')
                .setDescription('The reason of the warn.')
                .setRequired(false)
        )
        .addBooleanOption((o) =>
            o.setName('permanent')
                .setDescription('Whenever the warning should never be expired or not.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {
        const user = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason') || 'No reason was provided';
        const duration = interaction.options.getBoolean('permanent') ? null : (BigInt(Date.now() + ms('7d')));

        await interaction.deferReply({ ephemeral: true });

        await db.infraction.create({
            data: {
                id: interaction.id,
                guildId: interaction.guildId,
                userId: user.id,
                moderatorId: interaction.user.id,
                expires: duration,
                since: BigInt(Date.now()),
                type: 'Warn',
                reason: reason
            }
        });

        await interaction.followUp({
            embeds: [
                embed('Successfully warned ' + user.toString() + '!', 'info')
            ]
        });

        await interaction.channel.send({
            embeds: [
                embed(`${user.toString()} has been **warned** with the ID: \`${interaction.id}\``, 'warn')
            ]
        });
    }
);