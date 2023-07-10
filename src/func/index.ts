import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "..";

export const embed = (message: string, type?: 'error' | 'info' | 'warn' | 'loading' | 'none', footer?: string) => {
    switch (type) {
        case 'error': {
            return new EmbedBuilder()
                .setDescription(message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('Red');
        };

        case 'warn': {
            return new EmbedBuilder()
                .setDescription(message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('Yellow');
        };

        case 'info': {
            return new EmbedBuilder()
                .setDescription(message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('#04fb9b');
        };

        case 'loading': {
            return new EmbedBuilder()
                .setDescription(':arrows_counterclockwise: ' + message)
                .setFooter(footer ? { text: footer } : null);
        };

        default: {
            return new EmbedBuilder()
                .setDescription(message)
                .setFooter(footer ? { text: footer } : null);
        };
    };
};

export const infractionRemover = () => {
    client.guilds.cache.forEach(async (guild) => {
        const data = await client.db.infraction.findMany({
            where: {
                guildId: guild.id
            }
        });

        if (!data) return;

        data.forEach(async (infraction) => {
            if (!infraction.expires) return;

            // Whenever the date of the expires date (of the infraction) is lower or equal to current date, it will be removed.
            if (Date.now() >= infraction.expires) {
                await client.db.infraction.deleteMany({
                    where: {
                        guildId: guild.id,
                        userId: infraction.userId,
                        id: infraction.id
                    }
                });
            };
        });
    });
};

export const automodInfractionRemover = () => {
    client.guilds.cache.forEach(async (guild) => {
        const data = await client.db.automodInfraction.findMany({
            where: {
                guildId: guild.id
            }
        });

        if (!data) return;

        data.forEach(async (infraction) => {
            if (!infraction.expires) return;

            // Whenever the date of the expires date (of the infraction) is lower or equal to current date, it will be removed.
            if (Date.now() >= infraction.expires) {
                await client.db.automodInfraction.deleteMany({
                    where: {
                        guildId: guild.id,
                        userId: infraction.userId,
                        id: infraction.id
                    }
                });
            };
        });
    });
};

// Original source: StackOverflow
export const nFormatter = (num: number, precision: number = 1) => {
    const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'k', threshold: 1e3 },
        { suffix: '', threshold: 1 },
    ];

    const found = map.find((x) => Math.abs(num) >= x.threshold);

    if (found) {
        const formatted = (num / found.threshold).toFixed(precision) + found.suffix;

        return formatted;
    };

    return num;
};

export const checkCC = async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const data = (await client.db.customCommand.findMany({
        where: {
            name: interaction.commandName,
            guildId: interaction.guildId
        }
    }))[0];

    if (!data) return;

    await interaction.reply({
        content: `${data.content}`
    });

    return;
};