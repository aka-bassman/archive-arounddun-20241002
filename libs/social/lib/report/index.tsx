import * as Template from "./Report.Template";
import * as Unit from "./Report.Unit";
import * as Util from "./Report.Util";
import * as View from "./Report.View";
import * as Zone from "./Report.Zone";
import { AiOutlineWarning } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Report = {
  Menu: {
    Admin: {
      key: "report",
      label: "Report",
      icon: <AiOutlineWarning />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "report",
      label: "Report",
      icon: <AiOutlineWarning />,
      render: () => <Signal.Doc.Zone refName="report" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
