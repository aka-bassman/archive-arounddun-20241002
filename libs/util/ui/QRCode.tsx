import { QRCodeSVG } from "qrcode.react";
import { clsx } from "@core/client";

export interface QRCodeProps {
  href: string;
  className?: string;
}
export const QRCode = ({ href, className }: QRCodeProps) => {
  return <QRCodeSVG className={clsx("size-12", className)} value={href} />;
};
