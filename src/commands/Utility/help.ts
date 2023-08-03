import { ApplicationCommandOptionChoiceData, EmbedBuilder, PermissionsBitField, SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { DropdownPaginatorBuilder, DropdownPaginatorStructureOptionsBuilder, SendMethod, time } from "aqify.js";
import { embed } from "../../func";

export default new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get all commands info.')
        .addStringOption((opt) =>
            opt.setName('command')
                .setDescription('Get info of a specific command.')
                .setAutocomplete(true)
                .setRequired(false)
        )
        .setDMPermission(false),
    async (client, interaction) => {

        const commandInput = interaction.options.getString('command');

        await interaction.deferReply();

        if (commandInput) {
            const command = client.commands.get(commandInput);

            if (!command) {
                await interaction.followUp({
                    embeds: [
                        embed('No command found with the name of **' + commandInput + '**.', 'error')
                    ]
                });

                return;
            };


            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Command Info - /' + commandInput)
                        .setDescription(`**Owner only**: ${command.options?.ownerOnly ? 'Yes' : 'No'}\n**Autocomplete**: ${command.options?.autocomplete ? 'Yes' : 'No'}\n**Sub commands**: ${command.structure.options.filter((v) => v.toJSON().type === 1).length}\n**Sub command groups**: ${command.structure.options.filter((v) => v.toJSON().type === 2).length}`)
                ]
            })
        } else {
            const commandsFetched = await client.application?.commands?.fetch();

            const commands: { name: string, id: string, suboption?: string, otheroption?: string, description: string }[] = [];

            commandsFetched?.forEach((cmd) => {
                if (cmd.type === 1) {
                    if (cmd.options && cmd.options?.length > 0) {
                        for (let option of cmd.options) {
                            if (option.type === 2 && option.options) {
                                for (let option2 of option.options) {
                                    commands.push({
                                        name: cmd.name,
                                        id: cmd.id,
                                        suboption: option.name,
                                        otheroption: option2.name,
                                        description: option2.description
                                    });
                                };
                            } else if (option.type === 1) {
                                commands.push({
                                    name: cmd.name,
                                    id: cmd.id,
                                    suboption: option.name,
                                    description: option.description
                                });
                            } else {
                                commands.push({
                                    name: cmd.name,
                                    id: cmd.id,
                                    description: cmd.description
                                });

                                break;
                            };
                        };
                    } else {
                        commands.push({
                            name: cmd.name,
                            id: cmd.id,
                            description: cmd.description
                        });
                    };
                };
            });

            const paginator = new DropdownPaginatorBuilder(interaction, {
                time: (60000 * 3)
            });

            const keys = [...client.categories.keys()];
            const final: DropdownPaginatorStructureOptionsBuilder[] = [];

            keys.forEach((key) => {
                const toAdd: { cat: string, values: string[] } = { cat: key, values: [] };
                const data = client.categories.get(key);

                commands.forEach((cmd) => {
                    if (data.some((v) => v === cmd.name)) {
                        toAdd.values.push(`</${cmd.name}${cmd.suboption ? ` ${cmd.suboption}` : ''}${cmd.otheroption ? ` ${cmd.otheroption}` : ''}:${cmd.id}>: ${cmd.description}`)
                    };
                });

                final.push({
                    component: {
                        label: toAdd.cat
                    },
                    message: {
                        content: `**${toAdd.cat} commands:**\n\n${toAdd.values.join('\n')}`
                    }
                });
            });

            paginator.addOptions(final);

            await paginator.send(SendMethod.FollowUp,
                new StringSelectMenuBuilder()
                    .setCustomId('help_menu_' + interaction.id)
                    .setPlaceholder('Select a module'),
                {
                    onNotAuthor: async (i) => {
                        await i.reply({ content: 'You are not the author of this interaction.' });
                    },
                    home: {
                        content: 'Select a module from the select menu below.\nThis request expires in: ' + time(Date.now() + (60000 * 3), 'R')
                    },
                    onEnd: {
                        content: 'This paginator has been expired after 3 minutes of timeout.'
                    }
                });
        };
    },
    {
        autocomplete: async (client, interaction) => {
            const value = interaction.options.getFocused().toLocaleLowerCase();

            const keys = [...client.commands.keys()];

            const choices: ApplicationCommandOptionChoiceData<string | number>[] = [];

            for (const key of keys) {
                choices.push({
                    name: key,
                    value: key
                })
            };

            const filtered = choices.filter((choice) => choice.name.includes(value)).slice(0, 25);

            if (!interaction) return;

            await interaction.respond(filtered);
        }
    }
);