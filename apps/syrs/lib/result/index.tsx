import * as Template from "./Result.Template";
import * as Unit from "./Result.Unit";
import * as Util from "./Result.Util";
import * as View from "./Result.View";
import * as Zone from "./Result.Zone";
import { AiOutlineDatabase } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Result = {
  Menu: {
    Admin: {
      key: "result",
      label: "Result",
      icon: <AiOutlineDatabase />, //! 기본 아이콘입니다. 수정 후 사용하세요.
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "result",
      label: "Result",
      icon: <AiOutlineDatabase />,
      render: () => <Signal.Doc.Zone refName="result" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
