"use client";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { animated, config, useSprings } from "@react-spring/web";
import { clsx } from "@core/client";
import { useGesture } from "@use-gesture/react";
import clamp from "lodash.clamp";
import swap from "lodash-move";

interface DragListContextType {
  bind: (...args: any[]) => any;
}
const dragListContext = createContext<DragListContextType>({} as unknown as DragListContextType);
const useDragList = () => useContext(dragListContext);

interface DragListProps<V> {
  className?: string;
  mode?: "horizontal" | "vertical";
  children: JSX.Element[];
  onChange: (value: V[], draggedValue: V, info: { originalIdx: number; newIdx: number; idxChanged: boolean }) => void;
}
const DragList = <V,>({ className, mode = "vertical", children, onChange }: DragListProps<V>) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const order = useRef(children.map((_, index) => index));
  const clientLengths = useRef(children.map((_, index) => 0));
  const centerLengths = useRef(children.map((_, index) => 0));
  const accLengths = useRef(children.map((_, index) => 0));
  const [springs, api] = useSprings(
    children.length,
    fn(order.current, new Array(children.length).fill(0) as number[], new Array(children.length).fill(0) as number[])
  ); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useGesture({
    onDragStart: () => {
      order.current = children.map((_, index) => index);
      clientLengths.current = refs.current.map((ref) =>
        mode === "vertical" ? ref?.clientHeight ?? 0 : ref?.clientWidth ?? 0
      );
      centerLengths.current = clientLengths.current.map(
        (length, idx) => clientLengths.current.slice(0, idx).reduce((acc, cur) => acc + cur, 0) + length / 2
      );
      accLengths.current = clientLengths.current.map((length, idx) =>
        clientLengths.current.slice(0, idx).reduce((acc, cur) => acc + cur, 0)
      );
    },
    onDrag: ({ event, args: [originalIndex], active, movement: [x, y] }) => {
      const originIdx = originalIndex as number;
      const movement = mode === "vertical" ? y : x;
      const dragLength = centerLengths.current[originIdx] + movement;
      const centerIdx = accLengths.current.findIndex(
        (length, idx) => dragLength < accLengths.current[idx + 1] || idx === centerLengths.current.length - 1
      );
      const curRow = clamp(centerIdx, 0, children.length - 1);
      const newOrder = (swap as (...args) => number[])(order.current, originIdx, curRow);
      const newClientHeights = (swap as (...args) => number[])([...clientLengths.current], originIdx, curRow);
      void api.start(fn(newOrder, clientLengths.current, newClientHeights, active, originIdx, movement)); // Feed springs new style data, they'll animate the view without causing a single render
      if (!active) {
        const draggedValue = (children[originIdx].props as { value: V }).value;
        void api.start(fn(order.current, clientLengths.current, newClientHeights, active, originIdx, movement, true));
        onChange(
          children.map((_, index) => (children[newOrder[index]].props as { value: V }).value),
          draggedValue,
          { originalIdx: originIdx, newIdx: curRow, idxChanged: originalIndex !== curRow }
        );
      }
    },
  });
  return (
    <div className={clsx(`flex gap-0`, { "flex-col": mode === "vertical" }, className)}>
      {springs.map(({ zIndex, shadow, movement, scale }, i) => (
        <animated.div
          ref={(el) => (refs.current[i] = el)}
          key={i}
          style={{
            zIndex,
            boxShadow: shadow.to((s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`),
            scale,
            ...(mode === "vertical" ? { y: movement } : { x: movement }),
          }}
        >
          <dragListContext.Provider value={{ bind: () => bind(i) }}>{children[i]}</dragListContext.Provider>
        </animated.div>
      ))}
    </div>
  );
};

interface Cursor {
  className?: string;
  children: any;
}
DragList.Cursor = ({ className, children }: Cursor) => {
  const { bind } = useDragList();
  return (
    <div className={clsx("cursor-pointer", className)} {...bind()}>
      {children}
    </div>
  );
};

interface ItemProps {
  value: any;
  children: ReactNode;
}
const Item = ({ value, children }: ItemProps) => {
  return children;
};
DragList.Item = Item;

const fn =
  (
    order: number[],
    heights: number[],
    newHeights: number[],
    active = false,
    originalIndex = 0,
    movement = 0,
    finished = false
  ) =>
  (index: number) => {
    return active && index === originalIndex
      ? {
          movement,
          scale: 1.03,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "zIndex",
          config: (key: string) => (key === "y" ? config.stiff : config.default),
        }
      : {
          movement:
            index === originalIndex
              ? newHeights.slice(0, order.indexOf(index)).reduce((a, b) => a + b, 0) -
                heights.slice(0, index).reduce((a, b) => a + b, 0)
              : order.indexOf(index) === index
                ? 0
                : order.indexOf(index) > index
                  ? heights[originalIndex]
                  : -heights[originalIndex],
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: finished,
        };
  };
export const DraggableList = DragList;
