import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { set } from "date-fns";
import { Button } from "./ui/button";
import { CloudUploadIcon, ImageIcon } from "lucide-react";

type TFile = File & { preview: string };

export default function FileUpload() {
  const [file, setFile] = React.useState<TFile | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles) {
      setFile({
        ...acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: false,
    onDrop,
  });

  console.log("file:", file);
  return (
    <div className="h-48 p-4 pt-0 sm:p-6 sm:pt-0">
      <div className="h-full rounded-lg border border-dashed">
        {!file && (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "drag-active" : ""} flex h-full w-full flex-col items-center justify-center`}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon
              className="mx-auto size-12 text-slate-400"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to upload
            </p>
          </div>
        )}
        {file && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <img
              src={file.preview}
              className="mx-auto h-24 w-full object-contain sm:h-24 "
            />
            <div className="mx-auto flex gap-4">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={async (e) => {
                  e.preventDefault();
                  setFile(null);
                }}
              >
                Cancel
              </Button>

              <Button type="button" size="sm">
                Upload
              </Button>
            </div>
          </div>
        )}
        {/* {files.length > 0 && (
          <div className="mx-auto flex gap-4">
            <Button
              variant="outline"
              type="button"
              size="sm"
              onClick={() => setFiles([])}
            >
              Cancel
            </Button>
            <Button type="button" size="sm">
              Upload
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}
