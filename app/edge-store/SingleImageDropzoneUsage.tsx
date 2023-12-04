"use client";

import { SingleImageDropzone } from "./SingleImageDropzone";
import { useEdgeStore } from "../lib/edgeStoreProvider";
import { useState } from "react";
import { toast } from "sonner";
import { MdDelete } from "react-icons/md";
import { getDownloadUrl } from "@edgestore/react/utils";
import { IoMdCloudDownload } from "react-icons/io";

export function SingleImageDropzoneUsage() {
  const [file, setFile] = useState<File | null>();
  const { edgestore } = useEdgeStore();
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentlyUploadedImage, setCurrentlyUploadImage] = useState<string[]>(
    []
  );

  const handleFileUpload = async () => {
    if (!file) return toast.warning("select a file");

    try {
      setLoading(true);
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
        options: { temporary: true },
      });
      toast.success("file uploaded successfully");
      setCurrentlyUploadImage((prev) => [...prev, res.url]);
      setFile(null);
      console.log(res);
    } catch (error: any) {
      setError(error.message || "something went wrong");
    } finally {
      setUploadProgress(0);
      setLoading(false);
    }
  };

  const handleDeleteImage = async (src: string) => {
    try {
      toast.loading("Deleting...");
      await edgestore.publicFiles.delete({
        url: src,
      });
      toast.success("deleted successfully");
      setCurrentlyUploadImage((prev) => prev.filter((url) => url !== src));
    } catch (err: any) {
      toast.error(err.message || "something went wrong");
    } finally {
      toast.dismiss();
    }
  };

  const handleDownloadImage = async (url: string) => {
    try {
      const downloadUrl = getDownloadUrl(url, "overwrite-file-name.jpg");
      window.open(downloadUrl, "_blank");
    } catch (error: any) {
      console.error("Error getting download URL:", error);
      toast.error(error.message || "Error getting download URL");
    }
  };

  return (
    <div className="flex-1">
      <h1 className="text-center font-semibold text-xl mb-5">
        Single Image DropZone
      </h1>
      <div className="flex flex-col gap-2 items-center">
        <SingleImageDropzone
          width={200}
          height={200}
          value={file}
          onChange={(file) => {
            setFile(file);
            setError(null);
          }}
        />
        <div>
          {loading && (
            <div className="border border-white rounded-xl h-2 w-52 mb-3 mx-auto">
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  backgroundColor: "white",
                  transition: file ? "width 200ms ease" : "",
                }}
              ></div>
            </div>
          )}
          {file && !error ? (
            <div className="text-center mb-5">
              <button
                disabled={loading}
                className={`mx-auto outline-none border-none py-1 px-3 text-sm rounded cursor-pointer w-fit bg-blue-500 hover:bg-blue-600 transition-colors ${
                  loading && "opacity-50 pointer-events-none"
                }`}
                onClick={handleFileUpload}
              >
                {loading && uploadProgress == 0
                  ? "Loading..."
                  : uploadProgress > 0
                  ? "Uploading..."
                  : "Upload"}
              </button>
            </div>
          ) : (
            <div className="text-center text-sm mt-5">{error}</div>
          )}
          <div className="flex gap-5 justify-center flex-wrap">
            {currentlyUploadedImage.length > 0 &&
              currentlyUploadedImage.map((src, index: number) => (
                <div key={index}>
                  <div className="rounded-lg overflow-hidden w-32 aspect-square relative">
                    <img
                      src={src}
                      alt="image"
                      width={200}
                      className="h-full w-full object-cover bg-zinc-800"
                    />
                  </div>
                  <div className="mt-1 w-32 flex justify-center gap-3">
                    <button onClick={() => handleDeleteImage(src)}>
                      <MdDelete className="text-2xl inline-block bg-zinc-800 rounded-sm" />
                    </button>
                    <button onClick={() => handleDownloadImage(src)}>
                      <IoMdCloudDownload className="text-2xl inline-block bg-zinc-800 rounded-sm" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
