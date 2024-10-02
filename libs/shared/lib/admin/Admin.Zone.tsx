"use client";
import { Admin as AdminComponent, cnst, st, usePage } from "@shared/client";
import { ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { DataMenuItem, ModelsProps, router } from "@core/client";
import { Menu } from "@util/ui";
import { ReactNode, useEffect, useState } from "react";
import { useInterval } from "@core/next";

export const Admin = ({ sliceName = "admin", init, query }: ModelsProps<cnst.Admin>) => {
  const me = st.use.me();
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={AdminComponent.Unit.Card}
      renderDashboard={AdminComponent.Util.Stat}
      renderInsight={AdminComponent.Util.Insight}
      renderTemplate={AdminComponent.Template.General}
      renderTitle={(admin: DefaultOf<cnst.Admin>) => (admin.id ? admin.accountId : "New Admin")}
      renderView={(admin: cnst.Admin) => <AdminComponent.View.General admin={admin} />}
      columns={["id", "status", "roles"]}
      actions={(admin: cnst.Admin, idx) => [
        "edit",
        "remove",
        ...(me.hasAccess("admin") && admin.id !== me.id
          ? [{ type: "admin", render: () => <AdminComponent.Util.ManageAdminRole id={admin.id} roles={admin.roles} /> }]
          : []),
        ...(me.hasAccess("superAdmin") && admin.id !== me.id
          ? [
              {
                type: "superAdmin",
                render: () => <AdminComponent.Util.ManageSuperAdminRole id={admin.id} roles={admin.roles} />,
              },
            ]
          : []),
      ]}
    />
  );
};

export const View = ({ view }: { view: ClientView<"admin", cnst.Admin> }) => {
  const admin = st.use.admin();
  useEffect(() => {
    setTimeout(() => {
      st.set({ admin: Object.assign({}, st.get().admin, { status: "asdfd" }) });
    }, 3000);
  }, []);
  return <Load.View view={view} renderView={(admin) => <AdminComponent.View.General admin={admin} />} />;
};

export interface LayoutProps {
  defaultMenu?: string;
  pageMenus: { key: string; title: string; menus: DataMenuItem[] | DataMenuItem }[];
  password?: boolean;
  ssoTypes?: cnst.SsoType[];
  logo?: ReactNode;
  footer?: ReactNode;
}

export const Layout = ({ defaultMenu = "admin", password, ssoTypes, logo, pageMenus, footer }: LayoutProps) => {
  const searchParams = st.use.searchParams();
  const topMenu = searchParams.topMenu as string | undefined;
  const subMenu = searchParams.subMenu as string | undefined;
  const [menuOpen, setMenuOpen] = useState(false);
  const storeDo = st.do as unknown as { [key: string]: ((...args) => Promise<void>) | undefined };
  const { l } = usePage();
  const pageMenu = pageMenus.find((pageMenu) => pageMenu.key === topMenu) ?? pageMenus[0];
  const menuItems = pageMenu.menus;
  const isArray = Array.isArray(menuItems);
  const me = st.use.me();
  const Render: any = isArray
    ? (menuItems.find((menuItem) => menuItem.key === subMenu) ?? menuItems[0]).render
    : menuItems.render;
  useInterval(() => {
    if (me.id) void storeDo.getActiveSummary?.();
  }, 2000);
  if (!me.id || ["signup", "signin"].includes(topMenu ?? ""))
    return <AdminComponent.Util.Auth ssoTypes={ssoTypes} password={password} logo={logo} />;
  return (
    <div className="mx-auto mt-0 block min-h-screen overflow-hidden">
      <div className="fixed z-50 flex h-12 w-full items-center justify-between bg-black">
        <div className="ml-5 mt-1">
          <div className="text-base-100 flex items-center gap-3 whitespace-nowrap">
            {logo} {l("admin.modelName")}
          </div>
        </div>
        <Menu
          className="inset-x-0 top-0 flex h-12 w-[400px] justify-center"
          ulClassName=" flex items-center justify-center"
          inlineCollapsed={false}
          mode="horizontal"
          selectedKeys={[pageMenu.key]}
          onClick={({ key }) => router.push(`/admin?topMenu=${key}`)}
          items={pageMenus.map((pageMenu) => ({
            key: pageMenu.key,
            label: <div className="text-white">{pageMenu.title}</div>,
          }))}
        />
        <AdminComponent.View.General admin={me} />
      </div>
      {isArray && (
        <div className="fixed mt-12 h-full">
          <Menu
            className="text-xs shadow-lg"
            style={{ height: "100vh" }}
            defaultSelectedKeys={[menuItems[0].key]}
            inlineCollapsed={!menuOpen}
            mode="inline"
            activeStyle="active"
            items={menuItems.map((menuItem) => ({
              ...menuItem,
              icon: <div className="grid h-5 place-items-center">{menuItem.icon}</div>,
              label: (
                <div className="grid h-5 place-items-center">
                  {pageMenu.key === "api"
                    ? menuItem.label
                    : l(
                        (menuItem.key.includes(".")
                          ? menuItem.key
                          : `${menuItem.key}.modelName`) as `${string}.${string}`
                      )}
                </div>
              ),
              render: undefined,
            }))}
            selectedKeys={[subMenu ?? menuItems[0].key]}
            onClick={({ key }) => router.push(`/admin?topMenu=${pageMenu.key}&subMenu=${key}`)}
            onMouseOver={() => {
              if (!menuOpen) setMenuOpen(true);
            }}
            onMouseLeave={() => {
              if (menuOpen) setMenuOpen(false);
            }}
          />
        </div>
      )}
      <div className={`mt-20 ${!isArray ? "mx-12" : menuOpen ? "ml-60" : "ml-24"} mr-4 min-h-screen duration-300`}>
        <Render />
      </div>
    </div>
  );
};
