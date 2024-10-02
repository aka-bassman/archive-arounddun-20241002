import { AdminAgent, UserAgent } from "@social/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createUserBoard = async (adminAgent: AdminAgent) => {
  const boardInput: cnst.BoardInput = { ...sampleOf(cnst.BoardInput), roles: ["user", "admin"] };
  const board = await adminAgent.fetch.createBoard(boardInput);
  return board;
};

export const updateUserBoard = async (adminAgent: AdminAgent, board: cnst.Board) => {
  const updatedBoard = await adminAgent.fetch.updateBoard(board.id, {
    name: "updateBoard",
    description: "updated test description",
    categories: [],
    policy: [],
    roles: ["admin"],
    viewStyle: "list",
  });
  return updatedBoard;
};
export const errorBoard = async (userAgent: UserAgent) => {
  await expect(
    userAgent.fetch.createBoard({
      name: "testBoard",
      description: "test description",
      categories: [],
      policy: [],
      roles: ["user", "admin"],
      viewStyle: "list",
    })
  ).rejects.toThrow();
};
