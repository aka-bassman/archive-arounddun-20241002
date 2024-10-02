"use client";
import { Render } from "./Render";
import { ScrollContext } from "./context";
import { useContext } from "react";

interface SlideProps {
  id: string;
  children: any;
  className?: string;
  preClassName?: string;
  postClassName?: string;
}
export const Slide = ({ id, children, className, preClassName, postClassName }: SlideProps) => {
  const { setSlide } = useContext(ScrollContext);
  return (
    <Render
      id={id}
      className={className}
      preClassName={preClassName}
      postClassName={postClassName}
      onRendered={() => { setSlide(id); }}
    >
      {children}
    </Render>
  );
};
