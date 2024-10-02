import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import { DocumentModel, dayjs } from "@core/base";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { sample, sampleOf } from "@core/common";

export interface UserAgent<Fetch = typeof fetch, User = cnst.User, UserInput = cnst.UserInput> {
  keyring: cnst.Keyring;
  user: User;
  fetch: Fetch;
  accessToken: cnst.util.AccessToken;
  userInput: DocumentModel<UserInput>;
}
export type AdminAgent<Fetch = typeof fetch> = adminSpec.AdminAgent<Fetch>;

export const getUserAgentWithPhone = async <Fetch = typeof fetch, User = cnst.User, UserInput = cnst.UserInput>(
  phoneIdx = 0
): Promise<UserAgent<Fetch, User, UserInput>> => {
  const phone = cnst.MASTER_PHONES[phoneIdx];
  const phoneCode = cnst.MASTER_PHONECODE;
  const userInput = sampleOf(cnst.UserInput);

  // 1. 중복된 폰번호가 있는지 확인
  expect(await fetch.getKeyringIdHasPhone(phone)).toBeFalsy();

  // 2. 폰번호로 키링 생성
  let keyring = await fetch.addPhoneInPrepareKeyring(phone);

  // 3. 폰번호로 인증코드 요청
  const requestAt = await fetch.requestPhoneCode(keyring.id, phone, phoneCode);
  expect(requestAt.isBefore(dayjs())).toBeTruthy();

  // 4. 폰번호로 인증코드 확인
  keyring = await fetch.verifyPhoneCode(keyring.id, phone, phoneCode);
  expect(keyring).toMatchObject({ phone, status: "prepare", verifies: ["phone"] });

  // 5. 키링 정보 업데이트
  const [name, resetEmail, agreePolicies] = [sample.name(), sample.email(), ["privacy", "termsofservice"]];
  keyring = await fetch.updatePrepareKeyring(keyring.id, { name, resetEmail, agreePolicies });
  expect(keyring).toMatchObject({ name, resetEmail, agreePolicies });

  // 6. 키링 활성화
  keyring = await fetch.activateUser(keyring.id);
  expect(keyring.status).toBe("active");
  if (!keyring.phone) throw new Error("keyring.phone is undefined");
  expect(await fetch.getKeyringIdHasPhone(keyring.phone)).toBeTruthy();

  // 7. 로그인
  const accessToken = await fetch.signinWithVerification(keyring.id);
  const userFetch = fetch.clone(accessToken);

  // 8. 디바이스 토큰 추가
  const deviceToken = "dummy";
  expect(await userFetch.addNotiDeviceTokensOfMyKeyring(deviceToken)).toBeTruthy();

  // 9. 유저 정보 확인
  const userInfo = await userFetch.whoAmI();
  //확인필요
  // if (roles.length > 0) {
  //   roles.forEach(async (role) => await userFetch.addUserRole(userInfo.id, role));
  // }
  const user = await userFetch.whoAmI();
  expect(user).toMatchObject({
    keyring: keyring.id,
    status: "active",
    profileStatus: "prepare",
    journeyStatus: "welcome",
    inquiryStatus: "welcome",
    //확인필요
  });

  // 10. 키링 정보 확인
  keyring = await userFetch.myKeyring();
  expect(keyring).toMatchObject({ id: keyring.id, status: "active", user: user.id });

  return {
    keyring,
    user: user as User,
    fetch: userFetch as Fetch,
    accessToken,
    userInput: userInput as unknown as DocumentModel<UserInput>,
  };
};
