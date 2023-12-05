import { GatewayIntentBits } from "discord.js";

import { IConfig, IActivity } from "./interfaces/IConfig";

const config: IConfig = {
    StaffPrefix: "!!",
    GuildId: "1166212127044931718",
    StaffRole: "1166213537153167450",
    UpdatesChannel: "1166214000963506226",
    Intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessages],
    github_url: "https://github.com/vtuberwiki/Public-Bot",
    startupActivity: "Starting up...",
    Activities: [
        {
            name: "⭐ me on github!",
        },
        {
            name: "Make sure to check out the rules!",
        }
    ] as IActivity[],
    Emojis: {
        "Github": "<:githubblack:1181341718075949217>",
        "Info":  "<:5020info:1181343773456863253>",
        "Transgender_Heart": "<:5766transgendersparkleheart:1181343771842072698>",
        "Transgender_Flag": "🏳️‍⚧️",
    },
}

export default config;