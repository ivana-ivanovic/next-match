import { MessageDto } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, Key, useEffect, useRef } from "react";
import { deleteMessage, getMessagesByContainer } from "../actions/messageActions";
import useMessageStore from "./useMessageStore";
import { useShallow } from "zustand/shallow";

export const useMessages = (initialMessages: MessageDto[], nextCursor?: string) => {
  const cursorRef = useRef(nextCursor);
  const {set, remove, messages, updateUnreadCount, resetMessages} = useMessageStore(
    useShallow(
      state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages
      })
    )
  )
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox =searchParams.get('container') === 'outbox';
  const container = searchParams.get('container'); 
  const [isDeleting, setDeleting] = useState({id: '', loading: false});
  const [loadingMore, setLoadingMore] = useState(false);
  const columns = [
    {key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
    {key: 'text', label: 'Message'},
    {key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
    {key: 'actions', label: 'Actions'}
  ];

  useEffect(() => {
    set(initialMessages);
    cursorRef.current = nextCursor;

    return () => {
      resetMessages()
    }
  }, [initialMessages, set, resetMessages, nextCursor]);

  const loadMore = useCallback(async () => {
    if(cursorRef.current){
      setLoadingMore(true);
      const {messages, nextCursor} = await getMessagesByContainer(container, cursorRef.current);
      set(messages);
      cursorRef.current = nextCursor;
      setLoadingMore(false);
    }
  }, [container, set]);
  

  const handleDeleteMessage = useCallback( async (message: MessageDto) => {
    setDeleting({id: message.id , loading: true});
    await deleteMessage(message.id, isOutbox);
    remove(message.id);
    if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
    setDeleting({id: '', loading: false})
  }, [isOutbox, remove, updateUnreadCount])

  const handleRowSelected = (key: Key) => {
    const message = initialMessages.find(m => m.id === key);
    const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
    router.push(url + '/chat');
  }

  return {
    isOutbox, 
    columns, 
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelected,
    isDeleting,
    messages,
    loadMore,
    loadingMore,
    hasMore: !!cursorRef.current
  }

}