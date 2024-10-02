"use client";
import { AiOutlineComment, AiOutlineDislike, AiOutlineEye, AiOutlineLike } from "react-icons/ai";
import { ClientInit, ClientView, Dayjs, DefaultOf } from "@core/base";
import { Comment, Story, cnst, usePage } from "@social/client";
import { Data, Load } from "@shared/ui";
import { Layout, Link, Table as UtilTable } from "@util/ui";
import { ModelsProps, router } from "@core/client";

export const Admin = ({ sliceName = "story", init, query }: ModelsProps<cnst.Story>) => {
  // const boardMap = st.use.boardMap();
  // useEffect(() => {
  //   void st.do.initBoard({});
  // }, []);
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      type="list"
      // filterOptions={[
      //   { key: "All", query: query ?? {} },
      //   ...[...boardMap.values()].map((board) => ({
      //     key: board.name,
      //     query: { ...(query ?? {}), root: board.id },
      //   })),
      // ]}
      renderItem={Story.Unit.Card}
      renderDashboard={Story.Util.Stat}
      renderInsight={Story.Util.Insight}
      renderTemplate={Story.Template.Admin}
      renderTitle={(story: DefaultOf<cnst.Story>) => story.title}
      renderView={(story: cnst.Story) => (
        <div>
          <Story.View.General story={story} />
          <Comment.Zone.Admin query={{ root: story.id }} />
        </div>
      )}
      columns={[
        { key: "title", render: (title: string) => <div className="w-96 truncate">{title}</div> },
        {
          key: "totalStat",
          render: (totalStat: cnst.StoryStat) => (
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                <AiOutlineEye /> {totalStat.views}
              </span>
              <span className="flex items-center gap-1">
                <AiOutlineLike /> {totalStat.likes}
              </span>
              <span className="flex items-center gap-1">
                <AiOutlineDislike /> {totalStat.unlikes}
              </span>
              <span className="flex items-center gap-1">
                <AiOutlineComment /> {totalStat.comments}
              </span>
            </div>
          ),
        },
        "rootType",
        {
          key: "user",
          render: (user: cnst.shared.LightUser) => <div key={user.id}>{user.nickname}</div>,
        },
        {
          key: "createdAt",
          render: (createdAt: Dayjs) => createdAt.format("YYYY-MM-DD HH:mm:ss"),
        },
        "status",
      ]}
      actions={(story: cnst.Story, idx: number) => [
        "edit",
        "remove",
        "view",
        ...(story.status === "active"
          ? [
              {
                type: "approve",
                render: () => <Story.Util.Approve id={story.id} />,
              },
              {
                type: "deny",
                render: () => <Story.Util.Deny id={story.id} />,
              },
            ]
          : story.status === "approved"
            ? [
                {
                  type: "deny",
                  render: () => <Story.Util.Deny id={story.id} />,
                },
              ]
            : [
                // denied
                {
                  type: "approve",
                  render: () => <Story.Util.Approve id={story.id} />,
                },
              ]),
      ]}
    />
  );
};

interface StoryZoneInSelfProps {
  init: ClientInit<"story", cnst.LightStory>;
}
export const InSelf = ({ init }: StoryZoneInSelfProps) => {
  const { l } = usePage();
  return (
    <Load.Units
      init={init}
      renderList={(storyList) => (
        <UtilTable
          dataSource={storyList}
          columns={Story.Unit.selfColumns(l)}
          size="small"
          onRow={(story: cnst.LightStory) => ({
            onClick: () => router.push(`/${story.rootType}/${story.root}/story/${story.id}`),
          })}
          rowClassName={(_, idx) => `h-12 cursor-pointer ${idx % 2 ? "bg-gray-50" : ""}`}
        />
      )}
    />
  );
};
interface TableProps {
  init: ClientInit<"story", cnst.LightStory>;
  isPrivate?: boolean;
}
export const Table = ({ init, isPrivate }: TableProps) => {
  const { l } = usePage();

  return (
    <Load.Units
      init={init}
      renderList={(storyList) => (
        <>
          <div className="hidden w-full justify-center md:flex">
            <UtilTable
              dataSource={storyList}
              columns={isPrivate ? Story.Unit.privateColumns(l) : Story.Unit.publicColumns(l)}
              size="small"
              showHeader={["md", "lg", "xl"]}
              onRow={(story: cnst.LightStory) => ({
                onClick: () => router.push(`/${story.rootType}/${story.root}/story/${story.id}`),
              })}
              rowClassName={(story, idx) => ` h-12 cursor-pointer ${idx % 2 ? "bg-base-200/20" : "bg-base-100"}`}
            />
          </div>

          <div className="block md:hidden">
            <div className="relative mx-2 border-t ">
              <div className="flex w-full items-center justify-center border-b border-gray-300 py-2 text-sm text-gray-400">
                {l("story.title")}
              </div>
              {storyList.map((story, idx) => (
                <Link key={story.id} href={`/${story.rootType}/${story.root}/story/${story.id}`}>
                  <button className="border-base-content/20 flex w-full items-center gap-2 border-b py-2 ">
                    <div className="text-md ml-3  truncate text-start ">{story.title}</div>
                    <div className=" text-primary  text-md">({story.totalStat.comments})</div>
                    {/* {story.isNew() && <Image src="/new.svg" width={20} height={20} />} */}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    />
  );
};
interface GalleryProps {
  init: ClientInit<"story", cnst.LightStory>;
}
export const Gallery = ({ init }: GalleryProps) => {
  return (
    <Load.Units
      init={init}
      noDiv
      renderItem={(story, idx) => (
        <Story.Unit.Gallery key={story.id} href={`/${story.rootType}/${story.root}/story/${story.id}`} story={story} />
      )}
    />
  );
};

interface YoutubeProps {
  init: ClientInit<"story", cnst.LightStory>;
}
export const Youtube = ({ init }: YoutubeProps) => {
  return (
    <Load.Units
      init={init}
      noDiv
      renderItem={(story, idx) => (
        <Story.Unit.Youtube key={story.id} href={`/${story.rootType}/${story.root}/story/${story.id}`} story={story} />
      )}
    />
  );
};

interface AbstractProps {
  className?: string;
  init: ClientInit<"story", cnst.LightStory>;
}
export const Abstract = ({ className, init }: AbstractProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderList={(storyList) => (
        <>
          {storyList.map((story, idx) => (
            <Story.Unit.Abstract
              className={`${idx + 1 < storyList.length && "border-b"}`}
              key={idx}
              story={story}
              href={`/${story.rootType}/${story.root}/story/${story.id}`}
            />
          ))}
        </>
      )}
    />
  );
};

interface ViewProps {
  view: ClientView<"story", cnst.Story>;
  self?: { id: string };
  back?: boolean;
  showLikeDislike?: boolean;
}
export const View = ({ view, self, back, showLikeDislike }: ViewProps) => {
  return (
    <Load.View
      view={view}
      renderView={(story) => (
        <Story.View.General story={story} self={self} back={back} showLikeDislike={showLikeDislike} />
      )}
    />
  );
};

interface InBoardProps {
  init: ClientInit<"story", cnst.LightStory>;
  viewStyle: cnst.BoardViewStyle;
  count: number;
}
export const InBoard = ({ init, viewStyle, count }: InBoardProps) => {
  return (
    <Layout.Zone>
      {viewStyle === "list" ? (
        <Story.Zone.Table init={init} />
      ) : viewStyle === "gallery" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <Story.Zone.Gallery init={init} />
        </div>
      ) : viewStyle === "youtube" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <Story.Zone.Youtube init={init} />
        </div>
      ) : (
        <></>
      )}
      <div className="bottom-0 mb-5 w-full px-2 md:px-32 ">
        <Story.Util.Search className="w-full" />
      </div>
    </Layout.Zone>
  );
};
