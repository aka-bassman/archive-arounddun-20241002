import * as Template from "./Keyring.Template";
import * as Unit from "./Keyring.Unit";
import * as Util from "./Keyring.Util";
import * as View from "./Keyring.View";
import * as Zone from "./Keyring.Zone";
import { AiOutlineKey } from "react-icons/ai";
import { Signal } from "@util/ui";
export const Keyring = {
  Menu: {
    Admin: (
      viewUser: ({ user }: { user: any }) => JSX.Element,
      editUser?: (props?: { className?: string }) => JSX.Element
    ) => ({
      key: "keyring",
      label: "Keyring",
      icon: <AiOutlineKey />,
      render: () => <Zone.Admin viewUser={viewUser} editUser={editUser} />,
    }),
    Doc: {
      key: "keyring",
      label: "Keyring",
      icon: <AiOutlineKey />,
      render: () => <Signal.Doc.Zone refName="keyring" />,
    },
  },
  Template,
  Unit,
  Util,
  View,
  Zone,
};
