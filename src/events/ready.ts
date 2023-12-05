import { Events, ActivityType } from "discord.js";
import config from "../config";
import { StartWatching } from "../core/Watcher";

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: any) {
        const isProduction = process.env.environment === "production";
        console.clear();
        client.user.setActivity({ type: ActivityType.Custom, name: config.startupActivity });
        console.log(`Logged in as ${client.user.tag}`);

        setInterval(() => {
            const random = config.Activities[Math.floor(Math.random() * config.Activities.length)];
            client.user.setActivity({ type: ActivityType.Custom, name: random.name });
        }, 5000)

    
        if (!isProduction) {
            await StartWatching();
        }
    }
}