import { Image } from "@util/ui";
import { cnst, ImageHosting } from "@syrs/client";
import { clsx } from "@core/client";

interface ImageHostingViewProps {
  className?: string;
  imageHosting: cnst.ImageHosting;
  self?: { id?: string } | null;
}

export const General = ({ className, imageHosting, self }: ImageHostingViewProps) => {
  return (
    <div className={clsx(className, `animate-fadeIn w-full`)}>
      <div>{imageHosting.id}</div>
      <div>{imageHosting.status}</div>
      <Image src={imageHosting.image.url} />
      <div>{imageHosting.name}</div>
    </div>
  );
};
