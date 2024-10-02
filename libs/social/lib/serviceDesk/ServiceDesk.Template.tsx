"use client";
import { st, usePage } from "@social/client";

interface ServiceDeskEditProps {
  serviceDeskId?: string | null;
}

export const General = ({ serviceDeskId = undefined }: ServiceDeskEditProps) => {
  const serviceDeskForm = st.use.serviceDeskForm();
  const { l } = usePage();
  return (
    <div className="mb-4 flex items-center">
      {/* <p className="w-20 mt-3">{l("serviceDesk.field")}</p>
        <input className="input input-bordered" value={serviceDeskForm.field} onChange={(e) => slice.do.setFieldOnServiceDesk(e.target.value)} /> */}
    </div>
  );
};
