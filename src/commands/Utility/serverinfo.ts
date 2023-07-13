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
        const guild = interaction.guild;

        let boostlvl = 0;

        if (guild.premiumSubscriptionCount >= 2) boostlvl = 1;
        if (guild.premiumSubscriptionCount >= 7) boostlvl = 2;
        if (guild.premiumSubscriptionCount >= 14) boostlvl = 3;

        const verificationLevelText = {
            0: "None",
            1: "Low",
            2: "Medium",
            3: "(╯°□°）╯︵  ┻━┻",
            4: "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Server Info')
                    .setThumbnail(guild.iconURL())
                    .addFields(
                        { inline: true, name: 'Server', value: `**Name**: ${guild.name}\n**ID**: ${guild.id}\n**Release date**: ${time(guild.createdTimestamp, 'D')} (${time(guild.createdTimestamp, 'R')})\n**Channels**: ${guild.channels.cache.size}\n**Emojis**: ${guild.emojis.cache.size}\n**Boosts**: ${guild.premiumSubscriptionCount}\n**Boost Level**: ${boostlvl}\n**Application commands registered**: ${guild.commands.cache.size}\n**Verification level**: ${verificationLevelText[guild.verificationLevel]}` },
                        { inline: true, name: 'Members', value: `**Total**: ${guild.members.cache.size}\n**Owner**: <@${guild.ownerId}>\n**Humans**: ${interaction.guild.members.cache.filter((v) => v.user.bot === false).size}\n**Bots**: ${interaction.guild.members.cache.filter((v) => v.user.bot === true).size}` }
                    )
                    .setColor('Blurple')
            ]
        });
    }
);
