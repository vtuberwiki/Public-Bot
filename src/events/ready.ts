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

            if (!random || typeof random.type !== 'string') {
                return;
            }

            const activityType: ActivityType | undefined = getActivityType(random.type);

            if (activityType !== undefined) {
                const activityName: string = random.name || '';

                client.user.setActivity({ type: activityType, name: activityName });
            }
        }, 5000);


        if (!isProduction) {
            await StartWatching();
        }
    }
}

function getActivityType(type: string): ActivityType | undefined {
    switch (type.toLowerCase()) {
        case 'playing':
            return ActivityType.Playing;
        case 'listening':
            return ActivityType.Listening;
        case 'watching':
            return ActivityType.Watching;
        case 'competing':
            return ActivityType.Competing;
        default:
            return undefined;
    }
}