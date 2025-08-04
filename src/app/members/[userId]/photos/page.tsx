import { getMemberPhotosByUserId, getMemrByUserId } from "@/app/actions/memberActions";
import MemberPhotos from "@/components/MemberPhotos";
import { CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";

export default async function PhotosPage({params}
    : {params: Promise<{userId: string}>}) {
  const {userId} = await params;
  const photos = await getMemberPhotosByUserId(userId);
  const member = await getMemrByUserId(userId);
  return (
    <>
      <CardHeader className="text-2xl font-semibold text-secondary">
        Photos
      </CardHeader>
      <Divider />
      <CardBody>
        <MemberPhotos photos={photos} editing={false} mainImageUrl={member?.image} />
        {/* <div className="grid grid-col-5 gap-3">
          {photos && photos.map(photo => (
            <div key={photo.id}>
              <Image 
                width={300}
                src={photo.url}
                alt="Image of member"
                className="object-cover aspect-square"
              />
            </div>
          ))}
        </div> */}
      </CardBody>
    </>
  )
}