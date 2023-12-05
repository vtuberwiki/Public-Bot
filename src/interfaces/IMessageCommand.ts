import { Message } from "discord.js";
import IClient from './IClient';

interface IMessageCommand {
    name: string;
    description: string;
    usage?: string;
    execute: (message: Message<boolean>, client: IClient, args: string[]) => Promise<void | Message<boolean> | undefined>;
}
export default IMessageCommand;