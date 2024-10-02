import { BaseFilter, BaseModel, Dayjs, Field, Full, Int, JSON, Light, Model, dayjs } from "@core/base";
import { cnst as shared } from "@shared";

export const testStatuses = ["active"] as const;
export type TestStatus = (typeof testStatuses)[number];

export const localeStatuses = ["en", "ko", "ja", "th"] as const;
export type LocaleStatus = (typeof localeStatuses)[number];

export interface Answers {
  typeA: number | null;
  typeB: number | null;
  typeC: number | null;
  typeD: number | null;
  typeE: number | null;
}

@Model.Input("TestInput")
export class TestInput {
  @Field.Prop(() => String, { enum: localeStatuses })
  lang: string;

  @Field.Prop(() => String)
  name: string;

  @Field.Prop(() => Date, { default: dayjs("2004-01-01") })
  dateOfBirth: Dayjs;

  @Field.Prop(() => String)
  email: string;

  //testImage
  @Field.Prop(() => shared.File)
  image: shared.File;

  @Field.Prop(() => JSON, { default: { typeA: null, typeB: null, typeC: null, typeD: null } })
  answers: Answers;
}

@Model.Object("TestObject")
export class TestObject extends BaseModel(TestInput) {
  @Field.Prop(() => String, { enum: testStatuses, default: "active" })
  status: TestStatus;

  @Field.Prop(() => Int, { default: 0 })
  type: number;
}

@Model.Light("LightTest")
export class LightTest extends Light(TestObject, ["name", "status"] as const) {}

@Model.Full("Test")
export class Test extends Full(TestObject, LightTest) {}

@Model.Insight("TestInsight")
export class TestInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("TestSummary")
export class TestSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalTest: number;
}

@Model.Filter("TestFilter")
export class TestFilter extends BaseFilter(Test, {}) {}
