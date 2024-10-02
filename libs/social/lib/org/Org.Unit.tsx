import { AiOutlineTeam } from "react-icons/ai";
import { Link } from "@util/ui";
import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, org, href }: ModelProps<"org", cnst.LightOrg>) => {
  return (
    <Link href={href} className={className}>
      <button className="btn btn-secondary btn-outline h-32 w-full flex-nowrap text-4xl shadow duration-300 hover:shadow-lg">
        <AiOutlineTeam />
        {org.name}
      </button>
    </Link>
  );
};
