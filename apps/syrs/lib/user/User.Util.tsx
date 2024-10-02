"use client";
import { AiOutlineEdit, AiOutlineLock, AiOutlineUnlock } from "react-icons/ai";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst, st } from "@syrs/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "user",
  queryMap = getQueryMap(cnst.UserSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalUser", "dau"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "user" }: ModelInsightProps<cnst.UserInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface RestrictProps {
  id: string;
}
export const Restrict = ({ id }: RestrictProps) => {
  return (
    <button className="gap-2 btn btn-sm" onClick={() => st.do.restrictUser(id, "Violated Community Guidelines")}>
      <AiOutlineLock />
      Restrict
    </button>
  );
};

interface ReleaseProps {
  id: string;
}
export const Release = ({ id }: ReleaseProps) => {
  return (
    <button className="gap-2 border-dashed btn btn-sm btn-outline" onClick={() => st.do.releaseUser(id)}>
      <AiOutlineUnlock />
      Release
    </button>
  );
};

export const EditSelf = () => {
  const self = st.use.self();
  const userModal = st.use.userModal();
  return userModal !== "edit" ? (
    <button className="gap-2 btn" onClick={() => st.do.editUser(self)}>
      <AiOutlineEdit />
      Edit
    </button>
  ) : null;
};
