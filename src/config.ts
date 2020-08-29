import * as yup from "yup";

interface Config {
    PORT: number;
    DOMAIN_NAME: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    BEASTIE_USERNAME: string;
    BEASTIE_OAUTH: string;
    BROADCASTER_USERNAME: string;
    BROADCASTER_OAUTH: string;
    DATABASE_TEAMMATE_TABLE: string;
    DISCORD_GUILD_MASTER_USERNAME: string;
    DISCORD_GUILD_MASTER_ID: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_TOKEN: string;
    TWITCH_WEBHOOKS_SERVER_PORT: string;
    TWITCH_WEBHOOKS_SECRET: string;
    TWITTER_CONSUMER_KEY: string;
    TWITTER_CONSUMER_SECRET: string;
    TWITTER_ACCESS_TOKEN_KEY: string;
    TWITTER_ACCESS_TOKEN_SECRET: string;
    LOG_LEVEL: string;
    DISCORD_GUILD_NAME: string;
    DISCORD_WELCOME_CHANNEL: string;
    DISCORD_STREAM_ANNOUNCEMENTS_CHANNEL: string;
    DISCORD_FEED_CHANNEL: string;
    ENV_AWS_ACCESS_KEY_ID: string;
    ENV_AWS_SECRET_ACCESS_KEY: string;

    AWS_ENDPOINT: string;
}

const config = yup.object().shape({
    PORT: yup
        .number()
        .integer()
        .required(),
    DOMAIN_NAME: yup.string().required(),
    CLIENT_ID: yup.string().required(),
    CLIENT_SECRET: yup.string().required(),
    BEASTIE_USERNAME: yup.string().required(),
    BEASTIE_OAUTH: yup.string().required(),
    BROADCASTER_USERNAME: yup.string().required(),
    BROADCASTER_OAUTH: yup.string().required(),
    DATABASE_TEAMMATE_TABLE: yup.string().required(),
    DISCORD_GUILD_MASTER_USERNAME: yup.string().required(),
    DISCORD_GUILD_MASTER_ID: yup.string().required(),
    DISCORD_CLIENT_ID: yup.string().required(),
    DISCORD_CLIENT_SECRET: yup.string().required(),
    DISCORD_TOKEN: yup.string().required(),
    TWITCH_WEBHOOKS_SERVER_PORT: yup.string().required(),
    TWITCH_WEBHOOKS_SECRET: yup.string().required(),
    TWITTER_CONSUMER_KEY: yup.string(),
    TWITTER_CONSUMER_SECRET: yup.string(),
    TWITTER_ACCESS_TOKEN_KEY: yup.string(),
    TWITTER_ACCESS_TOKEN_SECRET: yup.string(),
    LOG_LEVEL: yup.string().required(),
    DISCORD_GUILD_NAME: yup.string().required(),
    DISCORD_WELCOME_CHANNEL: yup.string().required(),
    DISCORD_STREAM_ANNOUNCEMENTS_CHANNEL: yup.string().required(),
    DISCORD_FEED_CHANNEL: yup.string().required(),
    ENV_AWS_ACCESS_KEY_ID: yup.string().required(),
    ENV_AWS_SECRET_ACCESS_KEY: yup.string().required(),
    AWS_ENDPOINT: yup.string()
});

export default <Config>config.validateSync(process.env, { stripUnknown: true });
