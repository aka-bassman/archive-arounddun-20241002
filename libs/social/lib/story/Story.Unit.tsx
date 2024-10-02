import { AiOutlineComment, AiOutlineEye, AiOutlineKey, AiOutlineLike, AiOutlineWechat } from "react-icons/ai";
import { Dayjs } from "@core/base";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { Image, Link, RecentTime } from "@util/ui";
import { ModelProps, clsx } from "@core/client";
import { cnst } from "../cnst";
import { replaceStart, shorten, shortenUnit, toIsoString } from "@core/common";

export const Card = ({ className, story }: ModelProps<"story", cnst.LightStory>) => {
  return <div>{story.id}</div>;
};

export const publicColumns = (l: (key: any, param?: any) => string) => [
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.title")}</div>,
    dataIndex: "title",
    render: (title: string, story: cnst.LightStory, idx: number) => (
      <div>
        <div className={`flex cursor-pointer items-center gap-2`}>
          {story.type === "admin" ? <HiOutlineSpeakerphone /> : <AiOutlineComment />}
          {!!story.category && <span className=" rounded-sm px-2 py-[3px] text-xs">[{story.category}]</span>}
          <div className="hidden max-w-[35vw] truncate md:block">{title}</div>
          <div className="md:hidden">{shorten(title, 20)}</div>
          <div className="text-primary">({story.totalStat.comments})</div>
          {story.isNew() && (
            <div className="bg-primary mt-0.5 flex size-[1.5em] justify-center rounded-full text-[10px] text-white">
              <div className="mt-[-2px]">N</div>
            </div>
          )}
        </div>
        <div className="flex gap-1 text-gray-400 md:hidden">
          <div className="">{shorten(story.user?.nickname ?? "", 10)}</div>
          <div className="flex items-center gap-1">
            | <RecentTime date={story.createdAt} breakUnit="minute" />
          </div>
          <div className="flex items-center gap-1">
            | <AiOutlineEye /> {story.totalStat.views}
          </div>
          <div className="flex items-center gap-1">
            | <AiOutlineLike /> {story.totalStat.likes}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.user")}</div>,
    dataIndex: "user",
    render: (user?: cnst.LightUser) => <div className="flex justify-center">{user?.nickname}</div>,
    responsive: ["xl", "lg", "md"] as cnst.util.Responsive[],
  },
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.view")}</div>,
    dataIndex: "totalStat",
    render: ({ views }: cnst.StoryStat) => <div className="flex justify-center">{views}</div>,
    responsive: ["xl", "lg", "md"] as cnst.util.Responsive[],
  },
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.like")}</div>,
    dataIndex: "totalStat",
    render: ({ likes }: cnst.StoryStat) => <div className="flex justify-center">{likes}</div>,
    responsive: ["xl", "lg", "md"] as cnst.util.Responsive[],
  },
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.dislike")}</div>,
    dataIndex: "totalStat",
    render: ({ unlikes }: cnst.StoryStat) => <div className="flex justify-center">{unlikes}</div>,
    responsive: ["xl", "lg", "md"] as cnst.util.Responsive[],
  },
  {
    title: <div className="flex h-8 justify-center pt-1.5">{l("story.createdAt")}</div>,
    dataIndex: "createdAt",
    render: (createdAt: Date) => (
      <div className="flex justify-center">{<RecentTime date={createdAt} breakUnit="minute" />}</div>
    ),
    responsive: ["xl", "lg", "md"] as cnst.util.Responsive[],
  },
];

export const privateColumns = (l: (key: any, param?: any) => string) => [
  {
    title: l("social.title"),
    dataIndex: "totalStat",
    render: ({ comments }: cnst.StoryStat, { title }: cnst.LightStory) => (
      <div className="flex cursor-pointer items-center gap-2">
        <AiOutlineKey />
        {title} <b className="text-primary">[{comments}]</b>
      </div>
    ),
  },
  {
    title: l("social.author"),
    dataIndex: "user",
    render: (user?: cnst.LightUser) => <span>{replaceStart(user?.nickname ?? "")}</span>,
  },
  {
    title: l("story.view"),
    dataIndex: "totalStat",
    render: ({ views }: cnst.StoryStat) => <span>{views}</span>,
  },
  {
    title: l("story.createdAt"),
    dataIndex: "createdAt",
    render: (createdAt: Date) => <span>{toIsoString(createdAt, true)}</span>,
  },
];

export const selfColumns = (l: (key: any, param?: any) => string) => [
  {
    title: l("story.title"),
    dataIndex: "title",
    key: "title",
  },
  {
    title: l("story.createdAt"),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt: Dayjs) => <RecentTime date={createdAt} />,
  },
];

export const Abstract = ({ className, story, href }: ModelProps<"story", cnst.LightStory>) => {
  return (
    <Link
      className={clsx(
        `@container @md:relative @md:z-0 @md:h-10 flex h-12 cursor-pointer items-center justify-between border-gray-200 px-2 py-8 duration-500 hover:opacity-50`,
        className
      )}
      href={href}
    >
      <div className="w-full ">
        <div className={`flex w-full cursor-pointer items-center justify-between`}>
          <div className="@md:w-1/2 flex w-2/3 items-center gap-1">
            <div>
              {story.type === "admin" ? (
                <HiOutlineSpeakerphone className="mt-0.5" />
              ) : (
                <AiOutlineComment className="mt-0.5" />
              )}
            </div>
            {story.category ? (
              <span className="whitespace-nowrap rounded-sm border border-gray-400 px-2 py-[3px] text-xs">
                {story.category}
              </span>
            ) : null}
            <div className={`max-w-[80%] truncate py-1`}>{story.title}</div>
            <div className="text-primary">({story.totalStat.comments})</div>
            {story.isNew() && (
              <div className="bg-primary mt-1 flex size-4 justify-center rounded-full text-[8px] text-white">
                <div className="mt-px">N</div>
              </div>
            )}
          </div>
          <div className="text-base-content/70 flex justify-end gap-1 text-sm">
            <div className="@md:block mr-1 hidden w-24 truncate">{story.user?.nickname ?? ""}</div>
            <div className="@md:flex mr-1 hidden w-14 items-center gap-1">
              <AiOutlineEye className="mt-0.5" /> {shortenUnit(story.totalStat.views)}
            </div>
            <div className="@md:flex mr-1 hidden w-14 items-center gap-1">
              <AiOutlineLike className="mt-0.5" /> {shortenUnit(story.totalStat.likes)}
            </div>
            <RecentTime
              className="text-base-content whitespace-nowrap text-sm"
              date={story.createdAt}
              breakUnit="minute"
            />
          </div>
        </div>
        <div className="text-base-content/40 @md:hidden flex w-full justify-between gap-4 text-sm">
          <div className="flex gap-1">
            <div className="mr-1 flex w-14 items-center gap-1">
              <AiOutlineEye className="mt-0.5" /> {shortenUnit(story.totalStat.views)}
            </div>
            <div className="mr-1 flex w-14 items-center gap-1">
              <AiOutlineLike className="mt-0.5" /> {shortenUnit(story.totalStat.likes)}
            </div>
          </div>
          <div className="w-full truncate text-end">{story.user?.nickname ?? ""}</div>
        </div>
      </div>
    </Link>
  );
};

export const Gallery = ({ story, href }: ModelProps<"story", cnst.LightStory>) => {
  return (
    <Link
      key={story.id}
      className="border-base-content/20 h-full cursor-pointer overflow-hidden rounded-md border"
      href={href}
    >
      {story.thumbnails[0]?.url || story.images[0]?.url ? (
        <Image
          className="h-[160px] w-full md:h-[260px]"
          src={story.thumbnails[0]?.url ?? story.images[0]?.url}
          width={320}
          height={260}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
        />
      ) : (
        <div className="bg-base-200/20 h-[160px] w-full object-cover md:h-[260px]"></div>
      )}
      <div className="p-4 text-center">
        <div className="bg-base-200/20 text-base-content mx-auto mb-2 w-fit rounded-sm border px-2 text-xs">
          {story.category}
        </div>
        <h3 className="text-lg">{story.title}</h3>
        <p className="text-xs">
          {story.user?.nickname} · {story.createdAt.format("MM-DD")} · {story.totalStat.views} views
        </p>
      </div>
    </Link>
  );
};

export const Youtube = ({ className, story, href }: ModelProps<"story", cnst.LightStory>) => {
  return (
    <Link
      key={story.id}
      className={clsx(
        `border-base-content/20 relative cursor-pointer overflow-hidden rounded-md border duration-300 hover:scale-105`
      )}
      href={href}
    >
      {story.thumbnails[0]?.url && (
        <Image
          className="h-48 w-full object-cover"
          src={story.thumbnails[0]?.url}
          width={377}
          height={200}
          placeholder="blur"
          blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
        />
      )}
      <div className="flex items-center gap-4 p-4 ">
        {story.logo?.url && (
          <div className="-mt-4">
            <Image className="w-[40px] rounded-full object-cover" src={story.logo.url} width={40} height={40} />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-5 flex min-h-[40px] items-center text-sm">
            <div className=" line-clamp-2">{story.title}</div>
          </div>
          <div className="absolute bottom-2 right-0 flex w-full items-center justify-between px-4 text-xs">
            <div className="flex gap-4  text-[14px] text-gray-400">
              <div className="flex gap-1">
                <AiOutlineEye className="" />
                {story.totalStat.views}
              </div>
              <div className="flex gap-1">
                <AiOutlineWechat className="" />
                {story.totalStat.comments}
              </div>
            </div>
            <div className="text-gray-400">
              <RecentTime date={story.createdAt} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
