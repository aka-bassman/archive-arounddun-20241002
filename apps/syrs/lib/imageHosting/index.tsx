import * as Template from "./ImageHosting.Template";
import * as Unit from "./ImageHosting.Unit";
import * as Util from "./ImageHosting.Util";
import * as View from "./ImageHosting.View";
import * as Zone from "./ImageHosting.Zone";
import { AiOutlineDatabase } from "react-icons/ai";
import { Signal } from "@util/ui";
export const ImageHosting = {
  Menu: {
    Admin: {
      key: "imageHosting",
      label: "ImageHosting",
      icon: <AiOutlineDatabase />, //! 기본 아이콘입니다. 수정 후 사용하세요.
      render: () => <Zone.Admin />,
    },
    Doc: {
      key: "imageHosting",
      label: "ImageHosting",
      icon: <AiOutlineDatabase />,
      render: () => <Signal.Doc.Zone refName="imageHosting" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
