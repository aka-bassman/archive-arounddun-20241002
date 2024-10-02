"use client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { Emoji, cnst, st } from "@social/client";
import { Icon, Image } from "@util/ui";
import { ModelsProps } from "@core/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "emoji", init, query }: ModelsProps<cnst.Emoji>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Emoji.Unit.Card}
      renderDashboard={Emoji.Util.Stat}
      renderInsight={Emoji.Util.Insight}
      renderTemplate={Emoji.Template.General}
      renderTitle={(emoji: DefaultOf<cnst.Emoji>) => emoji.id}
      renderView={(emoji: cnst.Emoji) => <Emoji.View.General emoji={emoji} />}
      columns={["email"]}
      actions={["edit"]}
    />
  );
};

interface EmojiZoneBoxProps {
  className: string;
  onClick: (emoji: cnst.LightEmoji) => void;
}

export const Box = ({ className, onClick }: EmojiZoneBoxProps) => {
  // const isShowEmojiSelecter = st.use.isShowEmojiSelecter();
  const emojiMap = st.use.emojiMap();
  const emojiMapLoading = st.use.emojiMapLoading();

  useEffect(() => {
    void st.do.initEmoji({});
  }, []);

  if (emojiMapLoading) return null;

  //!need to change
  return (
    <div
      className={` absolute bottom-[81px] left-[21px] w-[282px] origin-top-left overflow-hidden rounded-md border-[3px] border-solid border-black md:relative md:bottom-0 md:left-0 ${className}`}
    >
      <div className="height-[36px] relative overflow-hidden rounded-t-[6px] border-b-2 border-black bg-white/60 text-center">
        <h2 className="m-0 text-[22px]">Emoji</h2>
        <div
          onClick={() => {
            st.do.setEmojiModal(null);
          }}
          className="absolute right-0 top-0 flex h-[34px] w-[40px] cursor-pointer items-center justify-center border-l-2 border-black"
        >
          <Icon.Reduce />
        </div>
      </div>
      <div className="h-[282px] overflow-y-auto bg-gray-300/40 p-3 backdrop-blur-md">
        <div className="grid grid-cols-4">
          {[...emojiMap.values()].map((emoji, idx) => (
            <button
              key={idx}
              className="flex items-center justify-center bg-transparent"
              onClick={() => {
                onClick(emoji);
                st.do.setEmojiModal(null);
              }}
            >
              <div className="h-[(282/4)px)] w-[(282/4)px]">
                <Image width={49} height={49} src={emoji.file.url} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
