import { RoleType, SignalType, defaultAccount, roleTypes } from "@core/base";
import { RootStore } from "../store";
import { cnst } from "../cnst";
import { defaultPageState, scalarStateOf } from "@core/client";
import { randomString } from "@core/common";

const defaultMessage = {
  type: "info" as "info" | "success" | "error" | "warning" | "loading",
  content: "",
  duration: 3, // seconds
  key: randomString(10),
};

export class UtilStore extends scalarStateOf("util" as const, {
  csrLoaded: false,
  path: "/",
  pathname: "/",
  params: {} as { [key: string]: string },
  searchParams: {} as { [key: string]: string },
  networkType: "debugnet" as "mainnet" | "testnet" | "debugnet",
  whoAmI: async ({ reset }: { reset?: boolean } = {}) => {
    //
  },
  prefix: undefined as string | undefined,
  innerWidth: 0,
  innerHeight: 0,
  responsive: "md" as cnst.Responsive,
  uiOperation: "sleep" as "sleep" | "loading" | "idle",
  messages: [] as (typeof defaultMessage)[],
  utilModal: null as "sider" | null,
  tryJwt: null as string | null,
  trySignalType: "graphql" as SignalType,
  tryRoles: [...roleTypes] as RoleType[],
  tryAccount: defaultAccount,
  pageState: defaultPageState,
  keyboardHeight: 0,
}) {
  setWindowSize() {
    if (typeof window === "undefined") return;
    const responsive = cnst.responsives[cnst.responsiveWidths.findIndex((w) => w < window.innerWidth)];
    this.set({ innerWidth: window.innerWidth, innerHeight: window.innerHeight, responsive });
  }
  showMessage(message: { content: string | string[] } & Partial<typeof defaultMessage>) {
    if (!message.key) message.key = randomString(6);
    const { messages } = this.get() as RootStore;
    const newMessage = { ...defaultMessage, ...message };

    messages.some((m) => m.key === newMessage.key)
      ? this.set({ messages: messages.map((m) => (m.key === newMessage.key ? newMessage : m)) })
      : this.set({ messages: [...(messages.length > 6 ? messages.slice(1) : messages), newMessage] });
  }
  hideMessage(key: string) {
    const { messages } = this.get() as RootStore;
    this.set({ messages: messages.filter((m) => m.key !== key) });
  }
}
