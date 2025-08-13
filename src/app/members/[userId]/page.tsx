import { getMemrByUserId } from "@/app/actions/memberActions"
import CardInnerWraper from "@/components/CardInnerWraper";
import { notFound } from "next/navigation";




export default async function MemberDetailedPage({params}
    : {params: Promise<{userId: string}>}) {
  const {userId} = await params;
  
  const member = await getMemrByUserId(userId);

  if(!member) return notFound();

  return (
    <CardInnerWraper 
      header='Profil' 
      body={<div>{member.description}</div>}/>
  )
}