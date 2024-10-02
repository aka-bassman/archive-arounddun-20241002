import * as Template from "./ServiceDesk.Template";
import * as Unit from "./ServiceDesk.Unit";
import * as Util from "./ServiceDesk.Util";
import * as View from "./ServiceDesk.View";
import * as Zone from "./ServiceDesk.Zone";
import { AiOutlineSchedule } from "react-icons/ai";
import { Signal } from "@util/ui";
export const ServiceDesk = {
  Menu: {
    Admin: {
      key: "serviceDesk",
      label: "ServiceDesk",
      icon: <AiOutlineSchedule />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "serviceDesk",
      label: "ServiceDesk",
      icon: <AiOutlineSchedule />,
      render: () => <Signal.Doc.Zone refName="serviceDesk" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
