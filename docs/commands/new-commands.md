---
title: Creating a New Command
description: Learn how to create a new command for the Vtuber Wiki Discord Bot.
---

# Creating a New Command

To create a new command for the Vtuber Wiki Discord Bot, you can follow the template provided below. This example focuses on a base command named "stats" that users can build upon.

## Base Command Structure

The base command file typically follows this structure:

```typescript
// Import necessary dependencies
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import ISlashCommand from "../../../interfaces/ISlashCommand";

// Define the command using the SlashCommandBuilder
export const command: ISlashCommand = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get stats about the bot."),
    async execute(interaction: CommandInteraction) {
        // Add the command logic here
    },
} as ISlashCommand;
```

## Command Explanation

- `SlashCommandBuilder`: This class is used to build slash commands. In this example, it's creating a command named "stats" with a description.

- `execute` Function: This asynchronous function handles the execution of the command. You can add the logic specific to your command within this function.

## ISlashCommand Interface

The `ISlashCommand` interface is crucial for maintaining a consistent structure for all commands. It is defined as follows:

```typescript
// Import necessary dependencies
import { SlashCommandBuilder, CommandInteraction } from "discord.js"; 

// Define the interface
interface ISlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

// Export the interface
export default ISlashCommand;
```

## Interface Explanation

- `SlashCommandBuilder`: The same class used to build commands is utilized in the interface to ensure that the command structure adheres to the required format.

- `execute` Function: This function, defined in the interface, specifies the structure for the command execution logic. It takes a CommandInteraction as a parameter and returns a Promise<void>.

By adhering to the `ISlashCommand` interface, new commands can seamlessly integrate with the bot's command handling system, promoting consistency and maintainability.