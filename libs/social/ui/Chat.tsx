"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Avatar, ChatBubble, Image } from "@util/ui";
import { BiX } from "react-icons/bi";
import { Dayjs } from "@core/base";
import { clsx } from "@core/client";
import { useState } from "react";
import type { cnst } from "@social/client";

interface ChatProps {
  className?: string;
  chat: cnst.Chat;
  selfId?: string;
  chatRoom: cnst.LightChatRoom;
  users: cnst.LightUser[];
  prev?: cnst.Chat;
  next?: cnst.Chat;
  renderAvatar?: (user: cnst.LightUser) => React.ReactNode;
}
export const Chat = ({ className, chat, selfId, chatRoom, users, prev, next, renderAvatar }: ChatProps) => {
  const isMe = chat.user && chat.user === selfId ? true : false;
  const user = users.find((user) => user.id === chat.user);
  const getAt = () => {
    const isSameNext = next?.at.format("HH:mm") === chat.at.format("HH:mm");
    const isNextMe = next?.user === chat.user;
    //최신날짜이면 시간표기
    if (!next || !next.at.isSame(chat.at, "day") || !isNextMe || !isSameNext) {
      return chat.at;
    }
  };
  const at = getAt();
  const day = prev
    ? prev.at.isSame(chat.at, "day")
      ? null
      : chat.at.format("YYYY-MM-DD")
    : chat.at.format("YYYY-MM-DD");
  const avatar = isMe ? null : next?.user !== chat.user ? (
    user && renderAvatar ? (
      renderAvatar(user)
    ) : (
      <Avatar className="bg-base-300 size-8 text-3xl md:size-12" src={user?.image?.url} />
    )
  ) : (
    <div className="size-8" />
  );
  return (
    <>
      {day ? (
        <div className="relative my-2 flex items-center justify-center text-center text-xs">
          <div className="bg-base-200 rounded-full px-12">{day}</div>
        </div>
      ) : null}

      {chat.text ? (
        <>
          <Text
            className={className}
            text={chat.text}
            isMe={isMe}
            nickname={user?.nickname ?? ""}
            hasPrev={prev && prev.user === chat.user ? true : false}
            hasNext={next && next.user === chat.user ? true : false}
            at={at}
            avatar={avatar}
          />
        </>
      ) : null}
      {chat.type === "image" ? (
        <Images
          className={className}
          images={chat.images}
          profile={user?.image}
          isMe={isMe}
          nickname={user?.nickname ?? ""}
          hasPrev={prev && prev.user === chat.user ? true : false}
          hasNext={next && next.user === chat.user ? true : false}
          at={at}
          avatar={avatar}
        />
      ) : null}
    </>
  );
};

interface TextProps {
  className?: string;
  text: string;
  isMe: boolean;
  nickname: string;
  hasPrev: boolean;
  hasNext: boolean;
  at?: Dayjs | null;
  avatar?: React.ReactNode;
}
const Text = ({ className, text, isMe, nickname, hasPrev, hasNext, at, avatar }: TextProps) => {
  return (
    <ChatBubble
      className={clsx("bg-primary text-base-100 max-w-[60vw] break-all px-4", className)} // name={isMe ? "You" : nickname}
      isMe={isMe}
      // avatar={!isMe ? <Avatar className="w-6 h-6 md:w-12 md:h-12 text-3xl bg-base-300" src={image?.url} /> : null}
      avatar={avatar}
      hasPrev={hasPrev}
      hasNext={hasNext}
      at={at}
    >
      {text}
    </ChatBubble>
  );
};

interface ImagesProps {
  className?: string;
  profile?: cnst.shared.File | null;
  images: cnst.shared.File[];
  isMe: boolean;
  nickname: string;
  hasPrev: boolean;
  hasNext: boolean;
  at?: Dayjs | null;
  avatar?: React.ReactNode;
}
const Images = ({ className, profile, images, isMe, nickname, hasPrev, hasNext, at, avatar }: ImagesProps) => {
  return (
    <>
      <ChatBubble
        className={clsx("bg-transparent px-2 py-0", className)}
        isMe={isMe}
        // avatar={!isMe ? <Avatar className="w-6 h-6 md:w-12 md:h-12 text-3xl bg-base-300" src={profile?.url} /> : null}
        avatar={avatar}
        hasPrev={hasPrev}
        hasNext={hasNext}
        at={at}
      >
        <div className={clsx("bg-base-200 flex rounded-md", isMe ? "justify-end" : "justify-start")}>
          <div className="flex flex-wrap gap-2">
            {images.map((image, idx) => (
              <ImageItem key={idx} src={image.url} className={className} />
            ))}
          </div>
        </div>
      </ChatBubble>
    </>
  );
};

interface ImageItemProps {
  src: string;
  className?: string;
}

const ImageItem = ({ src, className }: ImageItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger
        asChild
        onClick={() => {
          setOpen(true);
        }}
      >
        <Image src={src} className={clsx("w-48 rounded", className)} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => {
            setOpen(false);
          }}
          className="fixed inset-0 bg-black/40"
        />
        <Dialog.Close asChild>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="btn btn-ghost text-primary-content opacity-80"
          >
            <BiX className="text-3xl" />
          </button>
        </Dialog.Close>
        <Dialog.Content className="min-w-auto animate-fadeIn fixed left-1/2 top-1/2 z-[2] w-[90%] -translate-x-1/2 -translate-y-1/2 md:w-fit">
          <Dialog.Description className="outline-none">
            <Image src={src} className="w-full" />
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
