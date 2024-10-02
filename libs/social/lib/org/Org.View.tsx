import { AiOutlineTeam } from "react-icons/ai";
import { cnst } from "../cnst";

interface OrgViewProps {
  org: cnst.Org;
}
export const General = ({ org }: OrgViewProps) => {
  return (
    <div className="items-end  gap-2 md:flex">
      <div className="flex  items-center gap-2 text-3xl">
        <AiOutlineTeam /> {org.name}
      </div>
      <div className="flex gap-1">
        <span
          className={org.owners.length ? "tooltip tooltip-primary " : " "}
          data-tip={org.owners.map((user) => user.nickname).join(", ")}
        >
          ({org.owners.length} owners,{" "}
        </span>
        <span
          className={org.operators.length ? "tooltip tooltip-primary " : " "}
          data-tip={org.operators.map((user) => user.nickname).join(", ")}
        >
          {org.operators.length} operators,{" "}
        </span>
        <span
          className={org.viewers.length ? "tooltip tooltip-primary " : " "}
          data-tip={org.viewers.map((user) => user.nickname).join(", ")}
        >
          {org.viewers.length} viewers)
        </span>
      </div>
    </div>
  );
};
