"use client";
import { st, usePage } from "@social/client";

interface GroupCallEditProps {
  groupCallId?: string | null;
}

export const General = ({ groupCallId = undefined }: GroupCallEditProps) => {
  const groupCallForm = st.use.groupCallForm();
  const { l } = usePage();
  return (
    <div className="mb-4 flex items-center">
      <input
        className="input input-bordered"
        value={groupCallForm.roomId}
        onChange={(e) => { st.do.setRoomIdOnGroupCall(e.target.value); }}
      />
    </div>
  );
};
