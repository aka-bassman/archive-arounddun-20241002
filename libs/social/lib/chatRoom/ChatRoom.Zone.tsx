"use client";
import { Chat } from "@social/ui";
import { ChatRoom, cnst, fetch, st } from "@social/client";
import { type ClientInit, type ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { KeyboardAvoiding, Link } from "@util/ui";
import { ModelsProps, useCsr } from "@core/client";
import { useEffect, useRef, useState } from "react";

export const Admin = ({ sliceName = "chatRoom", init, query }: ModelsProps<cnst.ChatRoom>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={ChatRoom.Unit.Card}
      renderDashboard={ChatRoom.Util.Stat}
      renderInsight={ChatRoom.Util.Insight}
      renderTemplate={ChatRoom.Template.General}
      renderTitle={(chatRoom: DefaultOf<cnst.ChatRoom>) => chatRoom.id}
      renderView={(chatRoom: cnst.ChatRoom) => <ChatRoom.View.General chatRoom={chatRoom} />}
      type="list"
      columns={["type", "status", "createdAt"]}
      actions={(chatRoom: cnst.LightChatRoom, idx) => ["remove", "edit"]}
    />
  );
};

interface AbstractProps {
  className?: string;
  init: ClientInit<"chatRoom", cnst.LightChatRoom>;
  rootUrl?: string;
}
export const Abstract = ({ className, init, rootUrl }: AbstractProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(chatRoom: cnst.ChatRoom) => (
        <ChatRoom.Unit.Abstract key={chatRoom.id} href={`${rootUrl}/chatRoom/${chatRoom.id}`} chatRoom={chatRoom} />
      )}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"chatRoom", cnst.LightChatRoom>;
  selfId: string;
}
export const Card = ({ className, init, selfId }: CardProps) => {
  const chatRoomMapInSelf = st.use.chatRoomMapInSelf();
  return (
    <Load.Units
      className={className}
      init={init}
      loading={<></>}
      renderEmpty={() => (
        <div className="  my-32 flex items-center justify-center">
          <div className="h-full  text-center">
            {/* <Lottie path="/animations/chat/message.json" /> */}
            <div className="text-accent mb-3 text-lg font-bold">대화 중인 친구가 없어요...</div>
            <div className="mb-5 text-sm">아래 버튼을 눌러 새로운 친구를 만들어보세요!</div>
            <Link href="/home">
              <button className="btn btn-primary">만나러 가기</button>
            </Link>
          </div>
        </div>
      )}
      renderList={(chatRooms) => {
        return (
          <div>
            <h2 className="text-sm">대화중</h2>
            {chatRooms.map((chatRoom) => (
              <ChatRoom.Unit.Card
                key={chatRoom.id}
                href={`/chatRoom/${chatRoom.id}`}
                chatRoom={chatRoom}
                selfId={selfId}
              />
            ))}
          </div>
        );
      }}
    />
  );
};

interface ChatListInInitProps {
  root: string;
  init: ClientInit<"chatRoom", cnst.LightChatRoom>;
  selfId?: string;
  className?: string;
  onPressAvatar?: (user: cnst.LightUser) => void;
}
export const ChatListInInit = ({ className, root, init, selfId, onPressAvatar }: ChatListInInitProps) => {
  const { pageContentRef } = useCsr();
  const liveChatListMap = st.use.liveChatListMap();
  const prevScrollHeight = useRef<number>(0);
  const pageOfChatRoomInInit = st.use.pageOfChatRoomInInit();

  const [isInit, setIsInit] = useState(false);
  useEffect(() => {
    st.do.readChat(root);
    const unsubscribeChatAdded = fetch.subscribeChatAdded(root, (chat) => {
      st.do.readChat(root);
      st.do.chatAdded(root, chat);
    });

    if (pageContentRef.current) {
      pageContentRef.current.scrollTop = pageContentRef.current.scrollHeight;
      prevScrollHeight.current = pageContentRef.current.scrollHeight;
    }

    return () => {
      unsubscribeChatAdded();
    };
  }, []);

  //!임시
  useEffect(() => {
    if (!pageContentRef.current || !liveChatListMap.size) return;
    //! 최초접근시, liveChat이 본인에 의해 갱신되었을때만 스크롤을 아래로 내림
    pageContentRef.current.scrollTop = pageContentRef.current.scrollHeight;
  }, [liveChatListMap]);
  //!임시
  useEffect(() => {
    if (!pageContentRef.current) return;
    const lastScrollTop =
      pageContentRef.current.scrollHeight - prevScrollHeight.current + pageContentRef.current.scrollTop;
    pageContentRef.current.scrollTop = lastScrollTop;
    setTimeout(() => {
      //!ios 어거지 맞추기
      if (!pageContentRef.current) return;
      pageContentRef.current.scrollTop = lastScrollTop;
    }, 5);
    prevScrollHeight.current = lastScrollTop;
  }, [pageOfChatRoomInInit]);

  pageContentRef.current?.addEventListener("scroll", () => {
    //
  });

  return (
    <KeyboardAvoiding>
      <Load.Units
        init={init}
        reverse
        noDiv
        renderEmpty={() => <></>}
        renderList={(chatRoomList: cnst.LightChatRoom[]) => {
          const chats = chatRoomList
            .flatMap((chatRoom) => chatRoom.chats)
            .sort((a, b) => {
              return a.at.isAfter(b.at) ? 1 : -1;
            });
          return (
            <div className="flex  flex-col gap-1  overflow-hidden px-2 pb-2 duration-75">
              {chats.map((chat, idx) => {
                return (
                  <>
                    <Chat
                      key={`${chatRoomList[0].root}-${idx}`}
                      chat={chat}
                      selfId={selfId}
                      chatRoom={chatRoomList[0]}
                      users={chatRoomList[0].users}
                      prev={chats[idx - 1] ?? undefined}
                      next={chats[idx + 1] ?? undefined}
                    />
                  </>
                );
              })}
            </div>
          );
        }}
      />
    </KeyboardAvoiding>
  );
};

interface EmptyViewProps {
  view: ClientView<"chatRoom", cnst.ChatRoom>;
}

export const EmptyView = ({ view }: EmptyViewProps) => {
  return (
    <Load.View
      view={view}
      renderView={(chatRoom) => {
        return <></>;
      }}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"chatRoom", cnst.ChatRoom>;
}
export const View = ({ view }: ViewProps) => {
  return <Load.View view={view} renderView={(chatRoom) => <ChatRoom.View.General chatRoom={chatRoom} />} />;
};
