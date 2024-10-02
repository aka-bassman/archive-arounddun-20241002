import * as Template from "./User.Template";
import * as Unit from "./User.Unit";
import * as Util from "./User.Util";
import * as View from "./User.View";
import * as Zone from "./User.Zone";
import { AiOutlineUser } from "react-icons/ai";
import { Signal } from "@util/ui";
export const User = {
  Menu: {
    Admin: {
      key: "user",
      label: "User",
      icon: <AiOutlineUser />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "user",
      label: "User",
      icon: <AiOutlineUser />,
      render: () => <Signal.Doc.Zone refName="user" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
