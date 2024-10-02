import * as Template from "./Comment.Template";
import * as Unit from "./Comment.Unit";
import * as Util from "./Comment.Util";
import * as View from "./Comment.View";
import * as Zone from "./Comment.Zone";
import { AiOutlineWechat } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Comment = {
  Menu: {
    Admin: {
      key: "comment",
      label: "Comment",
      icon: <AiOutlineWechat />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "comment",
      label: "Comment",
      icon: <AiOutlineWechat />,
      render: () => <Signal.Doc.Zone refName="comment" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
