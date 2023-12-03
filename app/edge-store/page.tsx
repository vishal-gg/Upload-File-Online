import { MultiFileDropzoneUsage } from "./MultiFileDropzoneUsage"
import { SingleImageDropzone } from "./SingleImageDropzone"
import { SingleImageDropzoneUsage } from "./SingleImageDropzoneUsage"

const page = () => {
  return (
    <div>
      <SingleImageDropzoneUsage />
      <MultiFileDropzoneUsage />
    </div>
  )
}

export default page
