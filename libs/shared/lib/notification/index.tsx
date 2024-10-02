import * as Template from "./Notification.Template";
import * as Unit from "./Notification.Unit";
import * as Util from "./Notification.Util";
import * as View from "./Notification.View";
import * as Zone from "./Notification.Zone";
import { AiOutlineSchedule } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Notification = {
  Menu: {
    Admin: {
      key: "notification",
      label: "Notification",
      icon: <AiOutlineSchedule />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "notification",
      label: "Notification",
      icon: <AiOutlineSchedule />,
      render: () => <Signal.Doc.Zone refName="notification" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
