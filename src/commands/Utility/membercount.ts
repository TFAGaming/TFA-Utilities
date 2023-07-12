import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";

export default new Command(
    new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Get the number of humans and bots on the server.')
        .setDMPermission(false),
    async (client, interaction, db) => {

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Server Member Count')
                    .setDescription(`There are currently **${interaction.guild.memberCount}** members in total.\n**Humans**: ${interaction.guild.members.cache.filter((m) => m.user.bot === false).size}\n**Bots**: ${interaction.guild.members.cache.filter((m) => m.user.bot === true).size}`)
                    .setColor('Blurple')
            ]
        });

    }
);
