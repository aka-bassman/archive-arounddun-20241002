import * as Template from "./GroupCall.Template";
import * as Unit from "./GroupCall.Unit";
import * as Util from "./GroupCall.Util";
import * as View from "./GroupCall.View";
import * as Zone from "./GroupCall.Zone";
import { AiOutlineAliwangwang } from "react-icons/ai";
import { Signal } from "@util/ui";
export const GroupCall = {
  Menu: {
    Admin: {
      key: "groupCall",
      label: "GroupCall",
      icon: <AiOutlineAliwangwang />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "groupCall",
      label: "GroupCall",
      icon: <AiOutlineAliwangwang />,
      render: () => <Signal.Doc.Zone refName="groupCall" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
