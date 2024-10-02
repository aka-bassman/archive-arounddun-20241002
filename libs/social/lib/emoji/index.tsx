import * as Template from "./Emoji.Template";
import * as Unit from "./Emoji.Unit";
import * as Util from "./Emoji.Util";
import * as View from "./Emoji.View";
import * as Zone from "./Emoji.Zone";
import { AiOutlineDatabase } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Emoji = {
  Menu: {
    Admin: {
      key: "emoji",
      label: "Emoji",
      icon: <AiOutlineDatabase />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "emoji",
      label: "Emoji",
      icon: <AiOutlineDatabase />,
      render: () => <Signal.Doc.Zone refName="emoji" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
