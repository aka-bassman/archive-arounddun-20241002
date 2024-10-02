import { BaseFilter, BaseModel, Field, Full, Int, Light, Model } from "@core/base";
import { cnst as shared } from "@shared";

export const boardStatuses = ["active"] as const;
export type BoardStatus = (typeof boardStatuses)[number];

export const categoryStatuses = ["active"] as const;
export type CategoryStatus = (typeof categoryStatuses)[number];

export const boardViewStyles = ["gallery", "list", "board", "youtube"] as const;
export type BoardViewStyle = (typeof boardViewStyles)[number];

export const boardPolicies = [
  "autoApprove",
  "private",
  "one-one",
  "noti.admin.discord",
  "noti.user.email",
  "noti.user.phone",
] as const;
export type BoardPolicy = (typeof boardPolicies)[number];

@Model.Input("BoardInput")
export class BoardInput {
  @Field.Prop(() => String)
  name: string;

  @Field.Prop(() => String)
  description: string;

  @Field.Prop(() => [String])
  categories: string[];

  @Field.Prop(() => [String], [{ enum: boardPolicies }])
  policy: BoardPolicy[];

  @Field.Prop(() => [String], [{ enum: shared.userRoles }])
  roles: shared.UserRole[];

  @Field.Prop(() => String, { enum: boardViewStyles })
  viewStyle: BoardViewStyle;
}

@Model.Object("BoardObject")
export class BoardObject extends BaseModel(BoardInput) {
  @Field.Prop(() => String, { enum: boardStatuses, default: "active" })
  status: BoardStatus;
}

@Model.Light("LightBoard")
export class LightBoard extends Light(BoardObject, [
  "name",
  "description",
  "categories",
  "viewStyle",
  "policy",
  "roles",
] as const) {
  isPrivate() {
    return this.policy.includes("private");
  }
  canWrite(user?: { roles: string[] }) {
    return user && this.roles.some((role) => user.roles.includes(role));
  }
}

@Model.Full("Board")
export class Board extends Full(BoardObject, LightBoard) {
  static getFromNames(boardList: LightBoard[], names: string[]) {
    return boardList
      .filter((board) => names.includes(board.name))
      .sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name));
  }
  static getBoard(boardList: LightBoard[], boardId: string) {
    return boardList.find((board) => board.id === boardId);
  }
}

@Model.Insight("BoardInsight")
export class BoardInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("BoardSummary")
export class BoardSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalBoard: number;
}

@Model.Filter("BoardFilter")
export class BoardFilter extends BaseFilter(Board, {}) {}
