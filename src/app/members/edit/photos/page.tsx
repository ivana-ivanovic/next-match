import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberPhotosByUserId, getMemrByUserId } from "@/app/actions/memberActions";
import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import MemberPhotoUpload from "./MemberPhotoUpload";
import MemberPhotos from "@/components/MemberPhotos";


export default async function PhotosPage() {
  const userId = await getAuthUserId();
  const photos = await getMemberPhotosByUserId(userId);
  const member = await getMemrByUserId(userId);

  return (
    <>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="text-2xl font-semibold text-secondary">
            Edit Profile
        </div>
        <MemberPhotoUpload/>
      </CardHeader>
      <Divider />
      <CardBody>
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      </CardBody>
    </>
  )
}