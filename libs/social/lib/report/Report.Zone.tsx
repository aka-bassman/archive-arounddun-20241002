"use client";
import { ClientInit, ClientView, Dayjs } from "@core/base";
import { Comment, Report, Story, cnst, st, usePage } from "@social/client";
import { Data, Load, Model } from "@shared/ui";
import { ModelsProps, clsx, router } from "@core/client";
import { RecentTime, Table } from "@util/ui";
import { useEffect } from "react";

export const Admin = ({ sliceName = "report", init, query }: ModelsProps<cnst.Report>) => {
  const { l } = usePage();
  const View = ({ report }: { report: cnst.Report }) => {
    const comment = st.use.comment();
    const story = st.use.story();
    useEffect(() => {
      if (!report.target) return;
      if (report.type === "comment") void st.do.viewComment(report.target);
      if (report.type === "story") void st.do.viewStory(report.id);
    }, [report]);
    return (
      <Model.ViewModal
        id={report.id}
        sliceName={sliceName}
        renderTitle={(report: cnst.Report) => `${l("report.modelName")} - ${report.title}`}
        renderView={() => (
          <>
            {report.type === "comment" && comment && <Comment.View.General comment={comment} />}
            {report.type === "story" && story && <Story.View.General story={story} />}
            <Report.View.General report={report} />
          </>
        )}
      />
    );
  };
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Report.Unit.Card}
      renderDashboard={Report.Util.Stat}
      renderInsight={Report.Util.Insight}
      renderView={(report: cnst.Report) => <View report={report} />}
      type="list"
      columns={[
        "title",
        "type",
        "createdAt",
        {
          key: "replyFrom",
          render: (replyFrom?: cnst.shared.LightAdmin) => replyFrom?.accountId ?? "",
        },
        "status",
      ]}
      actions={(report: cnst.LightReport, idx) => [
        "remove",
        "view",
        ...(report.status === "active"
          ? [
              { type: "resolve", render: () => <Report.Util.Resolve report={report} /> },
              { type: "process", render: () => <Report.Util.Process report={report} /> },
            ]
          : [{ type: "resolve", render: () => <Report.Util.Resolve report={report} /> }]),
      ]}
    />
  );
};

export const ForMe = ({ className, init }: { className?: string; init: ClientInit<"report", cnst.LightReport> }) => {
  const { l } = usePage();
  return (
    <Load.Units
      init={init}
      renderList={(reportList) => (
        <Table
          dataSource={reportList}
          columns={[
            {
              title: l("report.title"),
              dataIndex: "title",
              key: "title",
            },
            {
              title: l("report.createdAt"),
              dataIndex: "createdAt",
              key: "createdAt",
              render: (createdAt: Dayjs) => <RecentTime date={createdAt} breakUnit="minute" />,
            },
            {
              title: l("report.status"),
              dataIndex: "status",
              key: "status",
              render: (_, { status }: cnst.LightReport) => (
                <div
                  className={clsx(
                    "badge badge-outline mr-1 p-3",
                    status === "resolved" ? "badge-success" : status === "inProgress" ? "badge-warning" : ""
                  )}
                >
                  {status}
                </div>
              ),
            },
          ]}
          size="small"
          onRow={(report: cnst.LightReport, idx) => ({ onClick: () => router.push(`/report/${report.id}`) })}
          rowClassName={(_, idx) => `h-12 cursor-pointer ${idx % 2 ? "bg-base-100/10" : ""}`}
        />
      )}
    />
  );
};
interface ViewProps {
  className?: string;
  view: ClientView<"report", cnst.Report>;
  self?: { id: string };
}
export const View = ({ className, view, self }: ViewProps) => {
  return (
    <Load.View view={view} renderView={(report) => <Report.View.General report={report} isMe={report.isMe(self)} />} />
  );
};
