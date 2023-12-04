import { MultiFileDropzoneUsage } from "./MultiFileDropzoneUsage"
import { SingleImageDropzoneUsage } from "./SingleImageDropzoneUsage"
import { RiBox3Fill } from "react-icons/ri";
import {Toaster} from 'sonner'

const page = () => {
  return (
    <div>
        <h2 className='text-3xl font-semibold mt-5 text-center text-purple-600'><RiBox3Fill className="inline-block mb-2" /> Edge Store</h2>
      <div className="flex lg:flex-row flex-col justify-center lg:gap-5 gap-16 w-[min(1300px,100%-2rem)] mx-auto mt-5">
        <SingleImageDropzoneUsage />
        <MultiFileDropzoneUsage />
      </div>
      <Toaster richColors position='top-center' />
    </div>
  )
}

export default page
