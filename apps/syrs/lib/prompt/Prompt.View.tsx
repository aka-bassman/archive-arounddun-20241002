import { clsx } from "@core/client";
import { cnst } from "@syrs/client";

interface PromptViewProps {
  className?: string;
  prompt: cnst.Prompt;
  self?: { id?: string } | null;
}

export const General = ({ className, prompt, self }: PromptViewProps) => {
  return (
    <div className={clsx(className, `animate-fadeIn w-full`)}>
      <div>{prompt.id}</div>
      asdf
    </div>
  );
};
