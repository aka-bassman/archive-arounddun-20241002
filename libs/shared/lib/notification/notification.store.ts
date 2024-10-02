import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Notification)
export class NotificationStore extends stateOf(fetch.notificationGql, {
  // state
}) {
  // action
}
