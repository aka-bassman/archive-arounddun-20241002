import {
  AiOutlineEdit,
  AiOutlineHome,
  AiOutlinePoweroff,
  AiOutlinePrinter,
  AiOutlineSend,
  AiOutlineUser,
} from "react-icons/ai";
import { Keyring } from "@shared/client";
import { Layout, Link } from "@util/ui";
import { ReactNode } from "react";
import { clsx } from "@core/client";

type DirType = "home" | "send" | "print" | "self";

const iconMap: { [key in DirType]: ReactNode } = {
  home: <AiOutlineHome />,
  send: <AiOutlineSend />,
  print: <AiOutlinePrinter />,
  self: <AiOutlineUser />,
};

interface MainHeaderProps {
  className?: string;
  children?: any;
  items: {
    type: DirType;
    name: string;
    href?: string;
  }[];
  type?: "view" | "edit" | "new";
}
export const MainHeader = ({ className, children, items, type = "view" }: MainHeaderProps) => {
  return (
    <Layout.Header
      className={clsx("fixed left-0 px-2 py-2 bg-opacity-50 backdrop-blur flex items-center gap-2", className)}
    >
      <Layout.Sider>
        <div className="text-4xl font-lemonmilk w-full text-center my-8">Syrs</div>
        <ul className="menu p-4 w-full bg-base-200 text-base-content">
          {/* <li>
            <User.Zone.Profile/>
          </li> */}
          <li>
            <Link href="/" className="flex gap-2 items-center text-lg">
              {iconMap.home} Home
            </Link>
          </li>
          <li>
            <Link href="/self" className="flex gap-2 items-center text-lg">
              {iconMap.self} My Profile
            </Link>
          </li>
          <li>
            <Keyring.Util.Signout href="/" className="flex gap-2 items-center text-lg text-warning">
              <AiOutlinePoweroff /> Sign out
            </Keyring.Util.Signout>
          </li>
        </ul>
      </Layout.Sider>
      <div className="text-sm breadcrumbs hidden md:block">
        <ul>
          {items.slice(0, -2).map(({ type, name, href }, idx) => (
            <li key={idx}>
              <Link className="flex gap-1 items-center" href={href}>
                {iconMap[type]} {name}
              </Link>
            </li>
          ))}
          <li></li>
        </ul>
      </div>
      <div className="text-sm breadcrumbs -ml-2">
        <ul>
          {items.slice(-2).map(({ type, name, href }, idx) => (
            <li key={idx}>
              <Link className="flex gap-1 items-center" href={href}>
                {iconMap[type]} {name}
              </Link>
            </li>
          ))}
          {type === "new" ? (
            <li>+ new</li>
          ) : type === "edit" ? (
            <li className="flex gap-1 items-center">
              <AiOutlineEdit /> edit
            </li>
          ) : null}
        </ul>
      </div>
      {children}
    </Layout.Header>
  );
};
