import { Client, Collection } from "discord.js";
import ISlashCommand from "./ISlashCommand";
import IMessageCommand from "./IMessageCommand";

interface IClient extends Client<boolean> {
    commands: Collection<string, ISlashCommand>;
    messageCommands: Collection<string, IMessageCommand>;
}

export default IClient;