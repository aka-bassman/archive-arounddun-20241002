"use client";
import { Board, Story, cnst, st } from "@social/client";
import { ClientView, DefaultOf, Self } from "@core/base";
import { Data, Load } from "@shared/ui";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "board", init, query }: ModelsProps<cnst.Board>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Board.Unit.Card}
      renderDashboard={Board.Util.Stat}
      renderInsight={Board.Util.Insight}
      renderTemplate={Board.Template.General}
      renderTitle={(board: DefaultOf<cnst.Board>) => board.name}
      renderView={(board: cnst.Board) => <Board.View.General board={board} />}
      columns={["description", "viewStyle", "policy", "roles"]}
      actions={["edit", "remove"]}
    />
  );
};
interface ViewProps {
  className?: string;
  view: ClientView<"board", cnst.Board>;
  title?: string;
  account?: Self;
  showTitle?: boolean;
  signinHref?: string;
}
export const View = ({ className, view, title, account, showTitle = true, signinHref }: ViewProps) => {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const self = storeUse.self<cnst.User>();
  return (
    <Load.View
      view={view}
      renderView={(board) => (
        <Board.View.General
          showTitle={showTitle}
          className={className}
          board={board}
          self={self.id ? self : account}
          title={title}
          signinHref={signinHref}
        />
      )}
    />
  );
};

interface StoryListProps {
  view: ClientView<"board", cnst.Board>;
  storyList: cnst.LightStory[];
}

export const StoryList = ({ view, storyList }: StoryListProps) => {
  return (
    <Load.View
      view={view}
      renderView={(board) => (
        <>
          {storyList.map((story) => (
            <Story.Unit.Abstract href={`/board/${board.id}/story/${story.id}`} key={story.id} story={story} />
          ))}
        </>
      )}
    />
  );
};
