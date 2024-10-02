"use client";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { Data } from "@shared/ui";
import { MdVideocam, MdVideocamOff } from "react-icons/md";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { client } from "@core/common";
import { cnst } from "../cnst";
import { getQueryMap } from "@core/base";
import { st } from "@social/client";

export const Stat = ({
  className,
  summary,
  sliceName = "groupCall",
  queryMap = getQueryMap(cnst.GroupCallSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalGroupCall"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "groupCall" }: ModelInsightProps<cnst.GroupCallInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ConnectionProviderProps {
  selfId: string;
  roomId: string;
  children?: ReactNode;
}
export const ConnectionProvider = ({ selfId, roomId, children }: ConnectionProviderProps) => {
  const mediaStream = st.use.mediaStream();
  useEffect(() => {
    if (mediaStream) return;
    void st.do.initMediaStream();
  }, []);
  useEffect(() => {
    if (!client.socket) return;
    client.socket.on("introduce", ({ userId }: { userId: string }) => {
      st.do.addCall(userId, selfId, false);
    });
    client.socket.on("welcome", ({ userId }: { userId: string }) => {
      st.do.addCall(userId, selfId, true);
    });
    client.socket.emit("join", { userId: selfId, roomId });
    return () => {
      if (!client.socket) return;
      client.socket.emit("leave", { userId: selfId });
      client.socket.off("introduce");
      client.socket.off("welcome");
    };
  }, []);
  if (!mediaStream) return <div>MediaStream 설정 필요</div>;
  return children;
};

export const Talking = () => {
  const isTalking = st.use.isTalking();
  return (
    <div className={`absolute z-[-1] size-[105%] rounded-md ${isTalking ? "bg-[#9ACD32]" : "bg-transparent"} `} />
  );
};

export const MyVideo = () => {
  const mediaStream = st.use.mediaStream();
  const localVideo = useRef<HTMLVideoElement>(null);
  const cam = st.use.cam();
  useEffect(() => {
    if (!localVideo.current || !mediaStream) return;
    localVideo.current.srcObject = mediaStream;
    const audioContext = new AudioContext();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
    const analyserNode = audioContext.createAnalyser();
    mediaStreamAudioSourceNode.connect(analyserNode);
    const pcmData = new Float32Array(analyserNode.fftSize);
    const checkVolume = () => {
      analyserNode.getFloatTimeDomainData(pcmData);
      let sumSquares = 0.0;
      for (const amplitude of pcmData) sumSquares += amplitude * amplitude;
      st.do.setIsTalking(sumSquares > 0.1);
    };
    const interval = setInterval(checkVolume, 100);
    return () => {
      clearInterval(interval);
    };
  }, [mediaStream]);
  return mediaStream ? (
    <video
      className={`rounded-md ${cam ? "block" : "hidden "} webcam z-[1] size-auto`}
      ref={localVideo}
      autoPlay={true}
      muted={true}
      playsInline={true}
      style={{ transform: "rotateY(180deg)" }}
    />
  ) : null;
};
export const MyScreen = () => {
  const screenStream = st.use.screenStream();
  const shareVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!shareVideo.current) return;
    shareVideo.current.srcObject = screenStream;
  }, [screenStream]);
  return screenStream ? (
    <video
      className={` h-auto} block w-auto rounded-md`}
      ref={shareVideo}
      autoPlay={true}
      muted={true}
      playsInline={true}
    />
  ) : null;
};

export const MyMic = () => {
  const mic = st.use.mic();
  return (
    <button
      className={`bg-transparent text-[24px] ${mic ? "text-lime-400" : "text-red-400"}`}
      onClick={() => {
        mic ? st.do.muteSelf() : st.do.unmuteSelf();
      }}
    >
      {mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
    </button>
  );
};
export const MyCam = () => {
  const cam = st.use.cam();
  return (
    <button
      className={`bg-transparent text-[24px] ${cam ? "text-lime-400" : "text-red-400"}`}
      onClick={() => {
        cam ? st.do.camOffSelf() : st.do.camOnSelf();
      }}
    >
      {cam ? <MdVideocam /> : <MdVideocamOff />}
    </button>
  );
};

export const OtherCalls = () => {
  const otherCallConnectionMap = st.use.otherCallConnectionMap();
  const OtherCall = ({ userId, callConnection }: { userId: string; callConnection: cnst.CallConnection }) => {
    const { cam, mic, mediaStream } = callConnection;
    const [isTalk, setIsTalk] = useState(false);
    const localVideo = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (!localVideo.current || !mediaStream) return;
      localVideo.current.srcObject = mediaStream;
      const audioContext = new AudioContext();
      const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(mediaStream);
      const analyserNode = audioContext.createAnalyser();
      mediaStreamAudioSourceNode.connect(analyserNode);
      const pcmData = new Float32Array(analyserNode.fftSize);
      const checkVolume = () => {
        analyserNode.getFloatTimeDomainData(pcmData);
        let sumSquares = 0.0;
        for (const amplitude of pcmData) sumSquares += amplitude * amplitude;
        setIsTalk(sumSquares > 0.1);
      };
      const interval = setInterval(checkVolume, 100);
      return () => {
        clearInterval(interval);
      };
    }, [mediaStream]);
    return (
      <div className="relative z-10 m-5 flex h-[130px] w-[200px] items-center justify-center">
        <div
          className="absolute z-0 size-[105%] rounded-md"
          style={{ backgroundColor: isTalk ? "#9ACD32" : "transparent" }}
        />
        <video
          className={` rounded-md ${cam ? "block" : "hidden"} webcam size-auto`}
          ref={localVideo}
          autoPlay={true}
          muted={false}
          playsInline={true}
          style={{ transform: "rotateY(180deg)" }}
        />
        {!cam && (
          <div className="absolute flex size-full items-center justify-center rounded-md bg-slate-800 text-[22px] text-white">
            Cam off
          </div>
        )}
        <div className="absolute bottom-0 gap-5">
          <button
            className={`bg-transparent text-[24px] ${cam ? "text-lime-400" : "text-red-400"}`}
            onClick={() => {
              cam ? st.do.camOffOther(userId) : st.do.camOnOther(userId);
            }}
          >
            {cam ? <MdVideocam /> : <MdVideocamOff />}
          </button>
          <button
            className={`bg-transparent text-[24px] ${mic ? "text-lime-400" : "text-red-400"}`}
            onClick={() => {
              mic ? st.do.muteOther(userId) : st.do.unmuteOther(userId);
            }}
          >
            {mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {[...otherCallConnectionMap.entries()].map(([userId, callConnection]) => (
        <OtherCall key={userId} userId={userId} callConnection={callConnection} />
      ))}
    </>
  );
};
