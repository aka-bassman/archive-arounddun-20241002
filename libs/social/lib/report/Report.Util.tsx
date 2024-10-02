"use client";
import { AiOutlineCheckCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineMore, AiOutlineNumber } from "react-icons/ai";
import { Data, Editor } from "@shared/ui";
import { Dropdown, Modal, RecentTime } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps, router } from "@core/client";
import { cnst, fetch, st, usePage } from "@social/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  summary,
  sliceName = "report",
  queryMap = getQueryMap(cnst.ReportSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalReport", "activeReport", "inProgressReport", "resolvedReport"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "report" }: ModelInsightProps<cnst.ReportInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ToolMenuProps {
  id: string;
  isMe?: boolean;
}
export const ToolMenu = ({ id, isMe }: ToolMenuProps) => {
  const { l } = usePage();
  const reportModal = st.use.reportModal();
  return (
    <Dropdown
      value={<AiOutlineMore />}
      buttonClassName="btn btn-outline"
      content={
        isMe ? (
          <div className="flex flex-col gap-1">
            <button
              className="btn btn-sm btn-ghost flex flex-nowrap gap-1"
              onClick={() => router.push(`/report/${id}/edit`)}
            >
              <AiOutlineEdit />
              {l("social.edit")}
            </button>
            <button
              className="btn btn-sm btn-ghost flex flex-nowrap gap-1 text-red-500"
              onClick={() => {
                st.do.setReportModal("remove");
              }}
            >
              <AiOutlineDelete />
              {l("social.remove")}
            </button>
            <Modal
              title="Remove Report"
              open={reportModal === "remove"}
              onCancel={() => {
                st.do.setReportModal(null);
              }}
              action={
                <button
                  className="btn btn-primary btn-sm"
                  onClick={async () => {
                    await st.do.removeReport(id);
                    router.push(`/report`);
                  }}
                >
                  Remove
                </button>
              }
            >
              {l("social.removeMsg")}
            </Modal>
          </div>
        ) : (
          <div></div>
        )
      }
    />
  );
};

interface ProcessProps {
  report: cnst.LightReport;
  idx?: number;
}
export const Process = ({ report, idx }: ProcessProps) => {
  return (
    <button className="btn btn-sm gap-2" onClick={() => st.do.processReport(report.id)}>
      <AiOutlineNumber />
      Process
    </button>
  );
};

interface ResolveProps {
  report: cnst.LightReport;
}
export const Resolve = ({ report }: ResolveProps) => {
  const reportForm = st.use.reportForm();
  const reportModal = st.use.reportModal();
  return (
    <>
      <button
        className="btn btn-primary btn-sm gap-2"
        onClick={() => st.do.editReport(report.id, { modal: `resolve-${report.id}` })}
      >
        <AiOutlineCheckCircle />
        Resolve
      </button>
      <Modal
        key={report.id}
        open={reportModal === `resolve-${report.id}`}
        onCancel={() => {
          st.do.resetReport();
        }}
        action={
          <button
            className="btn btn-primary btn-sm"
            onClick={() => st.do.resolveReport(report.id)}
            disabled={(reportForm.replyContent?.length ?? 0) < 10}
          >
            Resolve
          </button>
        }
      >
        <div className="mb-0 mt-4 flex justify-between border-b border-gray-200 p-2 text-2xl">
          <h3>{report.title}</h3>
        </div>
        <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
          <div>{report.from.nickname}</div>
          <RecentTime date={report.createdAt} breakUnit="second" />
        </div>
        <div className="border border-gray-200 p-6" dangerouslySetInnerHTML={{ __html: report.content }} />
        <div className="mb-0 mt-4 flex justify-between border-b border-gray-200 p-2 text-2xl">
          <h3>Reply</h3>
        </div>
        <Editor.Slate
          addFile={st.do.addFilesOnReport}
          addFilesGql={fetch.addReportFiles}
          onChange={st.do.setReplyContentOnReport}
          defaultValue={reportForm.replyContent ?? ""}
        />
      </Modal>
    </>
  );
};
