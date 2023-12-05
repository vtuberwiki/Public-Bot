import { REST, Routes } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from 'dotenv';
import * as cfg from "./config";

config();

const commands: any[] = [];

const folderPath = join(__dirname, "commands", "Slash");
const commandFolders = readdirSync(folderPath);

for (const folder of commandFolders) {
    const commandsPath = join(folderPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
        const path = join(commandsPath, file);
        const { command } = require(path);

        //@ts-ignore
        commands.push(command.data.toJSON());
    }
}

(async () => {
    if (!process.env.client_id) {
        console.error("client_id is not defined in .env");
        process.exit(1);
    }

    if (!process.env.token) {
        console.error("token is not defined in .env");
        process.exit(1);
    }

    const rest = new REST({ version: '10' }).setToken(process.env.token || "");

    try {
        console.log(`Started refreshing application (/) commands. (${commands.length})`);

        let data: any[] = [];

        if (process.env.environment === "production") {
            const responseData = await rest.put(
                Routes.applicationCommands(process.env.client_id),
                { body: commands },
            );

            if (Array.isArray(responseData)) {
                data = responseData;
            } else {
                console.error("Invalid response data format");
                process.exit(1);
            }
        } else {
            const responseData = await rest.put(
                Routes.applicationGuildCommands(process.env.client_id, cfg.default.GuildId),
                { body: commands },
            );

            if (Array.isArray(responseData)) {
                data = responseData;
            } else {
                console.error("Invalid response data format");
                process.exit(1);
            }
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
