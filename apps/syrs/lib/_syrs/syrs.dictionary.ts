import { Airdata } from "./syrs.constant";
import { ModelDictionary, scalarDictionaryOf } from "@core/base";

const dictionary = {
  lastConnected: ["LastConnected", "마지막 연결 시각"],
} as const;

const modelDictionary = {
  airdata: scalarDictionaryOf(Airdata, {
    modelName: ["Air Data", "공기질 데이터"],
    modelDesc: ["Air Data", "공기질 데이터"],
    // * ==================== Model ==================== * //
    logtime: ["Logtime", "로그 시간"],
    "desc-logtime": ["Logtime", "로그 시간"],

    temp: ["Temperature", "온도"],
    "desc-temp": ["Temperature", "온도"],

    humid: ["Humid", "습도"],
    "desc-humid": ["Humid", "습도"],

    co2: ["Co2", "이산화탄소"],
    "desc-co2": ["Co2", "이산화탄소"],

    voc: ["Voc", "휘발성 유기 화합물"],
    "desc-voc": ["Voc", "휘발성 유기 화합물"],

    pm25: ["Pm25", "미세먼지"],
    "desc-pm25": ["Pm25", "미세먼지"],

    awairScore: ["AwairScore", "Awair 점수"],
    "desc-awairScore": ["AwairScore", "Awair 점수"],
    // * ==================== Model ==================== * //
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<Airdata>),
} as const;

const signalDictionary = {} as const;

export const syrsDictionary = { syrs: dictionary, ...modelDictionary, ...signalDictionary } as const;
