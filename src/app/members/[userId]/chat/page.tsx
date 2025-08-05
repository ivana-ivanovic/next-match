import CardInnerWraper from "@/components/CardInnerWraper";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/app/actions/messageActions";
import MessageBox from "./MessageBox";
import { getAuthUserId } from "@/app/actions/authActions";

export default async function ChatPage({params}
    : {params: Promise<{userId: string}>}) {
  const param = await params;
  const messages = await getMessageThread(param.userId)
  const currentUserId = await getAuthUserId();
  const body = (
    <div>
      {messages.length === 0 ? "No messages to display" : (
        <div>
          {messages.map(message => (
            <MessageBox key={message.id} message={message} currentUserId={currentUserId}/>
          ))}
        </div>
      )}
    </div>
  )
  return (
 <CardInnerWraper
       header='Chat'
       body={body}
       footer={<ChatForm />}/>
  )
}