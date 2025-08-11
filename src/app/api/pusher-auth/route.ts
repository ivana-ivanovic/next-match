import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher-server";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const session = await auth();

    if(!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.formData();

    const socketId = body.get('socket_id') as string;
    const channel = body.get('channel_name') as string;
    const data = {
      user_id: session.user.id as string,
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data); 

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher Auth Error:', error);
    return new Response('Something went wrong', { status: 500 });
  }
}