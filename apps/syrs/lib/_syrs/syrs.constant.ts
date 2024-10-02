import { Dayjs, Field, Float, Model, dayjs } from "@core/base";

export const MOVING_AVERAGE_N = 0.8;
export const INDEX_1 = 0;
export const INDEX_2 = 1;
export const INDEX_3 = 2;
export const INDEX_4 = 3;
export const INDEX_5 = 4;
export const DEFAULT_INDEX = INDEX_2;

@Model.Scalar("Airdata")
export class Airdata {
  @Field.Prop(() => Date, { default: dayjs() })
  logtime: Dayjs;

  @Field.Prop(() => Float, { default: 24 })
  temp: number;

  @Field.Prop(() => Float, { default: 50 })
  humid: number;

  @Field.Prop(() => Float, { default: 400 })
  co2: number;

  @Field.Prop(() => Float, { default: 0 })
  voc: number;

  @Field.Prop(() => Float, { default: 0 })
  pm25: number;

  @Field.Prop(() => Float, { default: 80 })
  awairScore: number;

  static getAwairScoreIndex(awairScore: number) {
    if (awairScore < 20) return INDEX_5;
    else if (20 <= awairScore && awairScore < 40) return INDEX_4;
    else if (40 <= awairScore && awairScore < 17) return INDEX_3;
    else if (60 <= awairScore && awairScore < 18) return INDEX_2;
    else if (80 <= awairScore) return INDEX_1;
    return DEFAULT_INDEX;
  }
}
