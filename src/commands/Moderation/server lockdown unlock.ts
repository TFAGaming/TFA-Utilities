import { ChannelType, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";
import config from "../../config";

export default new Command(
    new SlashCommandBuilder()
        .setName('server')
        .setDescription('Lockdown and unlock system.')
        .addSubcommand((s) =>
            s.setName('lockdown')
                .setDescription('Disable the permissions from members to chat in all channels.')
                .addStringOption((o) =>
                    o.setName('reason')
                        .setDescription('The reason of the lockdown.')
                        .setRequired(false)
                )
        )
        .addSubcommand((s) =>
            s.setName('unlock')
                .setDescription('Unlock the server.')
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
            case 'lockdown': {
                const reason = interaction.options.getString('reason') || 'No reason was provided';

                await interaction.channel.send({
                    content: ':rotating_light: Server lockdown started.'
                });

                for (const channel of config.lockdown.channels) {
                    const channelFetch = (interaction.guild.channels.cache.find((x) => x.id === channel && x.type === 0)) as TextChannel;

                    await channelFetch.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                        SendMessages: false,
                        AddReactions: false,
                        CreatePublicThreads: false,
                        CreatePrivateThreads: false
                    });

                    if (channelFetch.id !== interaction.channel.id) await channelFetch.send({
                        content: ':lock: The server is currently in lockdown, please check ' + interaction.channel.toString() + ' for updates.'
                    });
                };

                await interaction.followUp({
                    embeds: [
                        embed(`The server has been locked down!`, 'info')
                    ]
                });

                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Server Lockdown')
                            .setDescription(`The server is in lock down, you are **not** muted, **no one can talk here**.`)
                            .addFields({ name: 'Lock reason', value: reason })
                            .setFooter({
                                text: 'Please do not contact any staff members to ask why, updates by administrators will be posted here eventually.'
                            })
                            .setColor('Red')
                    ]
                });

                break;
            };

            case 'unlock': {
                const reason = interaction.options.getString('reason') || 'No reason was provided';

                for (const channel of config.lockdown.channels) {
                    const channelFetch = (interaction.guild.channels.cache.find((x) => x.id === channel && x.type === 0)) as TextChannel;

                    await channelFetch.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                        SendMessages: null,
                        AddReactions: null,
                        CreatePublicThreads: null,
                        CreatePrivateThreads: null
                    });
                };

                await interaction.followUp({
                    embeds: [
                        embed(`The server has been unlocked!`, 'info')
                    ]
                });

                await interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Server Unlocked')
                            .setDescription(`The server has been unlocked, you are allowed to chat again.`)
                            .addFields({ name: 'Unlock reason', value: reason })
                            .setColor('Green')
                    ]
                });

                break;
            };
        };

    }
);
