import { GatewayIntentBits } from 'discord.js';

interface IActivity {
    name: string;
}

/**
 * The interface for the config file
 * @interface IConfig
 */

interface IConfig {
    StaffPrefix: string;
    github_url: string;
    UpdatesChannel: string;
    GuildId: string;
    StaffRole: string;
    Intents: GatewayIntentBits[];
    startupActivity: string;
    Activities: IActivity[];
    Emojis: {
        [key: string]: string;
    };
}

export {
    IConfig,
    IActivity
}
