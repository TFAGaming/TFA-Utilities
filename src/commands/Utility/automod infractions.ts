import { EmbedBuilder, EmbedField, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";
import { time } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Read all the infractions by automod history of your account.')
        .addSubcommand((s) =>
            s.setName('infractions')
                .setDescription('Read all the infractions by automod history of your account.')
                .addUserOption((o) =>
                    o.setName('user')
                        .setDescription('The user to check their infractions.')
                        .setRequired(false)
                )
        )
        .setDMPermission(false),
    async (client, interaction, db) => {
        interaction.user = interaction.options.getUser('user') || interaction.user;

        await interaction.deferReply();

        const count = await db.automodInfraction.count({
            where: {
                guildId: interaction.guildId,
                userId: interaction.user.id
            }
        });

        if (count === 0) {
            await interaction.followUp({
                embeds: [
                    embed(interaction.user.toString() + ' is currently have no infractions.', 'info')
                ]
            });

            return;
        };

        const data = await db.automodInfraction.findMany({
            where: {
                guildId: interaction.guildId,
                userId: interaction.user.id
            }
        });

        const fields: EmbedField[] = [];

        for (const infraction of data) {
            fields.push({
                name: `**ID**: \`${infraction.id}\` | **Expires**: ${infraction.expires ? time(parseInt(infraction.expires.toString()), 'R') : 'Permanent'}`,
                value: `**Verbal warn**: ${infraction.reason} — ${time(parseInt(infraction.since.toString()), 'd')}`,
                inline: false
            });
        };

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setDescription('These are the warnings that were issued by ' + client.user.toString() + ', not manually.')
                    .addFields(fields)
            ]
        });
    }
);