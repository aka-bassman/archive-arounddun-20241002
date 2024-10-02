import * as Template from "./Admin.Template";
import * as Unit from "./Admin.Unit";
import * as Util from "./Admin.Util";
import * as View from "./Admin.View";
import * as Zone from "./Admin.Zone";
import { AiOutlineMonitor } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Admin = {
  Menu: {
    Admin: {
      key: "admin",
      label: "Admin",
      icon: <AiOutlineMonitor />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "admin",
      label: "Admin",
      icon: <AiOutlineMonitor />,
      render: () => <Signal.Doc.Zone refName="admin" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
