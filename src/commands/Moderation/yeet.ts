import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Builders";
import { wait } from "aqify.js";

export default new Command(
    new SlashCommandBuilder()
        .setName('yeet')
        .setDescription('Yeet all server members!!1!1!1!!!11!')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async (client, interaction, db) => {

        await interaction.reply({
            content: `Please wait...`
        });

        await wait(3000);

        const edit = async (percent: number) => {
            await wait(1750);

            await interaction.editReply({
                content: `Yeeting \`${interaction.guild.memberCount}\` members... (${percent}%)`
            });
        };

        await edit(1);
        await edit(9);
        await edit(14);
        await edit(26);
        await edit(35);
        await edit(49);
        await edit(51);
        await edit(62);
        await edit(69);
        await edit(78);
        await edit(84);
        await edit(91);
        await edit(99);

        await wait(1000);

        await interaction.followUp({
            content: 'Oh no! I don\'t have the required permissions, request cancelled.'
        });
    }
);
