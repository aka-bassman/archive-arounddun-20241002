import * as Template from "./Summary.Template";
import * as Unit from "./Summary.Unit";
import * as Util from "./Summary.Util";
import * as View from "./Summary.View";
import * as Zone from "./Summary.Zone";
import { AiOutlineLineChart } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Summary = {
  Menu: {
    Admin: {
      key: "summary",
      label: "Summary",
      icon: <AiOutlineLineChart />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "summary",
      label: "Summary",
      icon: <AiOutlineLineChart />,
      render: () => <Signal.Doc.Zone refName="summary" />,
    },
    Dashboard: {
      key: "summary",
      label: "Summary",
      icon: <AiOutlineLineChart />,
      render: () => <Zone.Dashboard />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
