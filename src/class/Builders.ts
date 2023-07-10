import { ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import ExtendedClient from "./ExtendedClient";

export interface CommandOptions {
    ownerOnly?: boolean,
    premium?: boolean
};

export class Command {
    readonly structure: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    readonly run: (client: ExtendedClient, interaction: ChatInputCommandInteraction, db: ExtendedClient['db']) => void;
    readonly options: CommandOptions;

    constructor(
        structure: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
        run: (client: ExtendedClient, interaction: ChatInputCommandInteraction, db: ExtendedClient['db']) => void,
        options?: CommandOptions,
    ) {
        this.structure = structure;
        this.run = run;
        this.options = options;
    };
};

export class Event<K extends keyof ClientEvents> {
    readonly event: K;
    readonly run: (...args: ClientEvents[K]) => void;
    readonly once?: boolean;

    constructor(
        event: K,
        run: (...args: ClientEvents[K]) => void,
        once?: boolean
    ) {
        this.event = event;
        this.run = run;
        this.once = once;
    };
};