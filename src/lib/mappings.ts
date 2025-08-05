import { formatShortDateTime } from "./util";
import { MessageWithSenderRecipiant } from "@/types";

export function mapMessageToMessageDto(message: MessageWithSenderRecipiant){
   return {
    id: message.id,
    text: message.text,
    created: formatShortDateTime(message.created),
    dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
    senderId: message.sender?.userId,
    senderName: message.sender?.name,
    senderImage: message.sender?.image,
    recipientId: message.recipient?.userId,
    recipientName: message.recipient?.name,
    recipientImage: message.recipient?.image,
   }
}