"use client"
import { useState, useCallback } from "react";
import { storage, db } from "../lib/firebaseConfig";
import {ref, getDownloadURL, uploadBytesResumable} from "firebase/storage";
import {addDoc, collection} from 'firebase/firestore'
import { toast } from "sonner";
import {useQueryClient} from '@tanstack/react-query'
import {useDropzone} from 'react-dropzone'
import { FaPlus, FaImage } from 'react-icons/fa6';
import { formatFileSize } from "../utils/formatFileSize";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadImageAction, setUploadImageAction] = useState<any>(null)

  const queryClient = useQueryClient()

  const handleImageUpload = async () => {
    if (!image) return toast.error("choose an Image")

    try {
      setLoading(true);
      const storageRef = ref(storage, `gallery/${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)

      uploadTask.on("state_changed", ({ bytesTransferred, totalBytes }) => {
        setUploadProgress(Math.floor((bytesTransferred / totalBytes) * 100))
      })
      // to cancel the uploading process later
      setUploadImageAction(uploadTask)

      await uploadTask;
      const url = await getDownloadURL(uploadTask.snapshot.ref)
      
      // saving image ref to database
      await addDoc(collection(db, 'gallery'), {url})
      
      toast.success('uploaded successfully')
      queryClient.invalidateQueries({queryKey: ['imageList']})
      
    } catch (err: any) {
      if (err.code === "storage/canceled") {
        toast.warning("upload cancelled!", {duration: 2000})
      } else {
        toast.error("something went wrong! check console for details", {
          duration: 3000,
        })
      }
      console.log(err)
    } finally {
      setUploadProgress(0)
      setLoading(false)
      setImage(null);
    }
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    if(acceptedFiles.length > 1) {
      toast.error('limit exceeded! 1 is the limit')
      setImage(null)
    } else {
      setImage(acceptedFiles[0])
    }
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="flex flex-col gap-6 items-center pt-16">
      <div
        data-active={isDragActive && "true"}
        {...getRootProps()}
        className={`outline-4 outline-dotted outline-offset-4 bg-zinc-800 ${
          isDragActive && "bg-zinc-900 outline-green-500"
        } w-[500px] h-64 rounded-2xl text-center flex flex-col justify-center items-center cursor-pointer transition-colors`}
      >
        <span className="inline-block w-36 aspect-square rounded-full mx-auto">
          {image ? (
            <FaImage className="grid place-content-center w-full h-full object-contain" />
          ) : (
            <FaPlus className="grid place-content-center w-full h-full object-contain" />
          )}
        </span>
        <input {...getInputProps()} />
        {!image ? (
          isDragActive ? (
            <span>Drop the file here ...</span>
          ) : (
            <span>Click or Drag & Drop</span>
          )
        ) : loading ? (
          <div className="w-[80%] h-6 rounded-[2rem] mx-auto mt-2 bg-gray-100 relative overflow-hidden grid place-content-center text-black font-bold text-sm">
            <p className="relative z-10">{uploadProgress}%</p>
            <span
              className="absolute bg-green-500 inset-0 scale-x-0 origin-left transition-transform overflow-hidden uploadProgressWithFirebase"
              style={{ transform: `scaleX(${uploadProgress * 0.01})` }}
            ></span>
          </div>
        ) : (
          <>
            <span style={{ color: "#ec2e58" }}>{image && image.name}</span>
            <span style={{ fontSize: "12px", marginTop: "5px" }}>
              {image && formatFileSize(image.size)}
            </span>
          </>
        )}
      </div>
      {!loading ? (
        <button
          style={{
            opacity: image && !loading ? "100" : "0",
            pointerEvents: image && !loading ? "initial" : "none",
          }}
          className="outline-none border-none py-2 px-6 rounded-md cursor-pointer w-fit bg-blue-500 hover:bg-blue-600 transition-colors"
          onClick={handleImageUpload}
        >
          upload
        </button>
      ) : (
        <button
          style={{
            opacity: image && loading ? "100" : "0",
            pointerEvents: image && loading ? "initial" : "none",
          }}
          className="outline-none border-none py-2 px-6 rounded-md cursor-pointer w-fit bg-red-600 hover:bg-red-700 transition-colors"
          onClick={() => uploadImageAction.cancel()}
        >
          cancel
        </button>
      )}
    </div>
  )
}

export default Upload;
