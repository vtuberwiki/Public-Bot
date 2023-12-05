import { SlashCommandBuilder, CommandInteraction } from "discord.js"; 

interface ISlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export default ISlashCommand;