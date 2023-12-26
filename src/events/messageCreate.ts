/**
 * NOT USED CURRENTLY
 */

import { Events, Message } from "discord.js";
import IClient from "../interfaces/IClient";
import config from "../config";
const supportServer = config.GuildIds.production;
const staffRole = config.StaffRole;
import Database from "../core/Database";



module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message, client: IClient) {
        if (message.author.bot) return;
        if (message.author.id === client.user?.id) return;
        if (!message.guild || !message.channel) return;

        console.log(`${message.author.tag} sent (${message.content}) in guild ${message.guild?.name} (${message.guild?.id}) in the channel ${message.guild?.channels.cache.get(message.channelId as string)?.name} (${message.channelId})`);


        // if (message.content.startsWith(config.StaffPrefix)) {
        //     const server = client.guilds.cache.get(supportServer as string);
        //     const member = await server?.members.fetch(message.author.id);
        //     if (!(member?.roles.cache.has(staffRole as string))) {
        //       return;
        //     }
      
        //     const args = message.content.slice(config.StaffPrefix.length).trim().split(/ +/);
        //     const commandName = args.shift()?.toLowerCase();

      
        //     if (!commandName) {
        //       return;
        //     }
      
        //     const command = client.messageCommands.get(commandName);
      
      
        //     if (!command) {
        //       return;
        //     }
      
        //     try {
        //       await command.execute(message, client, args);
        //     } catch (error) {
        //       console.error(error);
        //       await message.reply(`Error: ${(error as Error).message}\n\`${JSON.stringify(error, null, 2)}\``);
        //     }
        // } else {
        //     return;
        // }
    }
}