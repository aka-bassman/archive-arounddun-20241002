import * as Template from "./ActionLog.Template";
import * as Unit from "./ActionLog.Unit";
import * as Util from "./ActionLog.Util";
import * as View from "./ActionLog.View";
import * as Zone from "./ActionLog.Zone";
import { AiOutlineLike } from "react-icons/ai";
import { Signal } from "@util/ui";
export const ActionLog = {
  Menu: {
    Admin: {
      key: "actionLog",
      label: "ActionLog",
      icon: <AiOutlineLike />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "actionLog",
      label: "ActionLog",
      icon: <AiOutlineLike />,
      render: () => <Signal.Doc.Zone refName="actionLog" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
