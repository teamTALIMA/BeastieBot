// Beastie Faces (Emotes)
export const beastieFaceTwitchEmotes = [
    "OhMyDog",
    "OhMyDog",
    "OhMyDog",
    "OhMyDog",
    "OhMyDog",
    ":)",
    ":D",
    ";P",
    "BloodTrail",
    "CoolCat",
    "OSFrog",
    "SeriousSloth",
    "KomodoHype",
    "RaccAttack",
    "SSSsss",
    "teamta1RAWR"
];

export const beastieFaceDiscordEmotes = [
    ":smiling_imp:",
    ":smiling_imp:",
    ":smiling_imp:",
    ":alien:",
    ":smiley_cat:",
    ":smirk_cat:",
    ":dog:",
    ":fox:",
    ":bear:",
    ":koala:",
    ":tiger:",
    ":eagle:",
    ":wolf:",
    ":wolf:",
    ":wolf:",
    ":t_rex:",
    ":crocodile:",
    ":shark:",
    ":rhino:",
    ":raccoon:",
    ":dragon:",
    ":dragon:",
    ":dragon:",
    ":dragon:",
    ":dragon_face:",
    ":dragon_face:",
    ":dragon_face:",
    ":dragon_face:",
    ":wave:",
    ":wave:",
    "<:talSalute:287925661350494210>",
    "<:talSalute:287925661350494210>",
    "<:teamta1RAWR:704871701992702013>",
    "<:teamta1RAWR:704871701992702013>",
    "<:teamta1RAWR:704871701992702013>",
    "<:teamta1RAWR:704871701992702013>"
];

// Beastie Connect and Disconnect
export const beastieConnectMessage = `Hello team! I have awoken :D rawr`;
export const beastieDisconnectMessage = `Goodbye team :) rawr`;

// Social Post Events
export enum POST_EVENT {
    "NONE",
    "TWITTER_LIVE",
    "DISCORD_LIVE",
    "DISCORD_MEMBER_ADD",
    "TWITCH_NEW_SUB",
    "TWITCH_NEW_FOLLOW",
    "TWITCH_HOSTING",
    "END_OF_STREAM"
}

// Twitch Webhooks
export const TWITCH_WEBHOOK = {
    STREAM_CHANGED: {
        name: "STREAM_CHANGED",
        apiPath: "streams",
        urlParams: "?user_id=BROADCASTER",
        callbackPath: `/twitch-webhook/`
    },
    USERS_FOLLOWS: {
        name: "USERS_FOLLOWS",
        apiPath: "users/follows",
        urlParams: "?first=1&to_id=BROADCASTER",
        callbackPath: `/twitch-webhook/`
    },
    SUBSCRIPTION_EVENTS: {
        name: "SUBSCRIPTION_EVENTS",
        apiPath: "subscriptions/events",
        urlParams: "?broadcaster_id=BROADCASTER&first=1",
        callbackPath: `/twitch-webhook/`
    },
    EXTENSION_TRANSACTION_CREATED: {
        name: "EXTENSION_TRANSACTION_CREATED",
        apiPath: "extensions/transactions",
        urlParams: "?extension_id=BROADCASTER&first=1",
        callbackPath: `/twitch-webhook/`
    },
    HYPE_TRAIN_EVENT: {
        name: "HYPE_TRAIN_EVENT",
        apiPath: "hypetrain/events",
        urlParams: "?broadcaster_id=BROADCASTER&first=1",
        callbackPath: `/twitch-webhook/`
    },
    USER_CHANGED: {
        name: "USER_CHANGED",
        apiPath: "users",
        urlParams: "?id=1234",
        callbackPath: `/twitch-webhook/`
    },
    MODERATOR_CHANGE_EVENTS: {
        name: "MODERATOR_CHANGE_EVENTS",
        apiPath: "moderation/moderators/events",
        urlParams: "?broadcaster_id=BROADCASTERfirst=1",
        callbackPath: `/twitch-webhook/`
    },
    CHANNEL_BAN_CHANGE_EVENTS: {
        name: "CHANNEL_BAN_CHANGE_EVENTS",
        apiPath: "moderation/banned/events",
        urlParams: "?broadcaster_id=BROADCASTERfirst=1",
        callbackPath: `/twitch-webhook/`
    }
};

// Twitch Intervals Feature
export const awesomenessInterval = 1000 * 60 * 5; // KEEP MILLISECONDS, used by database
export const awesomenessIntervalAmount = 5;

export const discordInterval = 1000 * 60 * 20;
export const discordIntervalMessage = `Hey team! Make sure you don't miss out on joining our Discord guild! Talima hosts voice chats and we organize dev projects on Discord! https://discord.gg/eZtrhh7`;

export const patreonInterval = 1000 * 60 * 60;
export const patreonIntervalMessage = `bleedPurple Talima has a Patreon! Your support unlocks special rewards, and enables us to live stream our projects full time. Support Talima on Patreon => https://patreon.com/TalimaVale bleedPurple Thank you!`;

export const subscribeInterval = 1000 * 60 * 60;
export const subscribeIntervalMessage = `twitchRaid We are applying for Twitch partnership! Your viewership and subscriber support means so much, especially now. Subscribe today to join the Beastie Sub Team! => https://www.twitch.tv/subs/teamTALIMA twitchRaid`;

// Raid Feature
export const raidTimer = 1000 * 60;
export const raidMessage = ` RAWR twitchRaid RAWR twitchRaid RAWR twitchRaid RAWR twitchRaid`;

export const startRaidMessage = `Time to raid! Join the raid team with !joinraid to receive bonus awesomeness in our channel at the end of the raid!`;
export const joinRaidTeamSuccessWhisper = `You have successfully joined the raid team!`;
export const joinRaidTeamFailWhisper = `We are not raiding right now. There is no active raid team. :)`;
export const activeRaidMessage = target =>
    `Our Raid Has Begun! Hurry raid team! Join ${target}'s channel and post the raid message!`;
export const hostedChannelGreeting = viewers =>
    `Hello Friend! I am BeastieBot and you are being raided by myself and ${viewers} teammates of teamTALIMA! RAWR`;
export const hostedChannelGoodbye = `Goodbye Friend! I must go home now. Hope you have an awesome stream! :)`;
export const endRaidMessage = `The raid is over! Great raid team, and thanks for participating today! Here's our raid reward! :D`;
