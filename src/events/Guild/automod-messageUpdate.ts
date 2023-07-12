import { Message } from "discord.js";
import { Event } from "../../class/Builders";
import { _mainAutomodFunction } from "./automod";

export default new Event('messageUpdate', (_old, message: Message) => _mainAutomodFunction(message));