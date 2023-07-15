import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";

export default new Command(
    new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription('Get or make a timestamp for Discord.')
        .addIntegerOption((opt) =>
            opt.setName('unix')
                .setDescription('The unix time if you want to test.')
                .setRequired(false)
        )
        .setDMPermission(false),
    async (client, interaction, db) => {
        const unix = interaction.options.getInteger('unix') || Date.now();

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Timestamp')
                    .setDescription(`Unix time: ${unix}\nThe timestamp type is optional. By default, it's \`f\`.`)
                    .addFields(
                        { name: 'Date', value: `\`<t:${unix}:d>\` <t:${unix}:d>\n\`<t:${unix}:D>\` <t:${unix}:D>` },
                        { name: 'Time', value: `\`<t:${unix}:t>\` <t:${unix}:t>\n\`<t:${unix}:T>\` <t:${unix}:T>` },
                        { name: 'Date & Time', value: `\`<t:${unix}:f>\` <t:${unix}:f>\n\`<t:${unix}:F>\` <t:${unix}:F>` },
                        { name: 'Relative', value: `\`<t:${unix}:R>\` <t:${unix}:R>` }
                    )
                    .setColor('Blurple')
            ]
        })
    }
);
