"use client";
import { st, usePage } from "@syrs/client";

interface SummaryEditProps {
  summaryId?: string | null;
}

export const General = ({ summaryId = undefined }: SummaryEditProps) => {
  const summaryForm = st.use.summaryForm();
  const { l } = usePage();
  return <div className="flex items-center mb-4"></div>;
};
