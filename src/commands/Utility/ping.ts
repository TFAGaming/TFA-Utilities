import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";

export default new Command(
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .setDMPermission(false),
    async (client, interaction) => {
        const dateBeforeDefer = Date.now();

        await interaction.deferReply();

        const dateAfterDefer = Date.now();

        const dateBeforeDB = Date.now();

        await client.db.infraction.findMany();

        const dateAfterDB = Date.now();

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Latency')
                    .addFields(
                        {
                            name: 'Client',
                            value: `**WS ping**: ${client.ws.ping}ms\n**Heartbeat**: 80beat/s`,
                            inline: true
                        },
                        {
                            name: 'Interaction',
                            value: `**Type**: ChatInputCommandInteraction\n**Latency**: ${dateAfterDefer - dateBeforeDefer}ms`,
                            inline: true
                        },
                        {
                            name: 'Database',
                            value: `**Provider**: SQLite\n**Manager**: Prisma.io\n**Latency**: ${dateAfterDB - dateBeforeDB}ms`,
                            inline: true
                        }
                    )
                    .setColor('Blurple')
            ]
        });
    }
);