import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Send a message to a user in DMs.')
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The user to DM them.')
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('message')
                .setDescription('The message for the DM.')
                .setRequired(false)
        )
        .addAttachmentOption((opt) =>
            opt.setName('attachment')
                .setDescription('If you want to send them a media (picture/video).')
                .setRequired(false)
        )
        .addBooleanOption((opt) =>
            opt.setName('mention')
                .setDescription('Tell the user that you are the author of the message or not.')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction) => {

        const user = interaction.options.getUser('user', true);
        const message = interaction.options.getString('message');
        const attachment = interaction.options.getAttachment('attachment');
        const mention = interaction.options.getBoolean('mention') || false;

        await interaction.deferReply({ ephemeral: true });

        try {
            if (!message && !attachment) {
                await interaction.followUp({
                    embeds: [
                        embed('You need at least to send a message, either an attachment.', 'error')
                    ]
                });

                return;
            };

            await user?.send({
                content: `${mention ? `**${interaction.user.tag}** has sent you a message:\n` : ''}${message}`,
                files: attachment ? [attachment] : undefined
            }).catch(() => { });

            await interaction.editReply({
                embeds: [
                    embed('Successfully sent the message to ' + user.toString() + '.', 'info')
                ]
            });

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