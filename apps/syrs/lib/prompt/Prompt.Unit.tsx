import { Link } from "@util/ui";
import { ModelProps } from "@core/client";
import { cnst } from "@syrs/client";

export const Card = ({ prompt, href }: ModelProps<"prompt", cnst.LightPrompt>) => {
  return (
    <Link href={href} className="animate-fadeIn w-full h-36 flex rounded-lg shadow hover:shadow-lg duration-300"></Link>
  );
};
