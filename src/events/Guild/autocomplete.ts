import { client } from "../..";
import { Event } from "../../class/Builders";

export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    
    try {
        if (command.options?.autocomplete) command.options.autocomplete(client, interaction);
    } catch (e) {
        console.error(e);
    };
});