"use client";
import { Layout } from "@util/ui";
import { st, usePage } from "@social/client";

interface ChatRoomEditProps {
  chatRoomId?: string | null;
}

export const General = ({ chatRoomId = undefined }: ChatRoomEditProps) => {
  const chatRoomForm = st.use.chatRoomForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      {/* <p className="w-20 mt-3">{l("chatRoom.field")}</p>
        <input className="input input-bordered" value={chatRoomForm.field} onChange={(e) => slice.do.setFieldOnChatRoom(e.target.value)} /> */}
    </Layout.Template>
  );
};
