import * as Template from "./Story.Template";
import * as Unit from "./Story.Unit";
import * as Util from "./Story.Util";
import * as View from "./Story.View";
import * as Zone from "./Story.Zone";
import { AiOutlineFontColors } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Story = {
  Menu: {
    Admin: {
      key: "story",
      label: "Story",
      icon: <AiOutlineFontColors />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "story",
      label: "Story",
      icon: <AiOutlineFontColors />,
      render: () => <Signal.Doc.Zone refName="story" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
