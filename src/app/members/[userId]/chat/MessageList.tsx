"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { MessageDto } from "@/types";
import { pusherClient } from "@/lib/pusher-client";
import { formatShortDateTime } from "@/lib/util";
import { Channel } from "pusher-js";
import useMessageStore from "@/app/hooks/useMessageStore";

type Props = {
  initialMessages: {messages: MessageDto[], readCount: number};
  currentUserId: string;  
  chatId: string; 
}

export default function MessageList({initialMessages, currentUserId, chatId}: Props) {
  const [messages, setMessages] = useState<MessageDto[]>(initialMessages.messages);
  const chanelRef = useRef<Channel | null>(null);
  const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);
  const setReadCount = useRef(false)

  useEffect(() => {
    if (!setReadCount.current){
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  }, [initialMessages.readCount, updateUnreadCount])

  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages(prevMessages => [...prevMessages, message]); 
  }, []); 

  const handleRedMessage = useCallback((messageIds: string[]) => {
    setMessages(prevMessages => prevMessages.map(message => messageIds.includes(message.id) 
    ? {...message, dateRead: formatShortDateTime(new Date())} : message
      )
    );
  }, []);

  

  useEffect(() => {
    if (!chanelRef.current) {
      chanelRef.current = pusherClient.subscribe(chatId);
      chanelRef.current.bind('message:new', handleNewMessage);
      chanelRef.current.bind('message:read', handleRedMessage);
    }
    
    return () => {
      if(chanelRef.current && chanelRef.current.subscribed) {
        chanelRef.current.unsubscribe();
      //channel.unbind_all(); 
        chanelRef.current.unbind('message:new', handleNewMessage);
        chanelRef.current.unbind('message:read', handleRedMessage);
      }
     
    };
  }, [chatId, handleNewMessage, handleRedMessage]);
  

  return (
    <div>
      {messages.length === 0 ? "No messages to display" : (
        <div>
          {messages.map(message => (
            <MessageBox 
              key={message.id} 
              message={message} 
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}