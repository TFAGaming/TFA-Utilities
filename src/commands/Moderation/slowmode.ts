import { PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";
import ms from 'ms';

export default new Command(
    new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set/Default slowmode')
        .addSubcommand((sub) =>
            sub.setName('set')
                .setDescription('Set the current channel\'s slowmode.')
                .addStringOption((opt) =>
                    opt.setName('time')
                        .setDescription('The time of the slowmode')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('get')
                .setDescription('Get the slowmode of the current channel.')
        )
        .addSubcommand((sub) =>
            sub.setName('default')
                .setDescription('Set default current channel\'s slowmode.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction) => {

        try {
            switch (interaction.options.getSubcommand()) {
                case 'set': {
                    const time = Math.floor(ms(interaction.options.getString('time', true)) / 1000);

                    await interaction.deferReply();

                    await (interaction.channel as TextChannel).setRateLimitPerUser(time).catch(() => { });

                    await interaction.followUp({
                        embeds: [
                            embed(`The new slowmode for the channel ${interaction.channel.toString()} is: **${ms(time * 1000, { long: true })}**.`, 'info')
                        ]
                    });

                    break;
                };

                case 'get': {
                    await interaction.deferReply();

                    const slowmode = (interaction.channel as TextChannel).rateLimitPerUser * 1000;

                    if (slowmode <= 0) {
                        await interaction.followUp({
                            embeds: [
                                embed(`The slowmode is currently disabled in the channel ${interaction.channel.toString()}.`, 'none')
                            ]
                        });

                        return;
                    };

                    await interaction.followUp({
                        embeds: [
                            embed(`The current slowmode of the channel ${interaction.channel.toString()} is: **${ms(slowmode, { long: true })}**.`, 'none')
                        ]
                    });

                    break;
                };

                case 'default': {
                    await interaction.deferReply();

                    await (interaction.channel as TextChannel).setRateLimitPerUser(0);

                    await interaction.followUp({
                        embeds: [
                            embed(`Disabled slowmode for the channel ${interaction.channel.toString()}.`, 'info')
                        ]
                    });

                    break;
                };
            };

        } catch (e) {
            console.error(e);

            await interaction.editReply({
                embeds: [
                    embed('Unable to run the command properly, please check the console.', 'error')
                ]
            });
        };
    }
);