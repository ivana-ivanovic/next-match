import PusherClient from 'pusher-js';

// eslint-disable-next-line no-var
var pusherClientInstance: PusherClient | undefined;

if (!pusherClientInstance) {
  pusherClientInstance = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      channelAuthorization: {
        endpoint: '/api/pusher-auth',
        transport: 'ajax',
      },
      cluster: 'eu',
    }
  );
}


export const pusherClient = pusherClientInstance;
