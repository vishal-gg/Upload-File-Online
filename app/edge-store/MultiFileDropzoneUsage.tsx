"use client";

import { MultiFileDropzone, type FileState } from "./MultiFileDropzone";
import { useEdgeStore } from "../lib/edgeStoreProvider";
import { useState } from "react";

export function MultiFileDropzoneUsage() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <div className="flex-1">
      <h1 className="text-center font-semibold text-xl mb-5">
        Multiple Images DropZone
      </h1>
      <div className="flex flex-col gap-2 items-center">
        <MultiFileDropzone
          value={fileStates}
          onChange={(files) => {
            setFileStates(files);
          }}
          onFilesAdded={async (addedFiles) => {
            setFileStates([...fileStates, ...addedFiles])
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  const res = await edgestore.publicFiles.upload({
                    file: addedFileState.file,
                    onProgressChange: async (progress) => {
                      updateFileProgress(addedFileState.key, progress);
                      if (progress === 100) {
                        // wait 1 second to set it to complete
                        // so that the user can see the progress bar at 100%
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000)
                        )
                        updateFileProgress(addedFileState.key, "COMPLETE")
                      }
                    }
                  })
                  console.log(res);
                  setUploadedUrls((prev) => [...prev, res.url]);
                } catch (err) {
                  updateFileProgress(addedFileState.key, "ERROR");
                }
              })
            )
          }}
        />
      </div>
      <div className="flex flex-col gap-3 items-center my-5">
        {uploadedUrls.length > 0 &&
          uploadedUrls.map((url, index: number) => (
            <a key={index} className="text-xs cursor-pointer" href={url} target="_blank">
              {url}
            </a>
          ))}
      </div>
    </div>
  )
}
