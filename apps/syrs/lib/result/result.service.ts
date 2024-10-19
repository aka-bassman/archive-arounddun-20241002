import * as db from "../db";
import { DbService, Service, Srv, Use } from "@core/server";
import { GmailApi } from "@util/nest";
import { cnst } from "../cnst";
import { getGptPhase2Response, getGptResponse } from "@syrs/nest/getGptResponse";
import type * as srv from "../srv";
import { lowerCase } from "lodash";

@Service("ResultService")
export class ResultService extends DbService(db.resultDb) {
  // @Use() protected readonly injectedVar: string;
  // @Srv() protected readonly otherService: srv.OtherService;
  @Srv() protected readonly testService: srv.TestService;
  @Srv() protected readonly promptService: srv.PromptService;
  @Srv() protected readonly fileService: srv.shared.FileService;
  @Srv() protected readonly imageHostingService: srv.ImageHostingService;
  @Use() protected readonly gmailApi: GmailApi;
  async pollingFileActivated(fileId: string): Promise<db.shared.File | undefined> {
    const interval = 1000;
    // polling limit
    const limit = 10;
    let count = 0;
    return new Promise((resolve, reject) => {
      const timer = setInterval(async () => {
        const file = await this.fileService.getFile(fileId);
        if (file?.status === "active") {
          clearInterval(timer);
          this.logger.info("File activated : " + file.url);
          resolve(file);
        }
        // polling limit
        if (count >= limit) {
          clearInterval(timer);
          reject(new Error("File activation failed"));
        }
        count++;
      }, interval);
    });
  }
  async summarize(): Promise<cnst.ResultSummary> {
    return {
      ...(await this.resultModel.getSummary()),
    };
  }
  async calculateResult(testId: string, userId: string): Promise<db.Result> {
    const test = await this.testService.getTest(testId);
    const prompt = await this.promptService.getDefaultPrompt();
    const image = await this.pollingFileActivated(test.image);
    if (!image) {
      throw new Error("Image activation failed");
    }
    const imageUrl = image.url.toLowerCase();
    this.logger.info(`Calculating result for test ${testId} and testName ${test.name} url ${imageUrl} test`);
    const gptJson = await getGptResponse(test, prompt, imageUrl).catch((e: unknown) => {
      this.logger.error((e as Error).message + "calculation failed");
      throw e;
    });
    if (!gptJson) {
      this.logger.error("GPT Response is empty or invalid");
      throw new Error("GPT Response is empty or invalid");
    }
    const result = await this.resultModel.createResult({
      testId: testId,
      userId: userId,
      data: gptJson.skinData,
      rawResponse: gptJson.rawResponse,
      threadId: gptJson.threadId,
    });
    if (result.data.error) {
      return result;
    }
    // void this.gmailApi
    //   .sendMail({
    //     to: test.email,
    //     subject: "SYRS 피부 검사지",
    //     html: `${process.env.basePath}/result/${result.id}`,
    //   })
    //   .catch((e: unknown) => {
    //     this.logger.error((e as Error).message);
    //   });
    return result;
  }
  async calculateImprvement(resultId: string, imageId: string): Promise<db.Result> {
    const result = await this.resultModel.getResult(resultId);
    const prompt = await this.promptService.getDefaultPrompt();
    const test = await this.testService.getTest(result.testId);

    const image = await this.pollingFileActivated(imageId);
    if (!image) {
      throw new Error("Image activation failed");
    }
    const imageUrl = image.url.toLowerCase();

    this.logger.info(`Calculating result for test ${result.testId} and testName ${test.name} url ${imageUrl} test`);
    const gptJson = await getGptPhase2Response(result, prompt, imageUrl, test.lang).catch((e: unknown) => {
      this.logger.error((e as Error).message + "calculation failed");
      throw e;
    });
    if (!gptJson) {
      throw new Error("GPT Response is empty or invalid");
    }
    const updatedResult = await this.resultModel.createResult({
      testId: result.testId,
      userId: result.userId,
      data: gptJson.skinData,
      rawResponse: gptJson.rawResponse,
      threadId: gptJson.threadId,
      prevResultId: resultId,
    });
    if (updatedResult.data.error) {
      return result;
    }
    const footerId = await this.imageHostingService.__find({ name: "emailFooter" });
    const mobileFooterId = await this.imageHostingService.__find({ name: "emailMobileFooter" });
    const footerUrl = footerId && (await this.fileService.getFile(footerId?.image)).url;
    const mobileFooterUrl = mobileFooterId && (await this.fileService.getFile(mobileFooterId?.image)).url;
    const locale = {
      en: {
        title: `Thank you for visiting SYRS, ${test.name}.`,
        content: `
          <p>Please check the results of your skin diagnosis test and receive your SYRS Sincere Kit, tailored to your skin type.</p>
          <p>A SYRS skin consultant will thoughtfully prepare it according to the specifics of your skin diagnosis.</p>
          <p>For more detailed information about the products, click on the recommended products.</p>
          <p>Sincere mind for your skin, SYRS</p>
        `,
        buttonText: "Check Skin Type",
      },
      ko: {
        title: `${test.name}님 시르즈를 방문해주셔서 감사합니다.`,
        content: `
          <p>피부 진단 테스트 결과를 확인하고 피부 타입에 맞는 시르즈의 신시어 키트를 받아가세요.</p>
          <p>${test.name}님의 피부 진단에 맞춰 시르즈의 스킨 컨설턴트가 정성스럽게 준비해드립니다.</p>
          <p>제품에 대한 자세한 정보는 추천 제품을 클릭하여 확인할 수 있습니다.</p>
          <p>Sincere mind for your skin, SYRS</p>
        `,
        buttonText: "피부 타입 확인하기",
      },
      ja: {
        title: `${test.name}様、SYRSをご訪問いただきありがとうございます。`,
        content: `
          <p>お肌の診断テストの結果をご確認いただき、お肌のタイプに合わせたSYRSのシンシアキットをお受け取りください。</p>
          <p>お客様の肌診断に基づいて、SYRSのスキンコンサルタントが心を込めて準備いたします。</p>
          <p>製品についての詳細情報は、おすすめの製品をクリックしてご確認ください。</p>
          <p>あなたの肌のための誠実な心、SYRS</p>
        `,
        buttonText: "肌タイプを確認",
      },
      th: {
        title: `ขอขอบคณุ ${test.lang} ทม่ีาเยอืน SYRS`,
        content: `
          <p>โปรดตรวจสอบผลการทดสอบวนิจิฉยัผวิของคณุ และรบัชุดSincereKitของSYRS ทป่ีรบัใหเ้หมาะกบัประเภทผวิของคณุ</p>
          <p>ทป่ีรกึษาดา้นผวิพรรณของSYRSจะเตรยีมสง่ิทด่ีทีส่ีดุ อยา่งพถิพีถินัตามผลการวนิจิฉยัผวิของคณุ</p>
          <p>สําหรบัขอ้มูลเพม่ิเตมิเกย่ีวกบัผลิตภณั ฑ์คลิกทผ่ีลิตภณั ฑแ์ นะนําเพ่อืตรวจสอบ</p>
          <p>จติใจทจ่ีรงิใจเพ่อืผวิของคณุ ,SYRS</p>
        `,
        buttonText: "ตรวจสอบประเภทผิว",
      },
    };

    void this.gmailApi
      .sendMail({
        from : "ai@syrs.kr",
        to: test.email,
        subject: `[SYRS] ${test.name}님의 피부 진단 결과를 확인하세요.`,
        html: `<!DOCTYPE html>
<html lang=${test.lang}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    @media only screen and (max-width: 600px) {
      .mobile-header h1 {
        font-size: 20px !important;
      }
      .mobile-content p {
        font-size: 14px !important;
      }
      .mobile-button {
        font-size: 14px !important;
        width: 80% !important;
      }
      .mobile-footer-image {
        content: url(${`"${mobileFooterUrl}"`});
      }
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    <div class="mobile-header" style="text-align: left; padding: 20px 0;">
      <h1 style="font-size: 24px; margin: 0; color: #333333;">${locale[test.lang].title}</h1>
    </div>
    <div class="mobile-content" style="font-size: 16px; color: #666666; line-height: 1.5;">
      ${locale[test.lang].content}
      <a href=${`"https://ai.syrs.kr/${test.lang}/result/${updatedResult.id}"`} class="mobile-button" style="display: block; margin: 20px auto; padding: 10px 20px; background-color: #d5c4b4; color: #ffffff; text-align: center; text-decoration: none; border-radius: 5px; font-size: 16px;">${locale[test.lang].buttonText}</a>
    </div>
    <img src=${`"${footerUrl}"`} alt="Footer Image" class="mobile-footer-image" style="width: 100%; max-width: 1000px; height: auto; display: block; margin-top: 20px;">
  </div>
</body>
</html>`,
      })
      .catch((e: unknown) => {
        this.logger.error((e as Error).message);
      });
    return updatedResult;
  }
}
