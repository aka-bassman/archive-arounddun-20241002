"use client";
import { Image, Link } from "@util/ui";
import { st } from "@syrs/client";
export interface SolutionProps {
  src?: string;
  title: string;
  subTitle: string;
  descriptions: string[];
  volume: string;
  index?: number;
  footer?: string[];
  isSmall?: boolean;
  href?: string;
}

export const Solution = ({
  src = "/Group 85.svg",
  index = 1,
  title,
  subTitle,
  descriptions,
  volume,
  footer,
  isSmall,
  href,
}: SolutionProps) => {
  isSmall = isSmall ?? st.use.isSmall();
  return (
    <>
      {isSmall ? (
        <SmallSolution
          src={src}
          index={index}
          title={title}
          subTitle={subTitle}
          descriptions={descriptions}
          volume={volume}
          footer={footer}
          href={href}
        />
      ) : (
        <BigSolution
          src={src}
          index={index}
          title={title}
          subTitle={subTitle}
          descriptions={descriptions}
          volume={volume}
          footer={footer}
          href={href}
        />
      )}
    </>
  );
};

const BigSolution = ({
  src = "/Group 85.svg",
  index = 1,
  title,
  subTitle,
  descriptions,
  volume,
  footer,
  href,
}: SolutionProps) => {
  return (
    <Link
      className=" w-[308px] h-[412px] overflow-y-clip  min-h-max flex flex-col relative rounded-xl px-4 overflow-hidden z-0"
      href={href}
    >
      <Image src={"/products/" + src} alt={title} fill className=" inset-0 -z-10 !object-cover" quality={100} />
      <div className="absolute text-primary text-opacity-40 top-2 left-4 text-xs ">Solution. {index}</div>
      {footer && (
        <div className="absolute text-syrs-font text-opacity-60 bottom-4 right-4 text-[7px] leading-[10px]">
          {footer.map((f, i) => (
            <>
              {f}
              <br />
            </>
          ))}
        </div>
      )}
      <div className="flex w-full justify-between text-sm mt-52 font-medium">
        {title}
        <div className=" text-[9px] text-primary text-opacity-60 h-auto items-center my-auto">{volume}</div>
      </div>
      <div className=" text-xs text-primary text-opacity-60 min-h-8 flex items-center">{subTitle}</div>
      <div className=" text-xs text-primary gap-2 flex mt-2 flex-col flex-wrap font-medium ">
        {descriptions.map((desc, i) => (
          <div key={i}>{desc}</div>
        ))}
      </div>
    </Link>
  );
};

const SmallSolution = ({
  src = "/Group 85.svg",
  index = 1,
  title,
  subTitle,
  descriptions,
  volume,
  href,
  footer,
}: SolutionProps) => {
  return (
    <Link
      className=" w-[300px]  overflow-y-clip h-[253px] bg-white relative sm:rounded-xl rounded-sm overflow-hidden z-0"
      href={href}
    >
      <Image
        src={"/products/M)" + src}
        alt={title + "m"}
        className="inset-0 -z-10 !object-cover absolute w-full h-full"
        width={300}
        height={253}
        quality={100}
      />
      <div className="w-full h-full px-3 py-2 flex flex-col">
        {footer && (
          <div className="absolute flex gap-2 text-syrs-font text-opacity-60 bottom-4 right-4 text-[6px] leading-[7px]  tracking-tighter">
            {footer.map((f, i) => (
              <div key={i}>{f}</div>
            ))}
          </div>
        )}

        <div className=" text-primary text-opacity-40 text-[9px] mb-2">Step. {index}</div>
        <div>
          <div className="flex w-full justify-between text-sm">
            {title}
            <div className=" text-[9px] text-primary text-opacity-60 h-auto items-center my-auto">{volume}</div>
          </div>
          <div className=" text-[11px] text-primary text-opacity-60 h-8 flex items-center min-h-max leading-3">
            {subTitle}
          </div>
        </div>
        <div className="flex-grow flex flex-col">
          <div
            className={
              src === "deepCareMask.png"
                ? " text-[11px] text-primary flex flex-col flex-wrap justify-around h-36 ml-40 min-h-max tracking-tighter leading-[13px]"
                : " text-[11px] text-primary flex flex-col flex-wrap justify-around h-36 ml-[120px] min-h-max tracking-tighter leading-[13px]"
            }
          >
            {descriptions.map((desc, i) => (
              <div key={i}>{desc}</div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
