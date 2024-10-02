"use client";
import { BiChevronRight, BiPlus } from "react-icons/bi";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps, clsx } from "@core/client";
import { ProtoFile, getQueryMap } from "@core/base";
import { Upload } from "@util/ui";
import { cnst, fetch, st } from "@social/client";
import { useRef, useState } from "react";

export const Stat = ({
  className,
  summary,
  sliceName = "chatRoom",
  queryMap = getQueryMap(cnst.ChatRoomSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalChatRoom"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "chatRoom" }: ModelInsightProps<cnst.ChatRoomInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ViewWrapperProps {
  className?: string;
  id: string;
  children: any;
}
export const ViewWrapper = ({ className, id, children }: ViewWrapperProps) => {
  return (
    <div className={clsx("cursor-pointer", className)} onClick={() => st.do.viewChatRoom(id)}>
      {children}
    </div>
  );
};

interface ChatBarProps {
  root: string;
  className?: string;
  cameraClassName?: string;
  sendClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}
export const ChatBar = ({ root, className, disabled }: ChatBarProps) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<ProtoFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRoom = st.use.chatRoom();

  const onSend = () => {
    if (!text) return;
    void st.do.addTextChat(root, text);
    setText("");
    inputRef.current?.focus();
  };

  const onClickUpload = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = (await fetch.addChatRoomFiles(fileList)) as unknown as cnst.shared.File[];
    const interval = setInterval(async () => {
      const curFile = await fetch.file(files[0].id);
      if (curFile.status === "uploading") {
        setFile(files[0]);
        return;
      } else {
        clearInterval(interval);
        setFile(null);
        await st.do.addImageChat(root, [curFile]);
      }
    }, 100);
  };

  return (
    <div className={clsx("flex size-full items-center justify-center gap-3 px-2", className)}>
      <Upload.UploadButtonWrapper
        className=" flex h-full items-center "
        accept={"image/jpeg, image/png, image/gif, image/webp, image/avif"}
        onChange={onClickUpload}
        disabled={disabled}
      >
        <button className=" bg-primary flex size-8 items-center justify-center rounded-lg p-0" disabled={disabled}>
          <BiPlus className="text-4xl text-white" />
        </button>
      </Upload.UploadButtonWrapper>

      <input
        ref={inputRef}
        className="input  input-primary input-bordered w-full rounded-lg focus:outline-none active:outline-none"
        value={text}
        onKeyPress={(e) => {
          if (e.key === "Enter") onSend();
        }}
        onChange={(e) => {
          setText(e.target.value);
        }}
        disabled={disabled}
      />
      <button
        className="bg-primary rounded-full"
        onClick={() => {
          onSend();
        }}
        disabled={disabled}
      >
        <BiChevronRight className="text-4xl text-white" />
      </button>
    </div>
  );
};
