import Koa from "koa";
import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import axios from "axios";
import config from "../../config";
import { BeastieLogger } from "../../utils/Logging";
import { broadcaster } from "../twitch/TwitchAPI";
import { TWITCH_WEBHOOK } from "../../utils/values";

export default class TwitchWebhooksServer {
  server: Koa;
  router: KoaRouter;
  broadcasterId: string;

  constructor() {
    this.server = new Koa();
    this.router = new KoaRouter();

    this.server
      .use(bodyParser())
      .use(this.router.routes())
      .use(this.router.allowedMethods());

    this.router.get("/", this.confirmSubscription);

    this.router.post("/", ctx => {
      BeastieLogger.info("WEBHOOK NOTIFICATION");
      BeastieLogger.info(JSON.stringify(`CONTEXT: ${ctx}`));
      BeastieLogger.info(JSON.stringify(`CONTEXT REQUEST: ${ctx.request}`));
      BeastieLogger.info(
        JSON.stringify(`CONTEXT REQUEST BODY: ${ctx.request.body}`)
      );
      ctx.status = 200;

      // TODO: verify hub secret, https://dev.twitch.tv/docs/api/webhooks-guide#verifying-payloads
      // TODO: verify notification ID (no duplicate notifications/follows), https://dev.twitch.tv/docs/api/webhooks-guide#verifying-payloads
    });

    this.server.listen(8086, () =>
      BeastieLogger.info("TwitchWebhooksServer is listening...")
    );
  }

  private subscribeWebhook = async webhook => {
    const topicUrl = `https://api.twitch.tv/helix/${webhook.urlPath}${webhook.urlParams}`.replace(
      "BROADCASTER",
      this.broadcasterId
    );

    await axios
      .post(
        "https://api.twitch.tv/helix/webhooks/hub",
        {
          "hub.callback": "https://7490bb10b7b9.ngrok.io",
          "hub.mode": "subscribe",
          "hub.topic": topicUrl,
          "hub.lease_seconds": 864000,
          "hub.secret": "yolomuybuenomicasatucasamiamigas"
        },
        {
          headers: {
            "Client-ID": `${config.CLIENT_ID}`,
            Authorization: `Bearer ${config.BROADCASTER_OAUTH}`
          }
        }
      )
      .catch(reason =>
        BeastieLogger.warn(
          `subscribeTwitchWebhook, ${topicUrl} failed: ${reason}`
        )
      );
  };

  private subscribeTwitchWebhooks = () => {
    this.subscribeWebhook(TWITCH_WEBHOOK.STREAM_CHANGED);
    this.subscribeWebhook(TWITCH_WEBHOOK.USERS_FOLLOWS);
    //this.subscribeWebhook(TWITCH_WEBHOOK.SUBSCRIPTION_EVENTS);
    //this.subscribeWebhook(TWITCH_WEBHOOK.EXTENSION_TRANSACTION_CREATED);
    //this.subscribeWebhook(TWITCH_WEBHOOK.HYPE_TRAIN_EVENT);
  };

  public connect = async id => {
    this.broadcasterId = id;
    this.subscribeTwitchWebhooks();
  };

  public setSubscriptionTimer = (webhook, seconds) => {
    // TODO: Should/How should we keep track of these timers? How do 'NodeJS.Timeout's work after the time is up?
    setTimeout(() => this.subscribeWebhook, seconds * 1000, webhook);
  };

  public confirmSubscription = async ctx => {
    BeastieLogger.info(`CONFIRM SUBSCRIPTION: ${ctx.query[`hub.topic`]}`);
    const leaseSeconds = ctx.query.lease_seconds;
    const hubTopic = ctx.query[`hub.topic`].substr(28).replace(/%2F/gi, "/");

    if (
      hubTopic.substr(0, TWITCH_WEBHOOK.USERS_FOLLOWS.urlPath.length) ===
      TWITCH_WEBHOOK.USERS_FOLLOWS.urlPath
    ) {
      this.setSubscriptionTimer(TWITCH_WEBHOOK.USERS_FOLLOWS, leaseSeconds);
    } else if (
      hubTopic.substr(0, TWITCH_WEBHOOK.STREAM_CHANGED.urlPath.length) ===
      TWITCH_WEBHOOK.STREAM_CHANGED.urlPath
    )
      this.setSubscriptionTimer(TWITCH_WEBHOOK.STREAM_CHANGED, leaseSeconds);

    ctx.status = 200;
    ctx.type = "text/plain; charset=utf-8";
    ctx.body = ctx.query[`hub.challenge`];
  };
}

/*
  Beastie is always 'alive'

  onStart subscribe to webhooks
  save lease_seconds that are returned from Twitch
  start timer for lease_seconds
    resubscribe every (period of time) and when lease_seconds timer expires

  onNotification respond with 200
  check secret

  onShutdown unsubscribe from webhooks
*/

// export default class TwitchWebhooksServer {
//   server: TwitchWebhook;

//   constructor() {
//     this.server = new TwitchWebhook(twitchWebhookOptions);
//   }

//   private subscribeTwitchWebhooks = id => {
//     this.server
//       .subscribe("users/follows", {
//         first: 1,
//         to_id: id
//       })
//       .then(() => {
//         this.server
//           .subscribe("streams", {
//             user_id: id
//           })
//           .catch(reason => {
//             BeastieLogger.warn(`subscribeTwitchWebhooks failed: ${reason}`);
//           });
//       })
//       .catch(reason => {
//         BeastieLogger.warn(`subscribeTwitchWebhooks failed: ${reason}`);
//       });

//     // this.server.subscribe('subscriptions/events', {
//     //   broadcaster_id: id,
//     //   first: 1,
//     // })

//     // if subscription ends, resubscribe
//     this.server.on("unsubscribe", obj => {
//       this.server.subscribe(obj["hub.topic"]);
//     });

//     // unsubscribe from all when app stops
//     process.on("SIGINT", () => {
//       this.server
//         .unsubscribe("*")
//         .then(() => {
//           process.exit(0);
//         })
//         .catch(reason => {
//           BeastieLogger.warn(`Errored during SIGINT twitchWebhooks ${reason}`);
//           process.exit(0);
//         });
//     });
//   };

//   public connect = id => {
//     this.subscribeTwitchWebhooks(id);
//   };
// }
