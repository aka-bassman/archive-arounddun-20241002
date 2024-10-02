import * as Template from "./Board.Template";
import * as Unit from "./Board.Unit";
import * as Util from "./Board.Util";
import * as View from "./Board.View";
import * as Zone from "./Board.Zone";
import { AiOutlineForm } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Board = {
  Menu: {
    Admin: {
      key: "board",
      label: "Board",
      icon: <AiOutlineForm />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "board",
      label: "Board",
      icon: <AiOutlineForm />,
      render: () => <Signal.Doc.Zone refName="board" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
