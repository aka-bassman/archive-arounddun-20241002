import * as Unit from "./Search.Unit";
import * as Util from "./Search.Util";
import * as Zone from "./Search.Zone";
import { AiOutlineSearch } from "react-icons/ai";
import { Signal } from "@util/ui";

export const Search = {
  Menu: {
    Admin: {
      key: "search",
      label: "Search",
      icon: <AiOutlineSearch />,
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "search",
      label: "Search",
      icon: <AiOutlineSearch />,
      render: () => <Signal.Doc.Zone refName="search" />,
    },
  },
  Unit,
  Util,
  Zone,
};
