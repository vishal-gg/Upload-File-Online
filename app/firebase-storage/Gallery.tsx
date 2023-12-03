'use client'

import { toast } from "sonner"
import { ref, deleteObject } from "firebase/storage"
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore"
import { storage, db } from "../lib/firebaseConfig"
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {MdDelete} from 'react-icons/md'
import Image from 'next/image'

const Gallery = () => {
  const queryClient = useQueryClient()

  const {data, isLoading, error} = useQuery({queryKey: ['imageList'], queryFn: async () => {
   try {

    const res = await getDocs(collection(db, 'gallery'))
    const filteredData = res.docs.map(doc => ({...doc.data(), id: doc.id})) as { id: string; url: string }[];
    return filteredData;

   } catch (err: any) {
    throw new Error(err)
   }
  },staleTime: 0})

  const handleDeleteImage = async (src: {url: string, id: string}) => {
    const imageName = decodeURIComponent(src.url).split("/").pop()!.split("?")[0]
    const imageRefToDelete = ref(storage, `gallery/${imageName}`)

    try {
      toast.loading("loading..")
      await deleteObject(imageRefToDelete)

      // delete image ref from database
      await deleteDoc(doc(db, 'gallery', src.id))
 
      // Invalidate the query to trigger a refetch of the image list
      queryClient.invalidateQueries({queryKey: ['imageList']})

      toast.success("Image deleted successfully")
    } catch (err: any) {
      toast.error("Error deleting the image: " + err)
    } finally { toast.dismiss() }
  }

  if(error) return <pre>{JSON.stringify(error, null, 2)}</pre>
  if(isLoading) return <div className="text-center">Loading...</div>

  return (
    <div className="w-[min(1300px,100%-4rem)] mx-auto flex justify-center gap-8 flex-wrap mt-10 mb-16">
      {data?.map((img: { id: string; url: string }) => (
        <div key={img.id} className="relative w-52 aspect-square">
          <Image src={img.url} alt="image" fill className="object-cover bg-zinc-800" />
          <button
            className="absolute bottom-0 right-0 z-10"
            onClick={() => handleDeleteImage(img)}
          >
            <MdDelete className="text-3xl hover:text-red-500 transition-colors" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Gallery
