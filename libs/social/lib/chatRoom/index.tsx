import * as Template from "./ChatRoom.Template";
import * as Unit from "./ChatRoom.Unit";
import * as Util from "./ChatRoom.Util";
import * as View from "./ChatRoom.View";
import * as Zone from "./ChatRoom.Zone";
import { AiOutlineWechat } from "react-icons/ai";
import { Signal } from "@util/ui";
export const ChatRoom = {
  Menu: {
    Admin: {
      key: "chatRoom",
      label: "ChatRoom",
      icon: <AiOutlineWechat />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "chatRoom",
      label: "ChatRoom",
      icon: <AiOutlineWechat />,
      render: () => <Signal.Doc.Zone refName="chatRoom" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
