"use client";
import { AiOutlineArrowLeft, AiOutlineEdit, AiOutlineLeft } from "react-icons/ai";
import { Data } from "@shared/ui";
import { Link } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps, clsx, router } from "@core/client";
import { Self, getQueryMap } from "@core/base";
import { cnst, st, usePage } from "@social/client";

export const Stat = ({
  className,
  summary,
  sliceName = "board",
  queryMap = getQueryMap(cnst.BoardSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalBoard"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "board" }: ModelInsightProps<cnst.BoardInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ToolbarProps {
  id: string;
  canWrite?: boolean;
  writeButtonProps?: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  roles: cnst.shared.UserRole[];
  signinHref?: string;
  self?: cnst.User | Self;
}
export const Toolbar = ({ id, writeButtonProps, canWrite, roles, self, signinHref = "/signin" }: ToolbarProps) => {
  const { l } = usePage();
  const path = st.use.path();
  if (path.startsWith(`/board/${id}/`)) return <></>;
  else if (canWrite)
    return (
      <Link href={self?.id ? `/board/${id}/story/new` : signinHref}>
        <button className=" btn " {...writeButtonProps}>
          <div className=" flex w-full items-center gap-2 whitespace-nowrap">
            <AiOutlineEdit />
            {l("story.write")}
          </div>
        </button>
      </Link>
    );
  else if (!self?.id && roles.includes("user"))
    return (
      <Link href={signinHref}>
        <button className="btn" {...writeButtonProps}>
          <div className=" flex w-full items-center gap-2 whitespace-nowrap">
            <AiOutlineEdit />
            {l("story.write")}
          </div>
        </button>
      </Link>
    );
  else return <></>;
};
export const BackButton = ({ id }: { id: string }) => {
  const path = st.use.path();
  if (!path.startsWith(`/board/${id}/`)) return <></>;
  return (
    <Link.Back>
      <AiOutlineLeft />
    </Link.Back>
  );
};

interface BackHeaderProps {
  name: string;
  className?: string;
}
export const BackHeader = ({ name, className }: BackHeaderProps) => {
  return (
    <div className={clsx("text-primary ml-2 text-lg", className)}>
      <button onClick={() => router.back()} className="">
        <AiOutlineArrowLeft />
      </button>
      {name}
    </div>
  );
};

export const Nav = ({ id, boardNames = [], className }: { id: string; boardNames?: string[]; className?: string }) => {
  const boardMap = st.use.boardMap();
  const navBoards = cnst.Board.getFromNames([...boardMap.values()], [...boardNames]);
  const checkIsActive = (boardId) => id === boardId;
  return (
    <div className="text-primary container hidden min-h-[36px] gap-5 md:flex">
      {navBoards.map((board) => (
        <button
          className={`cursor-pointer py-2 transition duration-300 hover:opacity-60 ${
            checkIsActive(board.id) && "border-primary border-b-2"
          }`}
          key={board.id}
          onClick={() => router.push(`/board/${board.id}`)}
        >
          {board.name}
        </button>
      ))}
    </div>
  );
};
