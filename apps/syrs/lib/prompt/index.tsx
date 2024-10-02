import * as Template from "./Prompt.Template";
import * as Unit from "./Prompt.Unit";
import * as Util from "./Prompt.Util";
import * as View from "./Prompt.View";
import * as Zone from "./Prompt.Zone";
import { AiOutlineDatabase } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Prompt = {
  Menu: {
    Admin: {
      key: "prompt",
      label: "Prompt",
      icon: <AiOutlineDatabase />, //! 기본 아이콘입니다. 수정 후 사용하세요.
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "prompt",
      label: "Prompt",
      icon: <AiOutlineDatabase />,
      render: () => <Signal.Doc.Zone refName="prompt" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
