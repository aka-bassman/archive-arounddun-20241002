import { AiOutlineFileSync } from "react-icons/ai";
import { Signal } from "@util/ui";
export const LocalFile = {
  Menu: {
    Doc: {
      key: "localFile",
      label: "LocalFile",
      icon: <AiOutlineFileSync />,
      render: () => <Signal.Doc.Zone refName="localFile" />,
    },
  },
};
