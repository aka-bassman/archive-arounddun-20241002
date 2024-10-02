/* eslint-disable @nx/workspace/noImportExternalLibrary */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";
import { Inform, Input } from "@util/ui";
import { Keyring } from "@shared/client";
import { Turnstile } from "@marsidev/react-turnstile";
import { env } from "@syrs/env/env.client";
import { fetch, st } from "@syrs/client";
import { isEmail } from "@core/common";
import { router, setAuth } from "@core/client";
import { useState } from "react";

export default function SignUp() {
  const password = st.use.password();
  const passwordConfirm = st.use.passwordConfirm();
  const [agree, setAgree] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });
  const userForm = st.use.userForm();
  const keyringForm = st.use.keyringForm();
  const turnstileToken = st.use.turnstileToken();
  const signupKeyring = st.use.signupKeyring();
  const signup = async () => {
    if (!signupKeyring) return;
    const keyring = await fetch.signupPassword(
      keyringForm.accountId ?? "",
      password,
      turnstileToken ?? "",
      signupKeyring.id
    );
    await fetch.activateUser(keyring.id);
    const { jwt } = await fetch.signinPassword(keyringForm.accountId ?? "", password, turnstileToken ?? "");
    setAuth({ jwt });
    await fetch.updateKeyring(keyring.id, { name: keyringForm.name ?? undefined, agreePolicies: [] });
    const self = await fetch.whoAmI();
    const input = fetch.purifyUser({
      ...self,
      nickname: userForm.nickname,
      requestRoles: [],
    });
    if (input) await fetch.updateUser(self.id, input);
    router.push("/signin");
  };
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <div className="flex items-center justify-center mx-10 align-middle">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center text-3xl font-bold">회원가입</div>
          <div className="flex">
            <div className="flex items-center justify-end mr-4 md:text-base text-[12px] align-baseline w-28">
              이메일
            </div>
            <Input
              className="w-full"
              inputClassName="w-full "
              placeholder="이메일을 입력하세요."
              value={keyringForm.accountId ?? ""}
              onChange={st.do.setAccountIdOnKeyring}
              validate={(value: string) => {
                if (!isEmail(value)) return "이메일 형식이 올바르지 않습니다.";
                else if (value.length < 3 || value.length > 30) return "3자 이상 30자 이내로 입력해주세요.";
                else return true;
              }}
            />
          </div>
          <div className="flex">
            <div className="flex items-center justify-end mr-4 md:text-base text-[12px] align-baseline w-28">
              비밀번호
            </div>
            <Input.Password
              className="w-full"
              inputClassName="w-full"
              value={password}
              onChange={st.do.setPassword}
              validate={(value: string) => {
                if (value.length < 8 || value.length > 20) return "8자 이상 20자 이내로 입력해주세요.";
                else return true;
              }}
            />
          </div>
          <div className="flex">
            <div className="flex items-center justify-end mr-4 md:text-xs text-[10px]  whitespace-nowrap align-baseline w-28">
              비밀번호 확인
            </div>
            <Input.Password
              className="w-full"
              inputClassName="w-full "
              value={passwordConfirm}
              onChange={st.do.setPasswordConfirm}
              validate={(value: string) => {
                if (value !== password) return "입력하신 비밀번호가 일치하지 않습니다.";
                else return true;
              }}
            />
          </div>

          <div className="flex">
            <div className="flex items-center justify-end mr-4 md:text-base text-[12px]  align-baseline w-28">이름</div>
            <Input
              className="w-full"
              inputClassName="w-full"
              value={keyringForm.name ?? ""}
              onChange={st.do.setNameOnKeyring}
              validate={(value: string) => true}
            />
          </div>
          <div className="flex">
            <div className="flex items-center justify-end mr-4 md:text-base text-[12px]  align-baseline w-28">
              닉네임
            </div>
            <Input
              className="w-full"
              inputClassName="w-full"
              value={userForm.nickname}
              onChange={(value) => {
                st.do.setNicknameOnUser(value.replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]|_/g, "").replace(/\s+/g, " "));
              }}
              validate={(value: string) => true}
            />
          </div>
          <Keyring.Util.SignupPhone
            className="gap-3 my-0"
            disabled={
              !keyringForm.accountId?.length ||
              !password.length ||
              password !== passwordConfirm ||
              !keyringForm.name?.length ||
              !userForm.nickname.length
            }
          />
          <div className="flex flex-col items-center w-full px-2">
            <div tabIndex={0} className="max-w-md border collapse collapse-arrow border-base-300 bg-base-100">
              <div className="collapse-title">
                <div className="flex justify-between">
                  서비스 이용약관 (필수)
                  <div className="flex gap-2 items-center">
                    <Input.Checkbox
                      checked={agree.service}
                      onChange={(service) => {
                        setAgree({ ...agree, service });
                      }}
                    />
                    동의함
                  </div>
                </div>
              </div>
              <div className="collapse-content">
                <Inform.ServicePolicy
                  className="overflow-scroll text-xs h-36"
                  companyName="퍼핀플래닛(주)"
                  serviceName="Angelo"
                />
              </div>
            </div>
            <div tabIndex={1} className="max-w-md border collapse collapse-arrow border-base-300 bg-base-100">
              <div className="collapse-title">
                <div className="flex justify-between">
                  개인정보 처리방침 (필수)
                  <div className="flex gap-2 items-center">
                    <Input.Checkbox
                      checked={agree.privacy}
                      onChange={(privacy) => {
                        setAgree({ ...agree, privacy });
                      }}
                    />
                    동의함
                  </div>
                </div>
              </div>
              <div className="collapse-content">
                <Inform.PrivacyPolicy className="overflow-scroll text-xs h-36" companyName="퍼핀플래닛(주)" />
              </div>
            </div>
            <div tabIndex={2} className="max-w-md border collapse collapse-arrow border-base-300 bg-base-100">
              <div className="collapse-title">
                <div className="flex justify-between">
                  마케팅 정보 수신동의 (선택)
                  <div className="flex gap-2 items-center">
                    <Input.Checkbox
                      checked={agree.marketing}
                      onChange={(marketing) => {
                        setAgree({ ...agree, marketing });
                      }}
                    />
                    동의함
                  </div>
                </div>
              </div>
              <div className="collapse-content">
                <Inform.MarketingPolicy
                  className="overflow-scroll text-xs h-36"
                  companyName="퍼핀플래닛(주)"
                  serviceName="Angelo"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 items-center">
            <Input.Checkbox
              checked={agree.marketing && agree.privacy && agree.service}
              onChange={() => {
                setAgree({ service: true, privacy: true, marketing: true });
              }}
            />
            본 내용에 모두 동의합니다.
          </div>
          <Turnstile
            siteKey={env.cloudflare.siteKey}
            options={{ theme: "dark", size: "invisible" }}
            onSuccess={(token) => {
              st.do.setTurnstileToken(token);
            }}
          />
          <div className="flex justify-center w-full">
            <button
              className="h-16 text-2xl w-48 btn btn-primary"
              disabled={!signupKeyring?.verifies.includes("phone") || !agree.service || !agree.privacy}
              onClick={() => signup()}
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
