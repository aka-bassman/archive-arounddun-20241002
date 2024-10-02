import { ModelProps } from "@core/client";
import { cnst } from "../cnst";

export const Card = ({ className, notification }: ModelProps<"notification", cnst.LightNotification>) => {
  return <div>{notification.id}</div>;
};
