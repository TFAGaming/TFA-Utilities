import { ChannelType, Message, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge system.')
        .addSubcommandGroup((sub) =>
            sub.setName('user')
                .setDescription('Purge user messages.')
                .addSubcommand((sub) =>
                    sub.setName('messages')
                        .setDescription('Purge user messages.')
                        .addUserOption((opt) =>
                            opt.setName('user')
                                .setDescription('The user to delete their messages.')
                                .setRequired(true)
                        )
                        .addNumberOption((opt) =>
                            opt.setName('amount')
                                .setDescription('The amount of messages to delete.')
                                .setMaxValue(100)
                                .setMinValue(1)
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((sub) =>
            sub.setName('channel')
                .setDescription('Purge channel messages.')
                .addSubcommand((sub) =>
                    sub.setName('messages')
                        .setDescription('Purge channel messages.')
                        .addNumberOption((opt) =>
                            opt.setName('amount')
                                .setDescription('The amount of messages to delete.')
                                .setMaxValue(100)
                                .setMinValue(1)
                                .setRequired(true)
                        )
                        .addChannelOption((opt) =>
                            opt.setName('channel')
                                .setDescription('The channel to purge the messages.')
                                .addChannelTypes(
                                    ChannelType.GuildText
                                )
                                .setRequired(false)
                        )
                )
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async (client, interaction) => {
        const subcommandgroup = interaction.options.getSubcommandGroup();

        await interaction.deferReply({ ephemeral: true });

        try {
            if (subcommandgroup === 'user') {
                const user = interaction.options.getUser('user', true);
                const amount = interaction.options.getNumber('amount', true);

                if (!amount) {
                    await interaction.followUp({
                        embeds: [
                            embed('Invalid amount provided.', 'error')
                        ]
                    });

                    return;
                };

                const messages = await interaction.channel?.messages.fetch({
                    limit: amount || 0
                });

                let index = 0;
                const filtered: Message<true | false>[] = [];

                messages?.forEach((msg) => {
                    if (msg.author.id === user?.id && amount > index) {
                        filtered.push(msg);

                        index++;
                    };
                });

                await (interaction.channel as TextChannel)?.bulkDelete(filtered);

                await interaction.followUp({
                    embeds: [
                        embed(`Successfully deleted **${filtered.length}** messages from ${user.toString()}.`, 'info')
                    ]
                });

                return;
            };

            if (subcommandgroup === 'channel') {
                const amount = interaction.options.getNumber('amount', true);
                const channel = interaction.options.getChannel('channel') || interaction.channel;

                await (channel as TextChannel).bulkDelete(amount);

                await interaction.followUp({
                    embeds: [
                        embed(`Successfully deleted **${amount}** messages in ${channel.toString()}.`, 'info')
                    ]
                });

                return;
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
