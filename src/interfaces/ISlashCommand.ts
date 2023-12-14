import { SlashCommandBuilder, CommandInteraction, AutocompleteInteraction } from "discord.js"; 

interface ISlashCommand {
    data: SlashCommandBuilder;
    execute?: (interaction: CommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export default ISlashCommand;