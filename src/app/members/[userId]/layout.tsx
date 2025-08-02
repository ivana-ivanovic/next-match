import { getMemrByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import MemberSidebar from "@/app/members/MemberSidebar";
import { Card } from "@heroui/card";

export default async function Layout({children , params}: {children: ReactNode, params:Promise<{userId: string}>}) {
  const {userId} = await params;
  const member = await getMemrByUserId(userId);
  if(!member) return notFound();
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <MemberSidebar member={member}/>
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
          {children}
        </Card>
      </div>
    </div>
  )
}