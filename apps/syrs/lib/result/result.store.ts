import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { cnst as shared } from "@shared";

@Store(() => cnst.Result)
export class ResultStore extends stateOf(fetch.resultGql, {
  // state
  improvementImage: null as shared.File | null,
}) {
  // action
  async calculateResult(
    testId: string,
    userId: string,
    onSuccess?: (result: cnst.Result) => void | Promise<void>,
    onFailed?: (error: Error) => void | Promise<void>
  ) {
    await fetch
      .calculateResult(testId, userId)
      .then(async (result) => {
        this.setResult(result);
        onSuccess && (await onSuccess(result));
      })
      .catch(async (error: unknown) => {
        if (error instanceof Error) {
          onFailed && (await onFailed(error));
        }
      });

    return;
  }
  async calculateImprvement(
    resultId: string,
    imageId: string,
    onSuccess?: (result: cnst.Result) => void | Promise<void>,
    onFailed?: (error: Error) => void | Promise<void>
  ) {
    await fetch
      .calculateImprvement(resultId, imageId)
      .then(async (result) => {
        this.setResult(result);
        onSuccess && (await onSuccess(result));
      })
      .catch(async (error: unknown) => {
        if (error instanceof Error) {
          onFailed && (await onFailed(error));
        }
      });

    return;
  }

  async setImprovementImage(image: shared.File | null, onSuccess?: (image: shared.File) => void | Promise<void>) {
    this.set({ improvementImage: image });
    onSuccess && (await onSuccess(image));
  }
}
