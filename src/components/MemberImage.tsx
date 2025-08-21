"use client"

import { useRole } from "@/app/hooks/useRole";
import { Photo } from "@/generated/prisma";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import {ImCheckmark, ImCross} from "react-icons/im"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { approvePhoto, rejectPhoto } from "@/app/actions/adminActions";
import { useDisclosure } from "@heroui/react";
import AppModal from "./AppModal";

type Props = {
  photo: Photo | null
}

export default function MemberImage({photo} : Props) {
  const role = useRole();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const router = useRouter();

  if(!photo) return null;

  const approve = async (photoId: string) => {
    try {
      await approvePhoto(photoId);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  const reject = async (photo: Photo) => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="cursor-pointer" >
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="faces"
          className={clsx("rounded-2xl", {
            'opacity-40': !photo.isApproved && role !== 'ADMIN'
          })}
          priority
          onClick={onOpen}
        />
      ): (
        <Image
          width={220}
          src={photo?.url || "/images/user.png"}
          alt="Image of user"
          onClick={onOpen}
        />
      )}
      {!photo?.isApproved && role !== 'ADMIN' &&(
        <div className="absolute bottom-2 w-full bg-slate-200 p-1">
          <div className="flex justify-center text-danger font-semibold">
            Awaiting approval
          </div>
        </div>
      )}
      {role === 'ADMIN' && (
        <div className="flex flex-row gap-2 mt-2">
          <Button onPress={() => approve(photo.id)} color='success' variant="bordered" fullWidth>
            <ImCheckmark size={20} />
          </Button>
          <Button onPress={() => reject(photo)} color='danger' variant="bordered" fullWidth>
            <ImCross size={20} />
          </Button>
        </div>
      )}
      <AppModal 
        imageModal={true}
        isOpen={isOpen}
        onClose={onClose}
        body={
          <>
            {photo?.publicId ? (
              <CldImage
                alt="Image of member"
                src={photo.publicId}
                width={750}
                height={750}
                className={clsx("rounded-2xl", {
                  'opacity-40': !photo.isApproved && role !== 'ADMIN'
                })}
                priority
              />
            ): (
              <Image
                width={750}
                src={photo?.url || "/images/user.png"}
                alt="Image of user"
              />
            )}
          </>
        }
      />
    </div>
  )
}