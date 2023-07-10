import { ChannelType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Lock and unlock system.')
        .addSubcommand((s) =>
            s.setName('lock')
                .setDescription('Lock a channel.')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel to lock.')
                        .addChannelTypes(
                            ChannelType.GuildText
                        )
                        .setRequired(false)
                )
                .addStringOption((o) =>
                    o.setName('reason')
                        .setDescription('The reason of the lock.')
                        .setRequired(false)
                )
        )
        .addSubcommand((s) =>
            s.setName('unlock')
                .setDescription('Unlock a channel.')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel to unlock.')
                        .addChannelTypes(
                            ChannelType.GuildText
                        )
                        .setRequired(false)
                )
                .addStringOption((o) =>
                    o.setName('reason')
                        .setDescription('The reason of the unlock.')
                        .setRequired(false)
                )
        )
        .setDMPermission(false),
    async (client, interaction, db) => {

        await interaction.deferReply({ ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            case 'lock': {
                const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
                const reason = interaction.options.getString('reason') || 'No reason was provided';

                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                    SendMessages: false,
                    AddReactions: false,
                    CreatePublicThreads: false,
                    CreatePrivateThreads: false
                });

                await interaction.followUp({
                    embeds: [
                        embed(`${channel.toString()} has been locked!`, 'info')
                    ]
                });

                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Channel Locked')
                            .setDescription(`This channel has been locked by a staff, you are **not** muted, **no one can talk here**.`)
                            .addFields({ name: 'Lock reason', value: reason })
                            .setFooter({
                                text: 'Please do not contact any staff members to ask why, updates by administrators will be posted here eventually.'
                            })
                            .setColor('Yellow')
                    ]
                })

                break;
            };

            case 'unlock': {
                const channel = (interaction.options.getChannel('channel') || interaction.channel) as TextChannel;
                const reason = interaction.options.getString('reason') || 'No reason was provided';

                await channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                    SendMessages: null,
                    AddReactions: null,
                    CreatePublicThreads: null,
                    CreatePrivateThreads: null
                });

                await interaction.followUp({
                    embeds: [
                        embed(`${channel.toString()} has been unlocked!`, 'info')
                    ]
                });

                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Channel Unlocked')
                            .setDescription(`This channel has been unlocked by a staff, you are allowed to chat again.`)
                            .addFields({ name: 'Unlock reason', value: reason })
                            .setColor('Green')
                    ]
                })

                break;
            };
        };

    }
);
