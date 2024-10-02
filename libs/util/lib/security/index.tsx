import { AiOutlineBlock } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Security = {
  Menu: {
    Doc: {
      key: "security",
      label: "Security",
      icon: <AiOutlineBlock />,
      render: () => <Signal.Doc.Zone refName="security" />,
    },
  },
};
