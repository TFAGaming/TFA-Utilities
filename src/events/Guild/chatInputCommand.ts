import { client } from "../..";
import { Event } from "../../class/Builders";
import { checkCC, embed } from "../../func";

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        await checkCC(interaction);

        return;
    };

    const { options } = command;

    if (options) {
        // Owner only
        if (options.ownerOnly && interaction.user.id !== process.env.OWNER_ID) {
            await interaction.reply({
                embeds: [
                    embed('You are not the developer of the bot.', 'error')
                ],
                ephemeral: true
            });

            return;
        };
    };

    try {
        command.run(client, interaction, client.db);
    } catch (e) {
        console.error(e);
    };
});