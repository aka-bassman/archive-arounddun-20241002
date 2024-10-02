import * as Template from "./Setting.Template";
import * as Unit from "./Setting.Unit";
import * as Util from "./Setting.Util";
import * as View from "./Setting.View";
import * as Zone from "./Setting.Zone";
import { AiOutlineSetting } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Setting = {
  Menu: {
    Admin: {
      key: "setting",
      label: "Setting",
      icon: <AiOutlineSetting />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "setting",
      label: "Setting",
      icon: <AiOutlineSetting />,
      render: () => <Signal.Doc.Zone refName="setting" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
