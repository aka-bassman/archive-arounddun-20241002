import { GroupCall, usePage } from "@social/client";
import { ReactNode } from "react";
import { RecentTime } from "@util/ui";
import { clsx } from "@core/client";
import { cnst } from "../cnst";
//!env로 옮겨야함

interface GroupCallViewProps {
  groupCall: cnst.GroupCall;
  className?: string;
  actions?: ReactNode;
}

export const General = ({ className, groupCall }: GroupCallViewProps) => {
  const { l } = usePage();

  return (
    <div className={clsx(className, ``)}>
      <div className="mb-0 mt-4 flex justify-between border-b border-gray-200 p-2 text-2xl">
        <h3>
          {l("groupCall.id")}-{groupCall.id}
        </h3>
      </div>
      <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
        <div>{groupCall.status}</div>
        <RecentTime date={groupCall.createdAt} breakUnit="second" />
      </div>
    </div>
  );
};

interface GroupCallViewConnectionProps {
  selfId: string;
  groupCall: cnst.GroupCall;
  className?: string;
}

export const Connection = ({ selfId, className, groupCall }: GroupCallViewConnectionProps) => {
  return (
    <GroupCall.Util.ConnectionProvider selfId={selfId} roomId={groupCall.roomId}>
      <div className="relative z-10 m-5 flex h-[130px] w-[200px] items-center justify-center rounded-md">
        <GroupCall.Util.MyVideo />
        <div className="absolute z-0 flex size-full items-center justify-center rounded-md bg-slate-800 text-[22px] text-white">
          Cam off
        </div>
        <GroupCall.Util.Talking />
        <div className="absolute bottom-[5%] left-1/2 z-[1] flex w-full -translate-x-1/2 justify-center gap-5">
          <GroupCall.Util.MyCam />
          <GroupCall.Util.MyMic />
        </div>
      </div>
      <GroupCall.Util.MyScreen />
    </GroupCall.Util.ConnectionProvider>
  );
};
