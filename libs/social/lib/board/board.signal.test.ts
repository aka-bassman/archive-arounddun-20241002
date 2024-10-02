import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as userSpec from "@shared/lib/user/user.signal.spec";
import { AdminAgent, UserAgent } from "../user/user.signal.spec";
import { cnst } from "../cnst";
import { errorBoard, updateUserBoard } from "./board.signal.spec";
import { sampleOf } from "@core/common";

describe("BoardSignal", () => {
  let adminAgent: AdminAgent, userAgent: UserAgent, board: cnst.Board;

  beforeAll(async () => {
    adminAgent = await adminSpec.getAdminAgentWithInitialize();
    userAgent = await userSpec.getUserAgentWithPhone();
  });

  it("admin generate board", async () => {
    const boardInput: cnst.BoardInput = { ...sampleOf(cnst.BoardInput), roles: ["user", "admin"] };
    board = await adminAgent.fetch.createBoard(boardInput);
    expect(board.name).toEqual(boardInput.name);
  });

  it("update board admin ", async () => {
    board = await updateUserBoard(adminAgent, board);
    expect(board.name).toEqual("updateBoard");
    expect(board.description).toEqual("updated test description");
    expect(board.roles).toEqual(["admin"]);
  });

  it("remove board admin ", async () => {
    const removedBoard = await adminAgent.fetch.removeBoard(board.id);
    expect(removedBoard.removedAt).toBeTruthy();
  });

  it("error w when user create board", async () => {
    await errorBoard(userAgent);
  });
});
