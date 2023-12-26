import { GatewayIntentBits } from "discord.js";

import { IConfig, IActivity } from "./interfaces/IConfig";

const config: IConfig = {
    StaffPrefix: "!!",
    GuildIds: {
        production: null,
        development: "1010372303911129088"
    },
    StaffRole: "1166213537153167450",
    UpdatesChannel: "1166214000963506226",
    Intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMessages],
    github_url: "https://github.com/vtuberwiki/Public-Bot",
    startupActivity: "Starting up...",
    Activities: [
        {
            name: "⭐ me on github!",
            type: "LISTENING"
        },
        {
            name: "How do we change this?...HELP!",
            type: "WATCHING"
        },
        {
            name: "cat videos on YouTube",
            type: "WATCHING"
        },
        {
            name: "404: Status not found",
            type: "LISTENING"
        },
        {
            name: "Currently outsmarting CAPTCHAs",
            type: "PLAYING"
        },
        {
            name: "Dancing like no one's watching (because no one is)",
            type: "LISTENING"
        },
        {
            name: "Trying to catch up with my backlog of memes",
            type: "WATCHING"
        },
        {
            name: "In a committed relationship with coffee",
            type: "LISTENING"
        }
    ] as IActivity[],
    Emojis: {
        "Github": "<:githubblack:1181341718075949217>",
        "Info": "<:5020info:1181343773456863253>",
        "Transgender_Heart": "<:5766transgendersparkleheart:1181343771842072698>",
        "Transgender_Flag": "🏳️‍⚧️",
    },
}

export default config;