import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { DropdownPaginatorBuilder, DropdownPaginatorStructureOptionsBuilder, SendMethod, time } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get all commands info.')
        .setDMPermission(false),
    async (client, interaction) => {

        await interaction.deferReply();

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
            customId: interaction.id,
            placeHolder: 'Select a module',
            time: (60000 * 3)
        });

        const keys = [...client.categories.keys()];
        const final: DropdownPaginatorStructureOptionsBuilder[] = [];

        const emojis = {
            'Moderation': '⚒️',
            'Utility': '⚙',
            'Administrator': '⛔'
        };

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
                    label: toAdd.cat,
                    emoji: emojis[toAdd.cat] || undefined
                },
                message: {
                    content: `${emojis[toAdd.cat]} **${toAdd.cat} commands:**\n\n${toAdd.values.join('\n')}`
                }
            });
        });

        paginator.addOptions(final);

        await paginator.send(SendMethod.FollowUp, {
            onNotAuthor: async (i) => {
                await i.reply({ content: 'You are not the author of this interaction.' });
            },
            home: {
                content: 'Select a module from the select menu below.\nThis request expires in: ' + time(Date.now() + (60000 * 3), 'R')
            },
            onEnd: {
                content: 'This paginator has been expired after 1 minute of timeout.'
            }
        });
    }
);