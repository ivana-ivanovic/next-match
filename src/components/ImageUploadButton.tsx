"use client"

import {CldUploadButton, CloudinaryUploadWidgetResults} from "next-cloudinary"
import { HiPhoto } from "react-icons/hi2"

type Props = {
  onUploadImage: (recult: CloudinaryUploadWidgetResults) => void;
}

export default function ImageUploadButton({onUploadImage}: Props) {
  return (
    <CldUploadButton
      options={{maxFiles: 1}}
      onSuccess={onUploadImage}
      signatureEndpoint="/api/sign-image"
      uploadPreset="nm-demo"
      className= {`flex items-center gap-2 border-2 border-secondary text-secondary 
        rounded-lg py-2 px-2 hover:bg-secondary/70`}
    >
      <HiPhoto />
      Upload new photo
    </CldUploadButton>
  )
}