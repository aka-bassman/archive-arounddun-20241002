import { Link } from "@util/ui";
import { ModelProps } from "@core/client";
import { cnst } from "@shared/client";

export const Card = ({ banner, href }: ModelProps<"banner", cnst.LightBanner>) => {
  return (
    <Link href={href} className="animate-fadeIn flex h-36 w-full rounded-lg shadow duration-300 hover:shadow-lg">
      <div>{banner.title}</div>
    </Link>
  );
};
