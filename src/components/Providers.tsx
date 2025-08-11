"use client";

import { getUnreadMessageCount } from "@/app/actions/messageActions";
import useMessageStore from "@/app/hooks/useMessageStore";
import { useNotificationChannel } from "@/app/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/app/hooks/usePresenceChannel";
import { HeroUIProvider } from "@heroui/system";
import { ReactNode, useCallback, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



export default function Providers({children, userId}: { children: ReactNode, userId: string | null }) {
  const updateUnreadCount = useMessageStore(state => state.updateUnreadCount);

  const setUnreadCount = useCallback((amount: number) => {
    updateUnreadCount(amount);
  }, [updateUnreadCount]);

  useEffect(() => {
    if(userId) {
      getUnreadMessageCount().then(count => {
        setUnreadCount(count);
      })
    }
  }, [setUnreadCount, userId])
  
  usePresenceChannel();
  useNotificationChannel(userId);
  return (
    <HeroUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-50"/>
      {children}
    </HeroUIProvider>
  )
}