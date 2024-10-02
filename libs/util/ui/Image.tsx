/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { CsrImage } from "./CsrImage";
import { ProtoFile, baseClientEnv } from "@core/base";
import { clsx } from "@core/client";
import NextImage, { ImageProps } from "next/image";
export const Image = ({
  src,
  file,
  className,
  abstractData,
  alt,
  ...props
}: Omit<ImageProps, "alt" | "src"> &
  (
    | {
        src?: string;
        file?: ProtoFile;
        abstractData?: string;
        alt?: string;
      }
    | {
        src?: undefined;
        abstractData?: string;
        file: { url: string; imageSize: [number, number]; abstractData?: string | null } | null;
        alt?: string;
      }
  )) => {
  const url = src ?? file?.url ?? "/empty.png";
  const [width, height] = [props.width ?? file?.imageSize[0], props.height ?? file?.imageSize[1]];
  const defaultAbstractData =
    "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==";

  const blurDataURL = abstractData ?? file?.abstractData ?? defaultAbstractData;

  return baseClientEnv.renderMode === "csr" ? (
    <CsrImage src={src} file={file} abstractData={abstractData} className={className} {...props} />
  ) : (
    <NextImage
      src={url}
      fill={props.fill ?? (!width && !height)}
      width={width}
      height={height}
      className={clsx("object-cover", className)}
      alt={alt ?? "image"}
      placeholder="blur"
      blurDataURL={blurDataURL}
      {...props}
    />
  );
};
