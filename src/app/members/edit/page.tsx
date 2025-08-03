import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import EditForm from "./EditForm";
import { getAuthUserId } from "@/app/actions/authActions";
import { getMemrByUserId } from "@/app/actions/memberActions";
import { notFound } from "next/navigation";

export default async function MemberEditPage() {
  const userId = await getAuthUserId()
  const member = await getMemrByUserId(userId);
  if(!member) return notFound();
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Edit Profile
      </CardHeader>
      <Divider />
      <CardBody>
        <EditForm member={member}/>
      </CardBody>
    </>
  )
}