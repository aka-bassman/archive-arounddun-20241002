import { Portal } from "@util/ui";

interface BottomActionProps {
  className?: string;
  children: any;
}

export const BottomAction = ({ className, children }: BottomActionProps) => {
  return (
    <Portal id="bottomActionContent">
      <div className={className}>{children}</div>
    </Portal>
  );
};
