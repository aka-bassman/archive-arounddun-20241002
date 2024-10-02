import { Link } from "@util/ui";
import { cnst } from "../cnst";

interface CardProps {
  groupCall: cnst.LightGroupCall;
}
export const Card = ({ groupCall }: CardProps) => {
  return (
    <Link className="" href={`/groupCall/${groupCall.id}`}>
      {groupCall.roomId}
    </Link>
  );
};
