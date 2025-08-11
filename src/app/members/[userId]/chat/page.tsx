import CardInnerWraper from "@/components/CardInnerWraper";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import { getAuthUserId } from "@/app/actions/authActions";
import MessageList from "./MessageList";
import { createChatId } from "@/lib/util";

export default async function ChatPage({params}
    : {params: Promise<{userId: string}>}) {
  const param = await params;
  const messages = await getMessageThread(param.userId)
  const currentUserId = await getAuthUserId();
  const chatId = createChatId(currentUserId, param.userId);
 
  return (
 <CardInnerWraper
       header='Chat'
       body={
        <MessageList 
          initialMessages={messages} 
          currentUserId={currentUserId}
          chatId= {chatId}
        />}
       footer={<ChatForm />}/>
  )
}