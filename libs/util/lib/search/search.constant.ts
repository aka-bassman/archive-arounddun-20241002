import { DEFAULT_PAGE_SIZE, Field, Int, JSON, Model, type TextDoc } from "@core/base";

// stats 추가해야함.
@Model.Scalar("SearchResult")
export class SearchResult {
  @Field.Prop(() => [JSON])
  docs: TextDoc[];

  @Field.Prop(() => Int, { default: 0 })
  skip: number;

  @Field.Prop(() => Int, { default: DEFAULT_PAGE_SIZE })
  limit: number;

  @Field.Prop(() => String, { default: "notImplemented" })
  sort: string;

  @Field.Prop(() => Int, { default: 0 })
  total: number;
}
