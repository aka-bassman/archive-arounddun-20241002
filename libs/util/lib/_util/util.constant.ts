import { Dayjs, Field, Float, Int, Model, dayjs } from "@core/base";

export const unsetDate = dayjs(new Date("0000"));
export const MAX_INT = 2147483647;

export const responsives = ["xl", "lg", "md", "sm", "xs"] as const;
export type Responsive = (typeof responsives)[number];
export const responsiveWidths = [1200, 992, 768, 576, 0] as const;

@Model.Scalar("AccessToken")
export class AccessToken {
  @Field.Prop(() => String)
  jwt: string;
}

@Model.Scalar("AccessStat")
export class AccessStat {
  @Field.Prop(() => Int, { default: 0 })
  request: number;

  @Field.Prop(() => Int, { default: 0 })
  device: number;

  @Field.Prop(() => Int, { default: 0 })
  ip: number;

  @Field.Prop(() => Int, { default: 0 })
  country: number;
}

@Model.Scalar("Coordinate")
export class Coordinate {
  @Field.Prop(() => String, { enum: ["Point"], default: "Point" })
  type: "Point";

  @Field.Prop(() => [Float], { default: [0, 0], example: [127.114367, 37.497114] })
  coordinates: number[];

  @Field.Prop(() => Float, { default: 0 })
  altitude: number;

  static getTotalDistanceKm(...coords: Coordinate[]) {
    return coords.reduce((acc, cur, idx) => {
      if (idx === 0) return 0;
      return acc + this.getDistanceKm(coords[idx - 1], cur);
    }, 0);
  }
  static getDistanceKm(loc1: Coordinate, loc2: Coordinate) {
    const [lon1, lat1] = loc1.coordinates;
    const [lon2, lat2] = loc2.coordinates;
    const R = 6371; // Earth's radius in kilometers
    function toRadians(degrees: number): number {
      return (degrees * Math.PI) / 180;
    }
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  static getBounds(...coordinates: Coordinate[]) {
    const lats = coordinates.map((c) => c.coordinates[1]);
    const lons = coordinates.map((c) => c.coordinates[0]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lons);
    const maxLng = Math.max(...lons);
    return { minLat, maxLat, minLng, maxLng };
  }
  static getAngleDegree(loc1: Coordinate, loc2: Coordinate) {
    const [lon1, lat1] = loc1.coordinates;
    const [lon2, lat2] = loc2.coordinates;
    const y = lat2 - lat1;
    const x = lon2 - lon1;
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return angle;
  }
  static getInterpolation(loc1: Coordinate, loc2: Coordinate, ratio: number): Coordinate {
    const [lon1, lat1] = loc1.coordinates;
    const [lon2, lat2] = loc2.coordinates;
    const lon = lon1 + (lon2 - lon1) * ratio;
    const lat = lat1 + (lat2 - lat1) * ratio;
    return { type: "Point", coordinates: [lon, lat], altitude: 0 };
  }
  static moveMeters(loc: Coordinate, x: number, y: number): Coordinate {
    const [lon, lat] = loc.coordinates;
    const dx = ((x / 1000 / 6371) * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180));
    const dy = (y / 1000 / 6371) * (180 / Math.PI);
    return { ...loc, coordinates: [lon + dx, lat + dy] };
  }
}

@Model.Scalar("AccessLog")
export class AccessLog {
  @Field.Prop(() => Int, { default: 0 })
  period: number;

  @Field.Prop(() => String, { nullable: true })
  countryCode: null | string;

  @Field.Prop(() => String, { nullable: true })
  countryName: null | string;

  @Field.Prop(() => String, { nullable: true })
  city: null | string;

  @Field.Prop(() => Int, { nullable: true })
  postal: null | number;

  @Field.Prop(() => Coordinate, { nullable: true })
  location: null | Coordinate;

  @Field.Prop(() => String, { nullable: true })
  ipv4: null | string;

  @Field.Prop(() => String, { nullable: true })
  state: null | string;

  @Field.Prop(() => String, { nullable: true })
  osName: string | null;

  @Field.Prop(() => String, { nullable: true })
  osVersion: string | null;

  @Field.Prop(() => String, { nullable: true })
  browserName: string | null;

  @Field.Prop(() => String, { nullable: true })
  browserVersion: string | null;

  @Field.Prop(() => String, { nullable: true })
  mobileModel: string | null;

  @Field.Prop(() => String, { nullable: true })
  mobileVendor: string | null;

  @Field.Prop(() => String, { nullable: true })
  deviceType: string | null;

  @Field.Prop(() => Date, { default: () => dayjs() })
  at: Dayjs;
}

export const chainNetworks = ["ethereum-mainnet", "ethereum-sepolia", "klaytn-cypress", "klaytn-baobab"] as const;
export type ChainNetwork = (typeof chainNetworks)[number];

export const chainProviders = ["ethereum", "klaytn"] as const;
export type ChainProvider = (typeof chainProviders)[number];
