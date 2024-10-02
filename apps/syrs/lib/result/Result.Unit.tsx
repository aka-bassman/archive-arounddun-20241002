import { Link } from "@util/ui";
import { ModelProps } from "@core/client";
import { cnst } from "@syrs/client";

export const Card = ({ result, href }: ModelProps<"result", cnst.LightResult>) => {
  return (
    <Link href={href} className="animate-fadeIn w-full h-36 flex rounded-lg shadow hover:shadow-lg duration-300">
      <div>{result.id}</div>
    </Link>
  );
};
