import { ActivityType } from "discord.js";

export enum GuildFeatures {
    "ANIMATED_BANNER" = "Guild has access to set an animated guild banner image",
    "ANIMATED_ICON" = "Guild has access to set an animated guild icon",
    "APPLICATION_COMMAND_PERMISSIONS_V2" = "Guild is using the old permissions configuration behavior",
    "AUTO_MODERATION" = "Guild has set up auto moderation rules",
    "BANNER" = "Guild has access to set a guild banner image",
    "COMMUNITY" = "Guild can enable welcome screen, Membership Screening, stage channels and discovery, and receives community updates",
    "CREATOR_MONETIZABLE_PROVISIONAL" = "Guild has enabled monetization",
    "CREATOR_STORE_PAGE" = "Guild has enabled the role subscription promo page",
    "DEVELOPER_SUPPORT_SERVER" = "Guild has been set as a support server on the App Directory",
    "DISCOVERABLE" = "Guild is able to be discovered in the directory",
    "FEATURABLE" = "Guild is able to be featured in the directory",
    "INVITES_DISABLED" = "Guild has paused invites, preventing new users from joining",
    "INVITE_SPLASH" = "Guild has access to set an invite splash background",
    "MEMBER_VERIFICATION_GATE_ENABLED" = "Guild has enabled Membership Screening",
    "MORE_STICKERS" = "Guild has increased custom sticker slots",
    "NEWS" = "Guild has access to create announcement channels",
    "PARTNERED" = "Guild is partnered",
    "PREVIEW_ENABLED" = "Guild can be previewed before joining via Membership Screening or the directory",
    "RAID_ALERTS_DISABLED" = "Guild has disabled alerts for join raids in the configured safety alerts channel",
    "ROLE_ICONS" = "Guild is able to set role icons",
    "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE" = "Guild has role subscriptions that can be purchased",
    "ROLE_SUBSCRIPTIONS_ENABLED" = "Guild has enabled role subscriptions",
    "TICKETED_EVENTS_ENABLED" = "Guild has enabled ticketed events",
    "VANITY_URL" = "Guild has access to set a vanity URL",
    "VERIFIED" = "Guild is verified",
    "VIP_REGIONS" = "Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)",
    "WELCOME_SCREEN_ENABLED" = "Guild has enabled the welcome screen",
    "CHANNEL_ICON_EMOJIS_GENERATED" = "Guild has access to automatic icon generation for channel names",
}

export function CalculateNSFWLevel(level: number) {
    switch (level) {
        case 0:
            return "None";
        case 1:
            return "Mild";
        case 2:
            return "Medium";
        case 3:
            return "High";
        default:
            return "Extreme";
    }
}


export function getActivityType(type: string): ActivityType | undefined {
    switch (type.toLowerCase()) {
        case 'playing':
            return ActivityType.Playing;
        case 'listening':
            return ActivityType.Listening;
        case 'watching':
            return ActivityType.Watching;
        case 'competing':
            return ActivityType.Competing;
        case 'custom':
            return ActivityType.Custom;
        default:
            return undefined;
    }
}