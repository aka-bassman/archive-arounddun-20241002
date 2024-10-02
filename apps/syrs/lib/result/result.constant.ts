import { BaseFilter, BaseModel, Field, Full, ID, Int, JSON, Light, Model } from "@core/base";

export const resultStatuses = ["active"] as const;
export type ResultStatus = (typeof resultStatuses)[number];

@Model.Input("ResultInput")
export class ResultInput {
  @Field.Prop(() => ID)
  userId: string;

  @Field.Prop(() => ID)
  testId: string;
}

@Model.Object("ResultObject")
export class ResultObject extends BaseModel(ResultInput) {
  @Field.Prop(() => String, { enum: resultStatuses, default: "active" })
  status: ResultStatus;

  //raw data
  @Field.Prop(() => JSON)
  data: {
    overview: string;
    skinAge: number;
    skinAgingDesc: string;
    skinAgingImprovement: string | null;
    sensitivityDesc: string;
    sensitivityImprovement: string | null;
    oilWaterBalanceDesc: string;
    oilWaterBalanceImprovement: string | null;
    type: "typeA" | "typeB" | "typeC" | "typeD" | "typeE";

    [key: string]: any;
  };

  @Field.Prop(() => String)
  rawResponse: string;

  @Field.Prop(() => String)
  threadId: string;

  @Field.Prop(() => String, { nullable: true })
  prevResultId: string;
}

@Model.Light("LightResult")
export class LightResult extends Light(ResultObject, ["testId", "status"] as const) {}

@Model.Full("Result")
export class Result extends Full(ResultObject, LightResult) {}

@Model.Insight("ResultInsight")
export class ResultInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("ResultSummary")
export class ResultSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalResult: number;
}

@Model.Filter("ResultFilter")
export class ResultFilter extends BaseFilter(Result, {}) {}
