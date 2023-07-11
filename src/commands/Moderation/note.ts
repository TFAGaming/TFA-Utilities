import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";
import { time } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('note')
        .setDescription('Note system.')
        .addSubcommand((s) =>
            s.setName('add')
                .setDescription('Add a note to a user.')
                .addUserOption((o) =>
                    o.setName('user')
                        .setDescription('The user to add a new note.')
                        .setRequired(true)
                )
                .addStringOption((o) =>
                    o.setName('message')
                        .setDescription('The message of the new note.')
                        .setRequired(true)
                )
        )
        .addSubcommandGroup((s) =>
            s.setName('update')
                .setDescription('Edit a note from a user.')
                .addSubcommand((s) =>
                    s.setName('message')
                        .setDescription('Edit a note from a user.')
                        .addUserOption((o) =>
                            o.setName('user')
                                .setDescription('The user to update it\'s note message.')
                                .setRequired(true)
                        )
                        .addStringOption((o) =>
                            o.setName('new-message')
                                .setDescription('The new message of the note.')
                                .setRequired(true)
                        )
                )
        )
        .addSubcommand((s) =>
            s.setName('view')
                .setDescription('View your note from a user.')
                .addUserOption((o) =>
                    o.setName('user')
                        .setDescription('The user to view it\'s note.')
                        .setRequired(true)
                )
        )
        .addSubcommand((s) =>
            s.setName('delete')
                .setDescription('Delete your note from a user.')
                .addUserOption((o) =>
                    o.setName('user')
                        .setDescription('The user to delete it\'s note.')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {

        await interaction.deferReply({ ephemeral: true });

        switch (interaction.options.getSubcommand()) {
            case 'add': {
                const user = interaction.options.getUser('user', true);
                const message = interaction.options.getString('message', true);

                const count = await db.note.count({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                });

                if (count >= 1) {
                    await interaction.followUp({
                        embeds: [
                            embed(`There is a note already added to ${user.toString()}.`, 'error')
                        ]
                    });

                    return;
                };

                await db.note.create({
                    data: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: interaction.user.id,
                        message: message,
                        since: BigInt(Date.now())
                    }
                });

                await interaction.followUp({
                    embeds: [
                        embed(`Successfully added a new note to ${user.toString()}.`, 'info')
                    ]
                });

                break;
            };

            // Must be 'message', not 'update'.
            case 'message': {
                const user = interaction.options.getUser('user', true);
                const message = interaction.options.getString('new-message', true);

                const count = await db.note.count({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                });

                if (count <= 0) {
                    await interaction.followUp({
                        embeds: [
                            embed(`No note was created for ${user.toString()}.`, 'error')
                        ]
                    });

                    return;
                };

                await db.note.updateMany({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    },
                    data: {
                        message: message,
                        edited: true
                    }
                });

                await interaction.followUp({
                    embeds: [
                        embed(`Successfully edited the note for ${user.toString()}.`, 'info')
                    ]
                });

                break;
            };

            case 'view': {
                const user = interaction.options.getUser('user', true);

                const count = await db.note.count({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                });

                if (count <= 0) {
                    await interaction.followUp({
                        embeds: [
                            embed(`No note was created for ${user.toString()}.`, 'error')
                        ]
                    });

                    return;
                };

                const data = (await db.note.findMany({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                }))[0];

                await interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Note for ${user.username} ${data.edited ? '(edited)' : ''}`,
                                iconURL: user.displayAvatarURL()
                            })
                            .setDescription(`${time(Number(data.since), 'D')} — ` + data.message)
                            .setFooter({
                                text: 'Nobody can see this note, except for you.'
                            })
                            .setColor('Blurple')
                    ]
                });

                break;
            };

            case 'delete': {
                const user = interaction.options.getUser('user', true);

                const count = await db.note.count({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                });

                if (count <= 0) {
                    await interaction.followUp({
                        embeds: [
                            embed(`No note was created for ${user.toString()}.`, 'error')
                        ]
                    });

                    return;
                };

                await db.note.deleteMany({
                    where: {
                        guildId: interaction.guildId,
                        authorId: interaction.user.id,
                        userId: user.id
                    }
                });

                await interaction.followUp({
                    embeds: [
                        embed('Successfully deleted note for ' + user.toString() + '.', 'info')
                    ]
                })

                return;
            };
        };
    }
);
