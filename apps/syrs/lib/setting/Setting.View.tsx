import { clsx } from "@core/client";
import { cnst } from "../cnst";
import { usePage } from "@syrs/client";

interface SettingViewProps {
  className?: string;
  setting: cnst.Setting;
}

export const General = ({ className, setting }: SettingViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(className, `mr-12`)}>
      <div>
        {l("setting.resignupDays")}: {setting.resignupDays}
      </div>
    </div>
  );
};
