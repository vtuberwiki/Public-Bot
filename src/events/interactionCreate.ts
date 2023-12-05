import { Events, CommandInteraction } from "discord.js";
import IClient from "../interfaces/IClient";



module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: CommandInteraction, client: IClient) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (!interaction.guild) return;

        try {
            await command.execute(interaction);
            console.log(`${interaction.user.tag} used command ${interaction.commandName} in guild ${interaction.guild?.name} (${interaction.guild?.id}) in the channel ${interaction.guild?.channels.cache.get(interaction.channel?.id as string)?.name} (${interaction.channel?.id})`);
        } catch (error) {
            console.error(`Error while executing command ${interaction.commandName}: ${error}`);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });

        }
    }
}