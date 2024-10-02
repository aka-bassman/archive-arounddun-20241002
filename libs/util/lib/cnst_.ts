import { client } from "@core/common";

const nativeFetch = fetch;
const customFetch = Object.assign(nativeFetch, {
  client,
  clone: function (option: { jwt?: string | null } = {}) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...this,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      client: this.client.clone(option),
    };
  },
});
export { customFetch as fetch };
export * from "./_util/util.constant";
export * from "./localFile/localFile.constant";
export * from "./security/security.constant";
export * from "./search/search.constant";
