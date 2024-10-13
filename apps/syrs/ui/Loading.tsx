import { AiOutlineClose } from "react-icons/ai";
import { Image } from "@util/ui";
import { animated, easings, useSpring } from "@react-spring/web";
import { clsx } from "@core/client";
interface LoadingProps {
  topRender?: () => JSX.Element;
  bottomRender?: () => JSX.Element;
  setClose?: () => void;
  className?: string;
}

export const DodboGi = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image src="/dodbo.svg" alt="logo" width={106} height={104} />
    </div>
  );
};

export const SolutionLoading = ({ topRender, bottomRender, setClose, className }: LoadingProps) => {
  const { x, y } = useSpring({
    from: { x: 0, y: 0 },
    to: async (next) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
      while (true) {
        await next({ x: 300 - 50, y: 30 });
        await next({ x: 150 - 50, y: 165 });
        await next({ x: 0, y: 0 });
      }
    },
    config: { duration: 2000, easing: easings.easeInOutQuad },
    loop: true,
  });

  return (
    <div
      className={clsx(
        className,
        "fixed inset-0 z-10 w-[calc(100dvw)] h-[calc(100dvh)] bg-syrs-bg flex flex-col justify-center items-center pb-40 top-16 pt-30 px-16"
      )}
    >
      <div
        className="absolute btn btn-ghost border-none text-center items-center py-1 -top-12 opacity-70 right-0 p-4 text-3xl text-syrs-label"
        onClick={() => {
          setClose && setClose();
        }}
      >
        <AiOutlineClose />
      </div>
      <div className=" text-xl mb-36">{topRender?.()}</div>
      <div className=" w-[300px] h-[215px] relative  border-s-2  border-s-transparent mb-24">
        <animated.div
          style={{
            position: "absolute",
            transform: x.to((x) => `translate3d(${x}px,${y.get()}px,0)`),
          }}
        >
          <DodboGi />
        </animated.div>
        <Image
          src="/Image1123.png"
          alt="logo"
          className=" -z-20 rounded-xl bg-white inset-4"
          width={300}
          height={215}
        />
      </div>
      {bottomRender?.()}
    </div>
  );
};

export const Loading = ({ topRender, bottomRender, setClose, className }: LoadingProps) => {
  const { x, y } = useSpring({
    from: { x: 0, y: 0 },
    to: async (next) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
      while (true) {
        await next({ x: 0, y: -20 });
        await next({ x: 150, y: 50 });
        await next({ x: 50, y: 170 });
      }
    },
    config: { duration: 2000, easing: easings.easeInOutQuad },
    loop: true,
  });

  return (
    <div
      className={clsx(
        className,
        "fixed inset-0 z-10 w-[calc(100dvw)] h-[calc(100dvh)] bg-syrs-bg flex flex-col justify-center items-center pb-40 top-16 pt-30 px-16"
      )}
    >
      <div
        className="absolute btn btn-ghost border-none text-center items-center py-1 -top-12 opacity-70 right-0 p-4 text-3xl text-syrs-label"
        onClick={() => {
          setClose && setClose();
        }}
      >
        <AiOutlineClose />
      </div>
      <div className=" text-xl mb-36">{topRender?.()}</div>
      <div className=" w-[291] h-[228]  mb-24">
        <animated.div
          style={{
            position: "absolute",
            transform: x.to((x) => `translate3d(${x}px,${y.get()}px,0)`),
          }}
        >
          <DodboGi />
        </animated.div>
        <Image src="/Group 15237.svg" alt="logo" className=" rounded bg-white" width={191} height={228} />
      </div>
      {bottomRender?.()}
    </div>
  );
};
