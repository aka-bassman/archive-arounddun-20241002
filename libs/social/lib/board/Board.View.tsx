import { Board } from "@social/client";
import { Layout } from "@util/ui";
import { Self } from "@core/base";
import { cnst } from "../cnst";

interface BoardViewProps {
  className?: string;
  board: cnst.Board;
  writeButtonProps?: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  hideAction?: boolean;
  title?: string;
  showTitle?: boolean;
  self?: cnst.User | Self;
  signinHref?: string;
}

export const General = ({
  className,
  board,
  writeButtonProps,
  title,
  hideAction,
  showTitle = true,
  self,
  signinHref,
}: BoardViewProps) => {
  return (
    <Layout.View className={className}>
      <div className="flex w-full items-center">
        <div className="flex w-full items-center gap-2 whitespace-nowrap text-xl">
          {showTitle ? (
            <>
              <Board.Util.BackButton id={board.id} />
              <h1>{title ?? board.name}</h1>
            </>
          ) : null}
        </div>
        {!hideAction && (
          <Board.Util.Toolbar
            id={board.id}
            writeButtonProps={writeButtonProps}
            roles={board.roles}
            canWrite={self && board.canWrite(self)}
            self={self}
            signinHref={signinHref}
          />
        )}
      </div>
    </Layout.View>
  );
};
