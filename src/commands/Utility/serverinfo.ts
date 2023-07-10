import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";
import { time } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get this server\'s information.')
        .setDMPermission(false),
    async (client, interaction, db) => {
        const datebefore = Date.now();

        await interaction.reply({
            embeds: [
                embed('Please wait...', 'loading')
            ]
        });

        const guild = interaction.guild;

        const dateafter = Date.now();

        let boostlvl = 0;

        if (guild.premiumSubscriptionCount >= 2) boostlvl = 1;
        if (guild.premiumSubscriptionCount >= 7) boostlvl = 2;
        if (guild.premiumSubscriptionCount >= 14) boostlvl = 3;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Server Info')
                    .setThumbnail(guild.iconURL())
                    .addFields(
                        { inline: true, name: 'Server', value: `**Name**: ${guild.name}\n**ID**: ${guild.id}\n**Release date**: ${time(guild.createdTimestamp, 'D')} (${time(guild.createdTimestamp, 'R')})\n**Channels**: ${guild.channels.cache.size}\n**Emojis**: ${guild.emojis.cache.size}\n**Boosts**: ${guild.premiumSubscriptionCount}\n**Boost Level**: ${boostlvl}\n**Application commands registered**: ${guild.commands.cache.size}\n**Verification level**: ${guild.verificationLevel}` },
                        { inline: true, name: 'Members', value: `**Total**: ${guild.members.cache.size}\n**Owner**: <@${guild.ownerId}>\n**Humans**: ${interaction.guild.members.cache.filter((v) => v.user.bot === false).size}\n**Bots**: ${interaction.guild.members.cache.filter((v) => v.user.bot === true).size}` }
                    )
                    .setFooter({
                        text: `Took ${Math.floor((dateafter - datebefore) / 1000)} seconds to fetch the data.`
                    })
                    .setColor('Blurple')
            ]
        });
    }
);
