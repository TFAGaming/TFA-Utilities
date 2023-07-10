import { PermissionFlagsBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('cc')
        .setDescription('Custom commands system.')
        .addSubcommand((sub) =>
            sub.setName('create')
                .setDescription('Create a new custom command.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The name of the command.')
                        .setMaxLength(32)
                        .setMinLength(1)
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('description')
                        .setDescription('The description of the command.')
                        .setMaxLength(100)
                        .setMinLength(1)
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('message')
                        .setDescription('The message to say whenever the command is executed.')
                        .setMaxLength(2000)
                        .setMinLength(1)
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('update')
                .setDescription('Update a custom command.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The name of the command.')
                        .setMaxLength(32)
                        .setMinLength(1)
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('new-name')
                        .setDescription('The new name of the command.')
                        .setMaxLength(32)
                        .setMinLength(1)
                        .setRequired(false)
                )
                .addStringOption((opt) =>
                    opt.setName('new-description')
                        .setDescription('The new description of the command.')
                        .setMaxLength(100)
                        .setMinLength(1)
                        .setRequired(false)
                )
                .addStringOption((opt) =>
                    opt.setName('new-message')
                        .setDescription('The new message to say whenever the command is executed.')
                        .setMaxLength(2000)
                        .setMinLength(1)
                        .setRequired(false)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('delete')
                .setDescription('Delete a custom command.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The name of the command.')
                        .setMaxLength(32)
                        .setMinLength(1)
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async (client, interaction, db) => {

        await interaction.deferReply();

        switch (interaction.options.getSubcommand()) {
            case 'create': {
                const name = interaction.options.getString('name', true).toLowerCase();
                const description = interaction.options.getString('description', true);
                const message = interaction.options.getString('message', true);

                const count = await db.customCommand.count({
                    where: {
                        guildId: interaction.guildId
                    }
                });

                if (count >= 5) {
                    await interaction.followUp({
                        embeds: [
                            embed(`You can only created **5** custom commands per guild!`, 'error')
                        ]
                    });

                    return;
                };

                const secondcount = await db.customCommand.count({
                    where: {
                        guildId: interaction.guildId,
                        name: name
                    }
                });

                if (secondcount >= 1) {
                    await interaction.followUp({
                        embeds: [
                            embed(`This command name has been registered already!`, 'error')
                        ]
                    });

                    return;
                };

                if (client.commands.has(name)) {
                    await interaction.followUp({
                        embeds: [
                            embed(`This is a default application command name, you can't do that!`, 'error')
                        ]
                    });

                    return;
                };

                await interaction.followUp({
                    embeds: [
                        embed('Creating a new command... Please wait!', 'loading', 'This might take up to 3 minutes!')
                    ]
                });

                try {
                    const rest = new REST().setToken(process.env.CLIENT_TOKEN);

                    await db.customCommand.create({
                        data: {
                            guildId: interaction.guildId,
                            name: name,
                            description: description,
                            content: message
                        }
                    });

                    const data = await db.customCommand.findMany({
                        where: {
                            guildId: interaction.guildId
                        }
                    });

                    const commands = [];

                    for (const command of data) {
                        commands.push(
                            new SlashCommandBuilder()
                                .setName(command.name)
                                .setDescription(command.description)
                                .setDMPermission(false)
                        )
                    };

                    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, interaction.guildId), {
                        body: commands
                    });

                    await interaction.editReply({
                        embeds: [
                            embed(`The custom command **${name}** has been successfully created and registered!`, 'info')
                        ]
                    });
                } catch {
                    await interaction.editReply({
                        embeds: [
                            embed(`Unable to register the command, please try again later.`, 'error')
                        ]
                    });
                };

                break;
            };

            case 'update': {
                const name = interaction.options.getString('name', true);

                const newname = interaction.options.getString('new-name')?.toLowerCase();
                const newdescription = interaction.options.getString('new-description');
                const newmessage = interaction.options.getString('new-message');

                const count = await db.customCommand.count({
                    where: {
                        guildId: interaction.guildId,
                        name: name
                    }
                });

                if (count <= 0) {
                    await interaction.followUp({
                        embeds: [
                            embed(`No command was found with the name **${name}**.`, 'error')
                        ]
                    });

                    return;
                };

                if (!newname && !newdescription && !newmessage) {
                    await interaction.followUp({
                        embeds: [
                            embed('You need at least update something for the command; Name, description, or message!', 'error')
                        ]
                    });

                    return;
                };

                const secondcount = await db.customCommand.count({
                    where: {
                        guildId: interaction.guildId,
                        name: newname
                    }
                });

                if (secondcount >= 1) {
                    await interaction.followUp({
                        embeds: [
                            embed(`This new command name has been registered already!`, 'error')
                        ]
                    });

                    return;
                };

                if (client.commands.has(newname)) {
                    await interaction.followUp({
                        embeds: [
                            embed(`This is a default application command name, you can't do that!`, 'error')
                        ]
                    });

                    return;
                };

                await interaction.followUp({
                    embeds: [
                        embed('Updating the command... Please wait!', 'loading', 'This might take up to 3 minutes!')
                    ]
                });

                try {
                    const rest = new REST().setToken(process.env.CLIENT_TOKEN);

                    const olddata = (await db.customCommand.findMany({
                        where: {
                            guildId: interaction.guildId,
                            name: name
                        }
                    }))[0];

                    await db.customCommand.updateMany({
                        where: {
                            guildId: interaction.guildId,
                            name: name
                        },
                        data: {
                            name: newname || name,
                            description: newdescription || olddata.description,
                            content: newmessage || olddata.content
                        }
                    });

                    const data = await db.customCommand.findMany({
                        where: {
                            guildId: interaction.guildId
                        }
                    });

                    const commands = [];

                    for (const command of data) {
                        commands.push(
                            new SlashCommandBuilder()
                                .setName(command.name)
                                .setDescription(command.description)
                                .setDMPermission(false)
                        )
                    };

                    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, interaction.guildId), {
                        body: commands
                    });

                    await interaction.editReply({
                        embeds: [
                            embed(`The custom command **${name}** (now **${newname}**) has been updated!`, 'info')
                        ]
                    });
                } catch {
                    await interaction.editReply({
                        embeds: [
                            embed(`Unable to register the commands, please try again later.`, 'error')
                        ]
                    });
                };

                break;
            };

            case 'delete': {
                const name = interaction.options.getString('name', true).toLowerCase();

                const count = await db.customCommand.count({
                    where: {
                        guildId: interaction.guildId,
                        name: name
                    }
                });

                if (count <= 0) {
                    await interaction.followUp({
                        embeds: [
                            embed(`No command was found with the name **${name}**.`, 'error')
                        ]
                    });

                    return;
                };

                await interaction.followUp({
                    embeds: [
                        embed('Deleting the command... Please wait!', 'loading', 'This might take up to 3 minutes!')
                    ]
                });

                try {
                    const rest = new REST().setToken(process.env.CLIENT_TOKEN);

                    await db.customCommand.deleteMany({
                        where: {
                            guildId: interaction.guildId,
                            name: name
                        }
                    });

                    const data = await db.customCommand.findMany({
                        where: {
                            guildId: interaction.guildId
                        }
                    });

                    const commands = [];

                    for (const command of data) {
                        commands.push(
                            new SlashCommandBuilder()
                                .setName(command.name)
                                .setDescription(command.description)
                                .setDMPermission(false)
                        )
                    };
                    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, interaction.guildId), {
                        body: commands
                    });

                    await interaction.editReply({
                        embeds: [
                            embed(`The custom command **${name}** has been deleted!`, 'info')
                        ]
                    });
                } catch {
                    await interaction.editReply({
                        embeds: [
                            embed(`Unable to register the commands, please try again later.`, 'error')
                        ]
                    });
                };

                break;
            };
        };

    }
);
