import PusherServer  from 'pusher';


declare global {
  var pusherServerInstance: PusherServer | undefined;
}


if (!global.pusherServerInstance) {
  global.pusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'eu',
    useTLS: true, //Transport Layer Security basycly means SSL
  });
}

export const pusherServer = global.pusherServerInstance;