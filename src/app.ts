import { Client, Collection } from "discord.js";
import config from "./config";
import dotenv from "dotenv";
import IClient from "./interfaces/IClient";
import { join } from "path";
import { readdirSync } from "fs"


dotenv.config();


const client = new Client({
    intents: config.Intents,
    allowedMentions: {
        parse: ["everyone", "roles", "users"],
        repliedUser: true
    }
}) as IClient;

client.commands = new Collection();
client.messageCommands = new Collection();

const eventsPath = join(__dirname, "events");
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js") || file.endsWith(".ts")); /** Allow for DEBUG and PRODUCTION */

const commandFolders = readdirSync(join(__dirname, "commands", 'Slash'));
// const messageCommandFolders = readdirSync(join(__dirname, "commands", 'Message'));

for (const folder of commandFolders) {
    const commandFiles = readdirSync(join(__dirname, "commands", 'Slash', folder)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "commands", 'Slash', folder, file));
        client.commands.set(command.command.data.name, command.command);
    }
}

// for (const folder of messageCommandFolders) {
//     const commandFiles = readdirSync(join(__dirname, "commands", 'Message', folder)).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
//     for (const file of commandFiles) {
//         const command = require(join(__dirname, "commands", 'Message', folder, file));
//         client.messageCommands.set(command.command.name, command.command);
//     }
// }


for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}


client.login(process.env.token)