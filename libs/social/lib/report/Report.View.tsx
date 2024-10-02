import { Editor } from "@shared/ui";
import { HtmlContent, RecentTime } from "@util/ui";
import { Report } from "@social/client";
import { cnst } from "../cnst";
import { isSlateJsonString } from "@core/common";

interface ReportViewProps {
  report: cnst.Report;
  isMe?: boolean;
}
export const General = ({ report, isMe }: ReportViewProps) => {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-200 py-4 text-2xl">
        <h3>{report.title}</h3>
        <div className="flex">
          <Report.Util.ToolMenu id={report.id} isMe={isMe} />
        </div>
      </div>
      <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
        <div>{report.from.nickname}</div>
        <RecentTime date={report.createdAt} breakUnit="second" format="full" />
      </div>
      <div className="border border-gray-200 p-6">
        {isSlateJsonString(report.content) ? (
          <Editor.SlateContent content={report.content} />
        ) : (
          <HtmlContent content={report.content} />
        )}
      </div>
      {report.status === "resolved" && report.replyFrom ? (
        <>
          <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
            <div>{report.replyFrom.accountId}</div>
            <RecentTime date={report.replyAt} breakUnit="second" format="full" />
          </div>
          <div className="border border-gray-200 p-6">
            {isSlateJsonString(report.replyContent ?? "") ? (
              <Editor.SlateContent content={report.replyContent ?? ""} />
            ) : (
              <HtmlContent content={report.replyContent ?? ""} />
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
