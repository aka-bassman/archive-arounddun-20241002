import * as Template from "./Org.Template";
import * as Unit from "./Org.Unit";
import * as Util from "./Org.Util";
import * as View from "./Org.View";
import * as Zone from "./Org.Zone";
import { AiOutlineTeam } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Org = {
  Menu: {
    Admin: {
      key: "org",
      label: "Org",
      icon: <AiOutlineTeam />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "org",
      label: "Org",
      icon: <AiOutlineTeam />,
      render: () => <Signal.Doc.Zone refName="org" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
