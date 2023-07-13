import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";

export default new Command(
    new SlashCommandBuilder()
        .setName('oldestmember')
        .setDescription('Find the first person that joined the server!')
        .setDMPermission(false),
    async (client, interaction, db) => {

        const member = [...interaction.guild.members.cache
            .filter((v) => v.user.id !== interaction.guild.ownerId)
            .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            .values()][0];

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Oldest Member')
                    .setDescription(`The user ` + member.user.toString() + ' is the first person to join this server!')
                    .setColor('Blurple')
            ]
        });
    }
);
