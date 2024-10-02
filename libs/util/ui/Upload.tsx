"use client";
// import "react-image-crop/dist/ReactCrop.css";
import { AiFillPlusCircle, AiOutlineDelete, AiOutlineFileText } from "react-icons/ai";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { ChangeEvent, useRef, useState } from "react";
import { CropImage, CropRef } from "./CropImage";
import { Image } from "./Image";
import { clsx, device } from "@core/client";
import { useCamera } from "@core/next";
import { useDropzone } from "react-dropzone";
import type { ProtoFile } from "@core/base";

interface UploadProps {
  multiple?: boolean;
  listType?: "picture-card" | "text";
  fileList?: ProtoFile[];
  render?: (file: ProtoFile) => React.ReactNode;
  onChange?: (e: File | FileList) => void | Promise<void>;
  onRemove?: (e: any) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  maxCount?: number;
  className?: string;
  uploadClassName?: string;
  accept?: string;
}

export const Upload = ({
  multiple = false,
  fileList = [],
  onChange,
  onRemove,
  listType = "picture-card",
  render,
  children,
  disabled = false,
  maxCount,
  className = "",
  uploadClassName = "",
  accept,
}: UploadProps) => {
  const handFileRemove = (fileIdx: number) => {
    onRemove?.(fileList[fileIdx]);
  };

  const checkShowUploadButton = () => {
    if (!multiple) return false;
    else if (!maxCount) return true;
    else if (fileList.length < maxCount) return true;
    else return false;
  };

  if (!fileList.length)
    return (
      <UploadButton
        className={className}
        uploadClassName={uploadClassName}
        onChange={onChange}
        multiple={multiple}
        accept={accept}
      />
    );

  return (
    <div className={clsx("flex flex-wrap gap-2", className)}>
      {fileList.map((file, idx) => {
        return (
          <div
            key={file.id}
            className={clsx(
              "hover:border-primary transfrom flex size-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-2 text-center text-sm duration-300",
              uploadClassName
            )}
          >
            {file.status === "uploading" ? (
              <Progress value={file.progress ?? 0} max={100} />
            ) : (
              <div className="relative size-full [&_.target-view]:transition-all [&_.target-view]:duration-500 [&_.target-view]:hover:scale-75 [&_.target-view]:hover:opacity-20">
                {render ? (
                  render(file)
                ) : listType === "picture-card" ? (
                  <Image
                    src={file.url}
                    className="target-view object-contain"
                    onError={() => <div>{file.filename}</div>}
                  />
                ) : (
                  <div className="target-view aboslute absolute w-full">
                    <div className="flex h-[90px] flex-col items-center justify-center gap-2">
                      <AiOutlineFileText className="text-2xl" />
                      <div className="truncate">{file.filename}</div>
                    </div>
                  </div>
                )}

                <div className="group absolute flex size-full items-center justify-center rounded-lg">
                  <AiOutlineDelete
                    onClick={() => {
                      handFileRemove(idx);
                    }}
                    className="text-primary/0 group-hover:text-primary/100 text-3xl transition duration-300"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
      {checkShowUploadButton() && <UploadButton onChange={onChange} multiple={multiple} accept={accept} />}
    </div>
  );
};

interface UploadButtonProps {
  onChange?: (e: any) => void | Promise<void>;
  multiple?: boolean;
  accept?: string;
  className?: string;
  uploadClassName?: string;
}

const UploadButton = ({ onChange, multiple, accept, className, uploadClassName }: UploadButtonProps) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const onDrop = (acceptedFiles: File[]) => {
    if (!onChange) return;
    acceptedFiles.length === 1 ? void onChange(acceptedFiles[0]) : void onChange(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onChange && files && void onChange(files[0]);
  };

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "hover:border-primary transfrom flex size-[100px] cursor-pointer items-center justify-center rounded-lg border border-dashed text-center text-sm duration-300 hover:text-lg ",
        isDragActive ? " bg-base-300" : "bg-base-100 ",
        uploadClassName
      )}
      onClick={() => inputFileRef.current?.click()}
    >
      <input
        {...getInputProps()}
        ref={inputFileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="transfrom duration-300">
        <div className="flex justify-center text-lg opacity-50">
          <AiFillPlusCircle />
        </div>
        <div style={{ marginTop: 6 }}>Upload</div>
      </div>
    </div>
  );
};

Upload.LocalUpload = UploadButton;

//
interface UploadButtonWrapperProps {
  onChange?: (fileList: FileList) => void;
  multiple?: boolean;
  accept?: string;
  className?: string;
  uploadClassName?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const UploadButtonWrapper = ({
  onChange,
  multiple,
  accept,
  className,
  uploadClassName,
  children,
  disabled,
}: UploadButtonWrapperProps) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    onChange && fileList && onChange(fileList);
  };
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className={className} onClick={() => inputFileRef.current?.click()}>
      <input
        ref={inputFileRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleFileSelect}
      />
      {children}
    </div>
  );
};

Upload.UploadButtonWrapper = UploadButtonWrapper;

//

interface CropImageProps {
  type: "image" | "crop";
  protoFile: ProtoFile | null;
  styleType: "circle" | "square";
  renderEmpty?: () => React.ReactNode;
  renderComplete?: (file: ProtoFile) => React.ReactNode;
  onSave: (file: File | FileList) => void | Promise<void>;
  onRemove: () => void;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
  aspectRatio?: number[];
}

const CropImage_ = ({
  type,
  styleType,
  protoFile,
  onSave,
  onRemove,
  renderEmpty,
  renderComplete,
  className,
  wrapperClassName,
  children,
  aspectRatio,
}: CropImageProps) => {
  const { checkPermission, getPhoto, pickImage } = useCamera();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomSheetRef = useRef<BottomSheetRef | null>(null);
  const cropImageRef = useRef<CropRef | null>(null);
  const [image, setImage] = useState<string>();
  const onCancel = () => {
    bottomSheetRef.current?.close();
    setImage(undefined);
  };
  const onSelectImage = async () => {
    if (Object.keys(device.info).length === 0 || device.info.platform === "web") inputRef.current?.click();
    else {
      const photo = await getPhoto();
      setImage(photo?.dataUrl);
    }
  };

  const saveHandler = async () => {
    const file = await cropImageRef.current?.getFileStream();
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      bottomSheetRef.current?.close();
      await onSave(file);
    }
  };

  return (
    <>
      <button className={clsx("relative duration-300 ", wrapperClassName ?? "w-full")}>
        <input
          ref={inputRef}
          multiple={false}
          accept={"image/jpeg, image/png, image/gif, image/webp, image/avif"}
          onChange={(e) => {
            if (!e.target.files) return;
            if (type === "image") void onSave(e.target.files[0]);
            else {
              const reader = new FileReader();
              reader.readAsDataURL(e.target.files[0]);
              reader.onload = () => {
                setImage(reader.result as string);
                e.target.value = "";
              };
            }
          }}
          className="hidden"
          type="file"
        />
        <div
          onClick={() => {
            void onSelectImage();
          }}
          className={clsx("relative flex items-center ", className, {
            "rounded-full": styleType === "circle",
            "rounded-md": styleType === "square",
            "w-[25vw] h-[25vw]": !renderEmpty && !renderComplete,
          })}
        >
          {protoFile && protoFile.status === "uploading" ? (
            <div className="bg-base-100/30 absolute left-0 top-0 z-[100] flex size-full flex-col items-center justify-center gap-2 px-3">
              <div className="loading loading-spinner loading-lg" />
              <Progress value={protoFile.progress ?? 0} max={100} />
            </div>
          ) : null}
          {protoFile && protoFile.status === "active" ? (
            <>
              {renderComplete ? (
                renderComplete(protoFile)
              ) : (
                <Image
                  className={clsx("size-full object-cover ", {
                    "rounded-full": styleType === "circle",
                    "rounded-md": styleType === "square",
                  })}
                  file={protoFile}
                />
              )}
            </>
          ) : renderEmpty ? (
            renderEmpty()
          ) : (
            <div
              className={clsx("bg-base-content hover:bg-primary size-full duration-300", {
                "rounded-full": styleType === "circle",
                "rounded-md": styleType === "square",
              })}
            >
              {!protoFile ? (
                <div
                  className={clsx(
                    "text-primary hover:text-base-content flex size-full items-center justify-center text-3xl",
                    {
                      "rounded-full": styleType === "circle",
                      "rounded-md": styleType === "square",
                    }
                  )}
                >
                  <AiFillPlusCircle />
                  Upload
                </div>
              ) : null}
            </div>
          )}
        </div>
        {protoFile ? (
          <div
            className={clsx(
              "hover:bg-base-300/80 group absolute  left-0 top-0 flex size-full items-center justify-center duration-300 hover:z-[100]",
              {
                "rounded-full": styleType === "circle",
                "rounded-md": styleType === "square",
              }
            )}
          >
            <AiOutlineDelete
              onClick={() => {
                onRemove();
              }}
              className="text-primary/0 group-hover:text-error text-3xl transition duration-300 md:text-5xl"
            />
          </div>
        ) : null}
      </button>
      {type === "crop" ? (
        <BottomSheet
          type="full"
          ref={bottomSheetRef}
          onCancel={() => {
            setImage(undefined);
          }}
          open={!!image}
        >
          <CropImage aspectRatio={aspectRatio} ref={cropImageRef} src={image ?? ""} />
          <div className="grid w-full grid-cols-2 gap-2 ">
            <button className="btn w-full" onClick={onCancel}>
              취소
            </button>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                void saveHandler();
              }}
            >
              저장
            </button>
          </div>
        </BottomSheet>
      ) : null}
    </>
  );
};

Upload.Image = CropImage_;

interface ProgressProps {
  value: number;
  max: number;
}

const Progress = ({ value, max }: ProgressProps) => {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-xl ">
      <div className="bg-primary/20 absolute size-full" />
      <div
        className="bg-primary/80 absolute size-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
};
