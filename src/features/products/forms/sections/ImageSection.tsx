import { useState, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUpload, FileUploadDropzone, FileUploadTrigger, FileUploadList, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from "@/components/ui/file-upload";
import type { FormValues } from "../../schemas";

function createFileValidator(options: { maxFiles: number; maxSizeMB?: number; allowedTypes?: string[] }) {
  return (file: File, currentFiles: File[]) => {
    if (currentFiles.length >= options.maxFiles) return `مسموح بـ ${options.maxFiles} ملفات فقط`;
    if (options.allowedTypes && !options.allowedTypes.some((type) => file.type.startsWith(type))) return "نوع الملف غير مدعوم";
    const maxSize = (options.maxSizeMB || 200) * 1024 * 1024;
    if (file.size > maxSize) return `حجم الملف يجب أن يكون أقل من ${options.maxSizeMB || 2}MB`;
    return null;
  };
}

export function ImageSection() {
  const { control } = useFormContext<FormValues>();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const validateFile = useMemo(
    () =>
      createFileValidator({
        maxFiles: 1,
        maxSizeMB: 100,
        allowedTypes: ["image/"],
      }),
    [],
  );

  return (
    <div className="col-span-2">
      <Controller
        name="Image"
        control={control}
        render={({ field }) => (
          <>
            {/* Existing server image */}
            {typeof field.value === "string" && field.value && files.length === 0 && (
              <div className="relative w-fit mb-3">
                <img src={field.value} alt="صورة المنتج" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
                <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 size-6 bg-white border border-gray-200 rounded-full" onClick={() => field.onChange(undefined)}>
                  <X size={12} />
                </Button>
              </div>
            )}

            <FileUpload
              value={files}
              onValueChange={(newFiles) => {
                setFiles(newFiles);
                field.onChange(newFiles[0] ?? undefined);
                if (newFiles.length > 0) setFileError(null);
              }}
              onFileValidate={(file) => {
                const error = validateFile(file, files);
                if (error) {
                  setFileError(error);
                  return error;
                }
                setFileError(null);
                return null;
              }}
              accept="image/*"
              maxFiles={1}
            >
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">اسحب وافلت الصورة هنا</p>
                  <p className="text-muted-foreground text-xs">أو اضغط للتصفح</p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    تصفح الملفات
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>

              <FileUploadList>
                {files.map((file) => (
                  <FileUploadItem key={file.name} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => {
                          setFiles([]);
                          setFileError(null);
                          field.onChange(undefined);
                        }}
                      >
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>

            {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
          </>
        )}
      />
    </div>
  );
}
