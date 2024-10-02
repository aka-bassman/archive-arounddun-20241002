"use client";
import { BottomInset } from "./BottomInset";
import { Link } from "@util/ui";
import { clsx } from "@core/client";
import { usePage } from "@util/client";

interface TabType {
  name: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  notiCount?: number;
  href: string;
}

interface BottomTabProps {
  className?: string;
  tabs: TabType[];
  height?: number;
}

export const BottomTab = ({ className, tabs, height = 64 }: BottomTabProps) => {
  const { lang } = usePage();
  const isActiveTab = (tabHref: string) => {
    const locationPath = window.location.pathname.startsWith(`/${lang}`)
      ? window.location.pathname.slice(lang.length + 1) === ""
        ? "/"
        : window.location.pathname.slice(lang.length + 1)
      : window.location.pathname;
    return tabHref === "/" ? locationPath === tabHref : locationPath.startsWith(tabHref);
  };
  return (
    <BottomInset className="h-full">
      <div
        className={clsx(
          `bg-base-100 border-base-200 flex size-full items-center justify-around rounded-t-xl border border-b-0`,
          className
        )}
      >
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`relative flex w-full flex-col items-center justify-end gap-1 ${
              isActiveTab(tab.href) ? "" : "opacity-60"
            }`}
          >
            <div className="indicator ">
              {isActiveTab(tab.href) ? (tab.activeIcon ? tab.activeIcon : tab.icon) : tab.icon}
              {tab.notiCount && tab.notiCount > 0 ? (
                // <div className="absolute top-1 right-2 bg-error  w-5 h-5 rounded-full flex items-center justify-center text-base-100">
                <div className="indicator-item text-base-100  bg-secondary flex size-2 items-center justify-center rounded-full text-[10px]">
                  {/* {tab.notiCount > 99 ? "99+" : tab.notiCount} */}
                </div>
              ) : null}
            </div>
            <span>{tab.name}</span>
          </Link>
        ))}
      </div>
    </BottomInset>
  );
};
