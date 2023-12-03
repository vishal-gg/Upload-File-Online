import React from 'react'
import Upload from './Upload'
import Gallery from './Gallery'
import {SiFirebase} from 'react-icons/si'
import { Toaster } from 'sonner';

const page = () => {
  return (
    <div>
        <h2 className='text-3xl font-semibold mt-5 text-center text-amber-500'><SiFirebase className="inline-block mb-2" /> Firebase</h2>
        <Upload />
        <Gallery />
        <Toaster richColors position='top-center' />
    </div>
  )
}

export default page
