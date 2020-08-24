import crypto from "crypto";
import { EventEmitter } from "events";
import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import axios from "axios";
import config from "../../config";
import { BeastieLogger } from "../../utils/Logging";
import { TWITCH_WEBHOOK } from "../../utils/values";

export default class TwitchWebhooksServer {
  emitter: EventEmitter;
  server: Koa;
  router: KoaRouter;
  broadcasterId: string;
  activeWebhooks: {
    name;
    apiPath;
    urlParams;
    callbackPath;
  }[];
  secretVerifier: any;

  private verifyNotification = (ctx, next) => {
    const expectedHash = ctx.req.headers["x-hub-signature"];
    const ourCalculatedHash = `sha256=${crypto
      .createHmac("sha256", config.TWITCH_WEBHOOKS_SECRET)
      .update(ctx.request.rawBody)
      .digest("hex")}`;

    ctx.request.verified = expectedHash === ourCalculatedHash;
    BeastieLogger.info(`ctx.request.verified: ${ctx.request.verified}`);

    next();
  };

  private STREAM_CHANGED = ctx => {
    BeastieLogger.info(
      `STREAM_CHANGED - CONTEXT.REQUEST.BODY: ${JSON.stringify(
        ctx.request.body
      )}`
    );
    ctx.status = 200;

    if (ctx.request.verified) {
      this.emitter.emit("stream changed", ctx.request.body);
    }
  };

  private USERS_FOLLOWS = ctx => {
    BeastieLogger.info(
      `USERS_FOLLOWS - CONTEXT.REQUEST.BODY: ${JSON.stringify(
        ctx.request.body
      )}`
    );
    ctx.status = 200;

    if (ctx.request.verified) {
      this.emitter.emit("users follows", ctx.request.body);
    }
  };

  constructor() {
    this.activeWebhooks = [
      TWITCH_WEBHOOK.STREAM_CHANGED,
      TWITCH_WEBHOOK.USERS_FOLLOWS
      //TWITCH_WEBHOOK.SUBSCRIPTION_EVENTS,
      //TWITCH_WEBHOOK.EXTENSION_TRANSACTION_CREATED,
      //TWITCH_WEBHOOK.HYPE_TRAIN_EVENT
    ];

    this.emitter = new EventEmitter();

    this.secretVerifier = crypto.createVerify("sha256");

    this.server = new Koa();
    this.router = new KoaRouter();

    this.router.get(`/`, ctx => {
      ctx.body = "rawr";
      console.log("rawr");
    });

    this.activeWebhooks.forEach(hook => {
      this.router.get(
        `${hook.callbackPath}${hook.apiPath}`,
        this.confirmWebhook
      );

      this.router.post(
        `${hook.callbackPath}${hook.apiPath}`,
        this.verifyNotification,
        this[`${hook.name}`]
      );
    });

    this.server
      .use(
        bodyParser({
          extendTypes: {
            json: ["application/json"]
          }
        })
      )
      .use(this.router.routes())
      .use(this.router.allowedMethods());

    this.server.listen(config.TWITCH_WEBHOOKS_SERVER_PORT, () =>
      BeastieLogger.info("TwitchWebhooksServer is listening...")
    );
  }

  private toggleTwitchWebhook = async (webhook, mode) => {
    const callback = `${config.DOMAIN_NAME}${webhook.callbackPath}${webhook.apiPath}`;
    const topicUrl = `https://api.twitch.tv/helix/${webhook.apiPath}${webhook.urlParams}`.replace(
      "BROADCASTER",
      this.broadcasterId
    );

    BeastieLogger.info(callback);
    await axios
      .post(
        "https://api.twitch.tv/helix/webhooks/hub",
        {
          "hub.callback": callback,
          "hub.mode": mode,
          "hub.topic": topicUrl,
          "hub.lease_seconds": 864000,
          "hub.secret": config.TWITCH_WEBHOOKS_SECRET
        },
        {
          headers: {
            "Client-ID": `${config.CLIENT_ID}`,
            Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
          }
        }
      )
      .catch(reason =>
        BeastieLogger.warn(`toggleTwitchWebhook, ${topicUrl} failed: ${reason}`)
      );
  };

  private onSIGINT = async () => {
    BeastieLogger.info(`calling onSIGINT from twitchWebhooks`);
    this.activeWebhooks.forEach(hook =>
      this.toggleTwitchWebhook(hook, "unsubscribe")
    );
  };

  public connect = async id => {
    this.broadcasterId = id;
    await this.activeWebhooks.forEach(hook => {
      this.toggleTwitchWebhook(hook, "subscribe");
    });
    this.getActiveWebhooks();
  };

  public destroy = async () => {
    BeastieLogger.info("SHUTTING DOWN TWITCH WEBHOOKS ON SIGINT");
    await this.onSIGINT();
  };

  public setSubscriptionTimer = (webhook, seconds) => {
    BeastieLogger.info(`SUBSCRIPTION TIMER - ${webhook.name}`);
    setTimeout(this.toggleTwitchWebhook, seconds * 1000, webhook, "subscribe");
    // TODO: Should/How should we keep track of these timers? How do 'NodeJS.Timeout's work after the time is up?
  };

  public confirmWebhook = async ctx => {
    BeastieLogger.info(
      `CONFIRM Webhook - hub.mode: [${ctx.query[`hub.mode`]}], hub.topic: [${
        ctx.query[`hub.topic`]
      }]`
    );
    const hubTopic = ctx.query[`hub.topic`].substr(28).replace(/%2F/gi, "/");

    if (ctx.query[`hub.mode`] === "subscribe") {
      const leaseSeconds = ctx.query[`hub.lease_seconds`];
      this.activeWebhooks.forEach(hook => {
        if (hubTopic.substr(0, hook.apiPath.length) === hook.apiPath) {
          this.setSubscriptionTimer(hook, leaseSeconds);
        }
      });
    }

    ctx.status = 200;
    ctx.type = "text/plain; charset=utf-8";
    ctx.body = ctx.query[`hub.challenge`];
  };

  public getActiveWebhooks = async () => {
    const subscriptions = await axios
      .get("https://api.twitch.tv/helix/webhooks/subscriptions?first=100", {
        headers: {
          "Client-ID": `${config.CLIENT_ID}`,
          Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
        }
      })
      .catch(reason =>
        BeastieLogger.warn(
          `getWebhooksSubs, https://api.twitch.tv/helix/webhooks/subscriptions failed: ${reason}`
        )
      );

    BeastieLogger.info(`WEBHOOK COUNT - ${subscriptions.data.data.length}`);
    await subscriptions.data.data.forEach(item => {
      BeastieLogger.info(JSON.stringify(item));
    });
  };
}
