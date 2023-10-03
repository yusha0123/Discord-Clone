"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import { imageExtensions } from "@/lib/utils";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface props {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload = ({ onChange, value, endpoint }: props) => {
  const fileExtension = value ? value.split(".").pop()?.toLowerCase() : "";

  if (!value) {
    return (
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => console.log(error)}
      />
    );
  }

  const isImage = imageExtensions.includes(fileExtension!);

  if (isImage) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="upload" className="rounded-full" />
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
      <FileIcon className="h-20 w-20 fill-indigo-200 stroke-indigo-400" />
      <button
        onClick={() => onChange("")}
        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FileUpload;
