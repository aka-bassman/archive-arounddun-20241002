"use client";
import { AiOutlinePrinter } from "react-icons/ai";
import { MutableRefObject } from "react";
import { ReactToPrint } from "react-to-print";

export interface PrintProps {
  printRef: MutableRefObject<HTMLDivElement | null>;
  render?: () => JSX.Element;
}
export const Print = ({
  printRef,
  render = () => (
    <button className="btn btn-sm btn-primary gap-1">
      <AiOutlinePrinter /> Print
    </button>
  ),
}: PrintProps) => {
  return <ReactToPrint trigger={render} content={() => printRef.current} />;
};
