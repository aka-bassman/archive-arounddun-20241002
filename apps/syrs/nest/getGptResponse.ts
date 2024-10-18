/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import OpenAI from "openai";
import type * as db from "../lib/db";
interface SkinData {
  threadId: string;
  overview: string;
  skinAge: number;
  skinAgingDesc: string;
  skinAgingImprovement: string | null;
  sensitivityDesc: string;
  sensitivityImprovement: string | null;
  oilWaterBalanceDesc: string;
  oilWaterBalanceImprovement: string | null;
  type: "typeA" | "typeB" | "typeC" | "typeD" | "typeE";
  [key: string]: any; // 기타 추가 속성 허용
}
interface GPTResult {
  skinData: SkinData;
  rawResponse: string;
  threadId: string;
}
function isSkinData(data): data is SkinData {
  if (
    typeof data === "object" &&
    data !== null &&
    "overview" in data &&
    "skinAge" in data &&
    "skinAgingDesc" in data &&
    "sensitivityDesc" in data &&
    "oilWaterBalanceDesc" in data &&
    "type" in data
  ) {
    return (
      typeof data.overview === "string" &&
      typeof data.skinAge === "number" &&
      typeof data.skinAgingDesc === "string" &&
      typeof data.sensitivityDesc === "string" &&
      typeof data.oilWaterBalanceDesc === "string" &&
      (data.type === "typeA" ||
        data.type === "typeB" ||
        data.type === "typeC" ||
        data.type === "typeD" ||
        data.type === "typeE")
    );
  }
  return false;
}

function isSkinImprovementData(data): data is SkinData {
  if (
    typeof data === "object" &&
    data !== null &&
    "overview" in data &&
    "skinAge" in data &&
    "skinAgingDesc" in data &&
    "skinAgingImprovement" in data &&
    "sensitivityDesc" in data &&
    "sensitivityImprovement" in data &&
    "oilWaterBalanceDesc" in data &&
    "oilWaterBalanceImprovement" in data &&
    "type" in data
  ) {
    return (
      typeof data.overview === "string" &&
      typeof data.skinAge === "number" &&
      typeof data.skinAgingDesc === "string" &&
      (typeof data.skinAgingImprovement === "string" || data.skinAgingImprovement === null) &&
      typeof data.sensitivityDesc === "string" &&
      (typeof data.sensitivityImprovement === "string" || data.sensitivityImprovement === null) &&
      typeof data.oilWaterBalanceDesc === "string" &&
      (typeof data.oilWaterBalanceImprovement === "string" || data.oilWaterBalanceImprovement === null) &&
      (data.type === "typeA" ||
        data.type === "typeB" ||
        data.type === "typeC" ||
        data.type === "typeD" ||
        data.type === "typeE")
    );
  }
  return false;
}
export const getGptResponse = async (test: db.Test, prompt: db.Prompt, imageUrl: string): Promise<GPTResult | null> => {
  const openai = new OpenAI({ apiKey: prompt.apiKey });
  const thread = await openai.beta.threads.create();

  const phase1Text = `phase1: {username : ${test.name},dateOfBirth: ${test.dateOfBirth},typeA:${test.answers.typeA},typeB:${test.answers.typeB},typeC:${test.answers.typeC},typeD:${test.answers.typeD},typeE:${test.answers.typeE}} 답변Json의 key는 입력값 그 대로하되 value들은 ${test.lang}언어로 작성부탁해. 이름이 뭐든간에 ${test.lang}언어로 부탁할게 `;

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: [
      {
        type: "text",
        text: phase1Text,
      },
      {
        type: "image_url",
        image_url: { url: imageUrl },
      },
    ],
  });

  return new Promise<GPTResult | null>((resolve, reject) => {
    const outputParts: string[] = []; // 문자열을 저장할 배열

    const run = openai.beta.threads.runs
      .stream(thread.id, {
        assistant_id: prompt.assistantId,
      })
      .on("textCreated", (text) => {
        outputParts.push("startedText\n");
      })
      .on("textDelta", (textDelta, snapshot) => {
        if (!textDelta.value) return;
        outputParts.push(textDelta.value);
      })
      .on("error", (e) => {
        reject(errors.apiError(e.message, thread.id));
      })
      .on("end", () => {
        outputParts.push("\nfin");
        const outputText = outputParts.join(""); // 모든 문자열을 합쳐 하나의 문자열로

        // JSON 부분만 추출하여 파싱
        const jsonStart = outputText.indexOf("{");
        const jsonEnd = outputText.lastIndexOf("}") + 1;

        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = outputText.slice(jsonStart, jsonEnd);
          const jsonObject: unknown = JSON.parse(jsonString);

          if (!isSkinData(jsonObject)) {
            reject(
              errors.jsonParseError(
                "JSON parsing failed. The JSON is not in the expected format." + outputText,
                thread.id
              )
            );
          } else {
            jsonObject.threadId = thread.id; // threadId 추가
            resolve({
              skinData: jsonObject,
              rawResponse: outputText,
              threadId: thread.id,
            });
          }
        } else {
          reject(
            errors.unknownError(
              "JSON not found in the output. The output is not in the expected format." + outputText,
              thread.id
            )
          );
        }
      });
  });
};

export const getGptPhase2Response = async (
  result: db.Result,
  prompt: db.Prompt,
  imageUrl: string,
  lang: string
): Promise<GPTResult | null> => {
  const openai = new OpenAI({ apiKey: prompt.apiKey });

  const phase2Text = `phase2 진행해줘 답변은 지난번과 같은 ${lang}언어으로 부탁할게 이름이 어느언어든간에 ${lang}언어로 부탁할게`;

  const message = await openai.beta.threads.messages.create(result.threadId, {
    role: "user",
    content: [
      {
        type: "text",
        text: phase2Text,
      },
      {
        type: "image_url",
        image_url: { url: imageUrl },
      },
    ],
  });

  return new Promise<GPTResult | null>((resolve, reject) => {
    const outputParts: string[] = []; // 문자열을 저장할 배열

    const run = openai.beta.threads.runs
      .stream(result.threadId, {
        assistant_id: prompt.assistantId,
      })
      .on("textCreated", (text) => {
        outputParts.push("startedText\n");
      })
      .on("textDelta", (textDelta, snapshot) => {
        if (!textDelta.value) return;
        outputParts.push(textDelta.value);
      })
      .on("end", () => {
        outputParts.push("\nfin");
        const outputText = outputParts.join(""); // 모든 문자열을 합쳐 하나의 문자열로

        // JSON 부분만 추출하여 파싱
        const jsonStart = outputText.indexOf("{");
        const jsonEnd = outputText.lastIndexOf("}") + 1;

        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonString = outputText.slice(jsonStart, jsonEnd);
          const jsonObject: unknown = JSON.parse(jsonString);

          if (!isSkinImprovementData(jsonObject)) {
            reject(
              errors.jsonParseError(
                "JSON parsing failed. The JSON is not in the expected format." + outputText,
                result.threadId
              )
            );
          } else {
            jsonObject.threadId = result.threadId; // threadId 추가
            resolve({
              skinData: jsonObject,
              rawResponse: outputText,
              threadId: result.threadId,
            });
          }
        } else {
          reject(
            errors.unknownError(
              "JSON not found in the output. The output is not in the expected format." + outputText,
              result.threadId
            )
          );
        }
      })
      .on("error", (e) => {
        reject(errors.apiError(e.message, result.threadId));
      });
  });
};

interface ErrorResult {
  apiError: (message: string, threadId: string) => Error;
  jsonParseError: (message: string, threadId: string) => Error;
  unknownError: (message: string, threadId: string) => Error;
}
const errors: ErrorResult = {
  apiError: (message: string, threadId: string) => {
    return new Error(`API Error: ${message}, threadId: ${threadId}`);
  },
  jsonParseError: (message, threadId) => {
    return new Error(`JsonParseError: ${message}, threadId: ${threadId}`);
  },
  unknownError: (message, threadId) => {
    return new Error(`unknownError: ${message}, threadId: ${threadId}`);
  },
};
