import { RecentTime } from "@util/ui";
import { clsx } from "@core/client";
import { cnst } from "../cnst";
import { usePage } from "@social/client";

interface ServiceDeskViewProps {
  className?: string;
  serviceDesk: cnst.ServiceDesk;
}

export const General = ({ className, serviceDesk }: ServiceDeskViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(className, ``)}>
      <div className="mb-0 mt-4 flex justify-between border-b border-gray-200 p-2 text-2xl">
        <h3>
          {l("serviceDesk.id")}-{serviceDesk.id}
        </h3>
      </div>
      <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
        <div>{serviceDesk.status}</div>
        <RecentTime date={serviceDesk.createdAt} breakUnit="second" />
      </div>
    </div>
  );
};
