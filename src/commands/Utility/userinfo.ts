import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import axios from "axios";
import { embed } from "../../func";
import { time } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get a user\'s information.')
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The user to get their info.')
                .setRequired(false)
        )
        .setDMPermission(false),
    async (client, interaction, db) => {

        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        await interaction.deferReply();

        if (!member) {
            await interaction.followUp({
                embeds: [
                    embed('That user is not on the server.', 'error')
                ]
            });

            return;
        };

        /*
        You can change the emojis if you want by replacing the current emoji string to another custom emoji string.
        */
        const emojis = {
            Partner: '<:DiscordPartner:1108509450052063272>',
            Staff: '<:DiscordStaff:1108509676456378458>',
            Hypesquad: '<:HypesquadEvents:1108509259609673779>', // <= The Hypesquad gold
            BugHunterLevel1: '<:BugHunter:1108510903369994340>', // <= Green bug hunter
            BugHunterLevel2: '<:BugHunterGold:1108510932923068529>', // <= Gold bug hunter
            HypeSquadOnlineHouse1: '<:HypesquadBravery:1108509164327669780>', // <= Purple one
            HypeSquadOnlineHouse2: '<:HypesquadBrilliance:1108509194878984242>', // <= Orange one
            HypeSquadOnlineHouse3: '<:HypesquadBalance:1108509100431650907>', // <= Green one
            ActiveDeveloper: '<:ActiveDeveloper:1108509324059344937>',
            CertifiedModerator: '<:CertifiedDiscordModerator:1108510159489208421>',
            PremiumEarlySupporter: '<:EarlySupporter:1108509973186613320>', // <= Early supporter
            VerifiedDeveloper: '<:EarlyVerifiedDiscordBotDev:1108509539269087253>',
            NitroSubscription: '<:NitroSubscription:1108509587704926319>',
            SlashCommandsSupport: '<:SupportsCommands:1125396330764841011>',
            OriginallyKnownAs: '<:OriginallyKnownAs:1128995669726740510>'
        };

        let isBotAndVerified = false;
        let badges: string[] = [];

        // This HTTP Client requests for user info, and used on this command to detect if a user has Nitro subscription or not.
        const userData = await axios('https://japi.rest/discord/v1/user/' + user.id);
        const { data } = userData.data;
        
        if (data.public_flags_array) {
            await Promise.all(data.public_flags_array.map(async (badge: string) => {
                if (badge === 'NITRO') badges.push(emojis['NitroSubscription']);
                if (badge === 'VERIFIED_BOT') isBotAndVerified = true;
            }));
        };

        const badgesFetched = user.flags?.toArray();

        badgesFetched?.forEach((badge) => {
            if (badge in emojis) badges.push(emojis[badge]);
        });

        if (user.bot) badges.push(emojis['SlashCommandsSupport']);
        if (user.discriminator === '0') badges.push(emojis['OriginallyKnownAs']);

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('User Info - ' + user.username + (isBotAndVerified ? ' <:VerifiedBot:1127954811371925545>' : ''))
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription(`**Username**: ${user.username}\n**Display name**: (in dev)\n**ID**: ${user.id}\n**Nickname**: ${member.nickname ? member.nickname : 'None'}\n**Joined at**: ${time(member.joinedTimestamp, 'D')}\n**Created at**: ${time(user.createdTimestamp, 'D')}\n**Server booster**: ${member.premiumSince ? 'Yes' : 'No'}\n**Bot**: ${user.bot ? 'Yes' : 'No'}\n**Badges**: ${badges.join(' ')}\n**Guild owner**: ${user.id === interaction.guild.ownerId ? 'Yes' : 'No'}`)
                    .setColor('Blurple')
            ]
        });
    }
);