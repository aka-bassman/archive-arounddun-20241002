import { Store, scalarStateOf } from "@core/client";

@Store({ name: "syrs" })
export class SyrsStore extends scalarStateOf("syrs" as const, {
  // state
  isSmall: false,
}) {
  setIsSmall(isSmall: boolean) {
    this.set({ isSmall });
  }
  // action
}
