import * as Template from "./Test.Template";
import * as Unit from "./Test.Unit";
import * as Util from "./Test.Util";
import * as View from "./Test.View";
import * as Zone from "./Test.Zone";
import { AiOutlineDatabase } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Test = {
  Menu: {
    Admin: {
      key: "test",
      label: "Test",
      icon: <AiOutlineDatabase />, //! 기본 아이콘입니다. 수정 후 사용하세요.
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "test",
      label: "Test",
      icon: <AiOutlineDatabase />,
      render: () => <Signal.Doc.Zone refName="test" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
