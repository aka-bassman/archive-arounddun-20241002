import * as Template from "./Banner.Template";
import * as Unit from "./Banner.Unit";
import * as Util from "./Banner.Util";
import * as View from "./Banner.View";
import * as Zone from "./Banner.Zone";
import { AiOutlineHeatMap } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Banner = {
  Menu: {
    Admin: {
      key: "banner",
      label: "Banner",
      icon: <AiOutlineHeatMap />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "banner",
      label: "Banner",
      icon: <AiOutlineHeatMap />,
      render: () => <Signal.Doc.Zone refName="banner" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
