"use client";
import { st, usePage } from "@syrs/client";

interface GeneralProps {
  settingId?: string | null;
}

export const General = ({ settingId = undefined }: GeneralProps) => {
  const settingForm = st.use.settingForm();
  const { l } = usePage();
  return (
    <div className="flex items-center mb-4">
      <div className="flex gap-2 items-center">
        <div className="w-32">{l("setting.resignupDays")}</div>
        <input
          type="number"
          className="input input-bordered"
          value={settingForm.resignupDays}
          onChange={(e) => {
            st.do.setResignupDaysOnSetting(e.target.valueAsNumber);
          }}
        />
      </div>
    </div>
  );
};
