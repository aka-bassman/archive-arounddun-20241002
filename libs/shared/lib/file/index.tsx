import * as Template from "./File.Template";
import * as Unit from "./File.Unit";
import * as Util from "./File.Util";
import * as View from "./File.View";
import * as Zone from "./File.Zone";
import { AiOutlineFile } from "react-icons/ai";
import { Signal } from "@util/ui";
export const File = {
  Menu: {
    Admin: {
      key: "file",
      label: "File",
      icon: <AiOutlineFile />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "file",
      label: "File",
      icon: <AiOutlineFile />,
      render: () => <Signal.Doc.Zone refName="file" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
