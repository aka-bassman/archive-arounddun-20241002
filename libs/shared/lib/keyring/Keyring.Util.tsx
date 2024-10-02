"use client";
import {
  AiFillCheckCircle,
  AiFillGithub,
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineLock,
  AiOutlineMail,
  AiOutlineSave,
} from "react-icons/ai";
import { AreYouRobot, CodeInput, Icon, Input, Link, Loading, Modal, Popconfirm, Radio } from "@util/ui";
import { Data, Model, Web3 } from "@shared/ui";
import { Keyring, cnst, fetch, st, usePage } from "@shared/client";
import { Logger, formatPhone, isEmail, isPhoneNumber, pad } from "@core/common";
import { LoginForm, useInterval, usePushNoti } from "@core/next";
import { ModelDashboardProps, ModelInsightProps, type Submit, clsx, getSignature, router } from "@core/client";
import { ReactNode, useEffect, useRef, useState } from "react";
import { baseClientEnv, dayjs, getQueryMap } from "@core/base";
import { msg } from "../dict";

declare global {
  interface Window {
    [key: string]: any;
  }
}

export const Stat = ({
  summary,
  sliceName = "keyring",
  queryMap = getQueryMap(cnst.KeyringSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalKeyring", "activeKeyring", "inProgressKeyring", "resolvedKeyring"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "keyring" }: ModelInsightProps<cnst.KeyringInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface VerifyPhoneProps {
  sign: "signin" | "signup";
  disabled?: boolean;
  hash?: string;
}
export const VerifyPhone = ({ sign, disabled, hash = "verify" }: VerifyPhoneProps) => {
  const { l } = usePage();
  const myKeyring = st.use.myKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({
    minute: 0,
    second: 0,
  });
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({
      minute: Math.floor(remainSec / 60),
      second: remainSec % 60,
    });
  }, 1000);
  return (
    <>
      <div className="my-6 flex">
        <div className="flex w-full gap-2">
          <Input
            className="w-full"
            inputClassName="w-full"
            placeholder={l("keyring.phonePlaceholder")}
            value={myKeyring.phone ?? ""}
            disabled={true}
            validate={(value) => true}
          />
          <button
            className={`btn w-20 whitespace-nowrap text-xs ${!phoneCodeAt && "btn-primary"}`}
            disabled={!!disabled || !isPhoneNumber(myKeyring.phone) || myKeyring.isPhoneVerified()}
            onClick={() => {
              if (myKeyring.phone) void st.do.requestPhoneCode(myKeyring.id, myKeyring.phone, sign);
            }}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>

      <div className="my-6 flex">
        <div className="relative flex w-full gap-2">
          <Input
            className="w-full"
            inputClassName="w-full"
            placeholder={l("keyring.phoneCodePlaceholder")}
            value={phoneCode}
            onChange={st.do.setPhoneCode}
            disabled={!phoneCodeAt || myKeyring.isPhoneVerified()}
            validate={(value) => true}
          />
          {!myKeyring.isPhoneVerified() && phoneCodeAt && (
            <div className="text-primary/70 absolute right-28 top-2 flex h-8 items-center align-middle text-sm">
              {pad(phoneCodeRemain.minute, 2)}:{pad(phoneCodeRemain.second, 2)}
            </div>
          )}
          <button
            className="btn btn-primary w-20 whitespace-nowrap text-xs"
            disabled={!phoneCodeAt || myKeyring.isPhoneVerified()}
            onClick={() => void st.do.verifyPhoneCode()}
          >
            {myKeyring.isPhoneVerified() ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </>
  );
};

interface SignupPhoneProps {
  className?: string;
  disabled: boolean;
  hash?: string;
  loginForm?: Partial<LoginForm>;
}
export const SignupPhone = ({ className, disabled, hash = "signup", loginForm }: SignupPhoneProps) => {
  const { l } = usePage();
  const signupKeyring = st.use.signupKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({
    minute: 0,
    second: 0,
  });
  const keyringForm = st.use.keyringForm();
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({
      minute: Math.floor(remainSec / 60),
      second: remainSec % 60,
    });
  }, 1000);
  return (
    <div className={clsx("mb-6 flex w-full flex-col gap-6", className)}>
      <div className="flex w-full">
        <div className="flex w-full gap-2">
          <Input
            className="w-full"
            inputClassName="w-full"
            value={keyringForm.phone ?? ""}
            placeholder={l("keyring.phonePlaceholder")}
            onChange={(value) => {
              st.do.setPhoneOnKeyring(formatPhone(value));
            }}
            disabled={signupKeyring?.verifies.includes("phone")}
            validate={(value) => true}
          />
          <button
            className={`btn w-20 ${
              !phoneCodeAt && "btn-primary"
            } text-base-100 whitespace-nowrap text-xs disabled:border-gray-300`}
            disabled={disabled || !isPhoneNumber(keyringForm.phone) || signupKeyring?.verifies.includes("phone")}
            onClick={() => {
              void (async () => {
                if (!keyringForm.phone) return;
                const keyringIdHasPhone = await fetch.getKeyringIdHasPhone(keyringForm.phone);
                if (keyringIdHasPhone) {
                  window.alert("이미 사용중인 전화번호입니다.");
                  return;
                }
                const keyring = await fetch.addPhoneInPrepareKeyring(keyringForm.phone, signupKeyring?.id);
                void st.do.requestPhoneCode(keyring.id, keyringForm.phone, "signup");
                st.set({ signupKeyring: keyring });
              })();
            }}
          >
            {phoneCodeAt ? "재요청" : "인증요청"}
          </button>
        </div>
      </div>
      <div className="flex">
        <div className="relative flex w-full gap-2">
          <Input
            className="w-full"
            inputClassName="w-full"
            value={phoneCode}
            placeholder={l("keyring.phoneCodePlaceholder")}
            onChange={st.do.setPhoneCode}
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
            validate={(value) => true}
          />
          {!signupKeyring?.verifies.includes("phone") && phoneCodeAt && (
            <div className="text-primary/70 absolute right-28 top-3.5 flex items-center align-middle text-sm">
              {pad(phoneCodeRemain.minute, 2)}:{pad(phoneCodeRemain.second, 2)}
            </div>
          )}
          <button
            className="text-base-100 btn btn-primary w-20 whitespace-nowrap text-xs disabled:border-gray-300"
            disabled={!phoneCodeAt || signupKeyring?.verifies.includes("phone")}
            onClick={() => void st.do.signupPhone(loginForm)}
          >
            {signupKeyring?.verifies.includes("phone") ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </div>
  );
};
interface SigninPhoneProps {
  className?: string;
  inputClassName?: string;
  hash?: string;
  loginForm?: Partial<LoginForm>;
}
export const SigninPhone = ({ className, inputClassName, hash = "signup", loginForm }: SigninPhoneProps) => {
  const { l } = usePage();
  const myKeyring = st.use.myKeyring();
  const phoneCode = st.use.phoneCode();
  const phoneCodeAt = st.use.phoneCodeAt();
  const verifyingKeyringId = st.use.verifyingKeyringId();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({
    minute: 0,
    second: 0,
  });
  const keyringForm = st.use.keyringForm();
  const onRequestCode = () => {
    if (!keyringForm.phone || !verifyingKeyringId) return;
    void st.do.requestPhoneCode(verifyingKeyringId, keyringForm.phone);
  };
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({ minute: Math.floor(remainSec / 60), second: remainSec % 60 });
  }, 1000);
  return (
    <div className={clsx("mb-6 flex w-full flex-col gap-6", className)}>
      <div className="mb-5 flex w-full items-center gap-2">
        <Input
          disabled={!!phoneCodeAt}
          placeholder="전화번호를 입력해주세요"
          className={className}
          inputClassName={inputClassName}
          value={keyringForm.phone ?? ""}
          onChange={(value) => {
            st.do.setPhoneOnKeyring(formatPhone(value));
          }}
          validate={(value) => true}
        />
        <button
          disabled={!!phoneCodeAt}
          className="btn w-20"
          onClick={() => {
            onRequestCode();
          }}
        >
          전송
        </button>
      </div>
      <div className="relative flex w-full items-center gap-3">
        <Input
          maxLength={6}
          autoFocus
          disabled={!phoneCodeAt}
          className={className}
          inputClassName={inputClassName}
          value={phoneCode}
          onChange={st.do.setPhoneCode}
          validate={(value) => true}
        />
        {phoneCodeAt && (
          <div className="text-primary/70 absolute right-28 flex items-center align-middle text-sm">
            {pad(phoneCodeRemain.minute, 2)}:{pad(phoneCodeRemain.second, 2)}
          </div>
        )}
        <button
          className="text-base-100 btn btn-info w-20 whitespace-nowrap text-xs disabled:border-gray-300"
          disabled={phoneCode.length < 6 || !phoneCodeAt}
          onClick={() => {
            void st.do.signinPhone().then(() => {
              router.push("/");
            });
          }}
        >
          인증하기
        </button>
      </div>
      {phoneCodeAt && (
        <div className="flex items-center justify-center px-5">
          인증번호가 오지 않았나요?
          <button
            disabled={phoneCodeRemain.minute > 0 || phoneCodeRemain.second > 20}
            onClick={() => {
              onRequestCode();
            }}
            className="btn btn-ghost hover:bg-transparent disabled:bg-transparent"
          >
            재전송
          </button>
        </div>
      )}
    </div>
  );
};

interface SignupPasswordProps {
  siteKey: string;
  loginForm?: Partial<LoginForm>;
  onSignup?: () => void;
}

export const SignUpPassword = ({ siteKey, loginForm, onSignup }: SignupPasswordProps) => {
  const password = st.use.password();
  const turnstileToken = st.use.turnstileToken();
  const keyringForm = st.use.keyringForm();
  const isSubmitable = turnstileToken && isEmail(keyringForm.accountId) && password.length >= 7;
  const [isReady, setIsReady] = useState(false);

  const signup = async () => {
    await st.do.signupPassword(loginForm);
    onSignup?.();
  };
  return (
    <>
      <div className="mb-6 flex items-baseline">
        <Input
          icon={<AiOutlineMail />}
          className="w-full"
          inputClassName="w-full placeholder:text-sm"
          placeholder="이메일을 입력하세요."
          value={keyringForm.accountId ?? ""}
          onChange={st.do.setAccountIdOnKeyring}
          validate={(value) => {
            if (!isEmail(value)) return "이메일 형식이 아닙니다.";
            else return true;
          }}
        />
      </div>
      <div className="mb-6 flex items-baseline">
        <Input.Password
          icon={<AiOutlineLock />}
          className="w-full"
          inputClassName="w-full placeholder:text-sm"
          value={password}
          onChange={st.do.setPassword}
          onPressEnter={() => {
            if (isSubmitable) void signup();
          }}
          validate={(value: string) => {
            if (value.length < 7) return "7자 이상 입력해주세요.";
            else return true;
          }}
        />
      </div>
      <AreYouRobot
        siteKey={siteKey}
        onSuccess={(token) => {
          st.do.setTurnstileToken(token);
          setIsReady(true);
        }}
      />
      <button
        className="btn flex w-full gap-2"
        disabled={!isEmail(keyringForm.accountId) || password.length < 7}
        onClick={() => void signup()}
      >
        Register
        <div className="w-4">
          {!isReady ? (
            <Loading.Spin />
          ) : (
            <div className="animate-pop text-lg duration-200">
              <AiFillCheckCircle />
            </div>
          )}
        </div>
      </button>
    </>
  );
};
interface SigninPasswordProps {
  siteKey: string;
  loginForm?: Partial<LoginForm>;
  forgotPasswordHref?: string | null;
  signupHref?: string | null;
}
export const SignInPassword = ({
  siteKey,
  loginForm = {},
  forgotPasswordHref = "/forgotpassword",
  signupHref = "/signup/general",
}: SigninPasswordProps) => {
  const { l, lang } = usePage();
  const password = st.use.password();
  const turnstileToken = st.use.turnstileToken();
  const keyringForm = st.use.keyringForm();
  const isSubmitable = isEmail(keyringForm.accountId) && password.length >= 7;
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    return () => {
      st.do.setAccountIdOnKeyring("");
      st.do.setPassword("");
      st.do.setTurnstileToken("");
    };
  }, []);
  return (
    <>
      <div className="mb-2 flex w-full items-baseline">
        <Input
          id="accountId"
          // icon={<AiOutlineMail />}
          inputStyleType="bordered"
          className="w-full"
          inputClassName="w-full font-sans rounded-md placeholder:text-lg"
          // status={!keyringForm.accountId || isEmail(keyringForm.accountId) ? "" : "error"}
          placeholder={l("keyring.accountIdPlaceholder")}
          value={keyringForm.accountId ?? ""}
          onChange={st.do.setAccountIdOnKeyring}
          validate={(value: string) => true}
        />
      </div>
      <div className="flex w-full items-baseline">
        <Input.Password
          id="password"
          // icon={<AiOutlineLock />}
          className="w-full"
          inputClassName="w-full font-sans rounded-md placeholder:text-lg"
          // status={!password.length || password.length >= 7 ? "" : "error"}
          value={password}
          placeholder={l("keyring.passwordPlaceholder")}
          onChange={st.do.setPassword}
          onPressEnter={() => {
            if (isReady && isSubmitable) void st.do.signinPassword(loginForm);
          }}
          validate={(value: string) => true}
        />
      </div>
      <div className="mb-2 mt-4 flex w-full items-center justify-end gap-3 text-sm tracking-tight text-gray-500 ">
        {forgotPasswordHref ? (
          <Link href={forgotPasswordHref} className="cursor-pointer duration-300 hover:opacity-50 ">
            {l("keyring.forgotPassword")}
          </Link>
        ) : null}
        {signupHref ? (
          <>
            <div className="text-gray-400">|</div>
            <Link href={signupHref} className="cursor-pointer bg-none duration-300 hover:opacity-50">
              {l("keyring.signup")}
            </Link>
          </>
        ) : null}
      </div>
      <AreYouRobot
        siteKey={siteKey}
        onSuccess={(token) => {
          st.do.setTurnstileToken(token);
          setIsReady(true);
        }}
      />
      <button
        id="signin-button"
        className={`text-base-100 btn btn-primary w-full md:mt-5 ${isReady ? "" : "btn-disabled"} gap-2`}
        disabled={!isSubmitable}
        onClick={() => void st.do.signinPassword(loginForm)}
      >
        {l("shared.signIn")}
        <div className="w-4">
          {!isReady ? (
            <Loading.Spin />
          ) : (
            <div className="animate-pop text-lg duration-200">
              <AiFillCheckCircle />
            </div>
          )}
        </div>
      </button>
    </>
  );
};

export const ChangePasswordWithPhone = () => {
  const { l } = usePage();
  const password = st.use.password();
  const passwordConfirm = st.use.passwordConfirm();
  const myKeyring = st.use.myKeyring();
  const keyringModal = st.use.keyringModal();
  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() => {
          st.do.setKeyringModal("changePasswordWithPhone");
        }}
      >
        변경
      </button>
      <Modal
        bodyClassName="max-w-md"
        open={keyringModal === "changePasswordWithPhone"}
        onCancel={() => {
          st.do.setKeyringModal(null);
        }}
        title="비밀번호 변경"
        action={
          <button
            className="btn w-full"
            onClick={() => void st.do.changePasswordWithPhone()}
            disabled={password.length < 7 || !myKeyring.isPhoneVerified() || password !== passwordConfirm}
          >
            Submit
          </button>
        }
      >
        <div>
          <VerifyPhone sign="signin" />
          <Input.Password
            iconClassName="btn btn-square text-xl"
            inputClassName="w-full"
            className="w-full"
            placeholder="새 비밀번호"
            value={password}
            onChange={st.do.setPassword}
            validate={(value: string) => {
              if (value.length < 8 && value.length > 20) return "8자 이상 20자 이내로 입력해주세요.";
              else return true;
            }}
          />
          <Input.Password
            inputWrapperClassName="my-4"
            iconClassName="btn btn-square text-xl"
            inputClassName="w-full"
            className="w-full"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={st.do.setPasswordConfirm}
            validate={(value: string) => {
              if (value !== password) return "입력하신 비밀번호가 일치하지 않습니다.";
              else return true;
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export const ChangePassword = ({ siteKey }: { siteKey: string }) => {
  const { l } = usePage();
  const password = st.use.password();
  const prevPassword = st.use.prevPassword();
  const keyringModal = st.use.keyringModal();
  const passwordConfirm = st.use.passwordConfirm();
  const turnstileToken = st.use.turnstileToken();
  return (
    <>
      <button
        className="btn btn-sm"
        onClick={() => {
          st.do.setKeyringModal("changePassword");
        }}
      >
        {l("keyring.changePassword")}
      </button>
      <Modal
        open={keyringModal === "changePassword"}
        onCancel={() => {
          st.do.setKeyringModal(null);
        }}
        title="비밀번호 변경"
        action={
          <button
            className="btn w-full"
            onClick={() => void st.do.changePassword()}
            disabled={password.length < 7 || password !== passwordConfirm || !turnstileToken}
          >
            Submit
          </button>
        }
      >
        <div className="mb-2 flex items-baseline justify-center">
          <div className="w-32">{l("keyring.prevPassword")}</div>
          <Input.Password value={prevPassword} onChange={st.do.setPrevPassword} validate={(value) => true} />
        </div>
        <div className="mb-2 flex items-baseline justify-center">
          <div className="w-32">{l("keyring.newPassword")}</div>
          <Input.Password value={password} onChange={st.do.setPassword} validate={(value) => true} />
        </div>
        <div className="mb-2 flex items-baseline justify-center">
          <div className="w-32">{l("keyring.passwordConfirm")}</div>
          <Input.Password value={passwordConfirm} onChange={st.do.setPasswordConfirm} validate={(value) => true} />
        </div>
        <div className="mb-2 flex justify-center">
          <AreYouRobot
            siteKey={siteKey}
            onSuccess={(token) => {
              st.do.setTurnstileToken(token);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

interface SSOButtonsProps {
  className?: string;
  mainSsos?: cnst.SsoType[];
  subSsos?: cnst.SsoType[];
}

export const SSOButtons = ({ className, mainSsos = [], subSsos = [] }: SSOButtonsProps) => {
  const { l } = usePage();
  const mainSsoButtonMap: { [key in cnst.SsoType]: ReactNode } = {
    kakao: (
      <button className="btn relative flex w-full items-center border-none bg-[#FEE500] text-[#3c1e1e] shadow hover:bg-[#FEE500] hover:opacity-50 ">
        <Icon.Kakao className="absolute left-4 rounded-full" />
        {l("keyring.signWithKakao")}
      </button>
    ),
    naver: (
      <button className="btn relative flex w-full items-center border-none bg-[#1ec800] text-white shadow hover:bg-[#1ec800] hover:opacity-50 ">
        <Icon.Naver className="absolute left-4 rounded-full fill-white" />
        {l("keyring.signWithNaver")}
      </button>
    ),
    github: (
      <button className="btn relative flex w-full items-center border-none bg-black text-white shadow">
        <AiFillGithub className="absolute left-[18px] text-4xl text-white" />
        {l("keyring.signWithGithub")}
      </button>
    ),
    google: (
      <button className="btn relative flex w-full items-center border border-gray-200 bg-white text-black shadow">
        <Icon.Google className="absolute left-4 rounded-full" />
        {l("keyring.signWithGoogle")}
      </button>
    ),
    facebook: (
      <button className="btn relative flex w-full items-center border-none bg-[#039be5] text-white shadow">
        <Icon.Facebook className="absolute left-[22px] rounded-full" width={30} />
        {l("keyring.signWithFacebook")}
      </button>
    ),
    apple: (
      <button className="btn relative flex w-full items-center border-none bg-black text-white shadow">
        <Icon.Apple className="absolute left-4 rounded-full" />
        {l("keyring.signWithApple")}
      </button>
    ),
  };
  const subSsoButtonMap: { [key in cnst.SsoType]: ReactNode } = {
    kakao: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-[#FEE500] hover:bg-[#FEE500] hover:opacity-50">
        <Icon.Kakao className="" />
      </button>
    ),
    naver: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-[#1ec800] hover:bg-[#1ec800] hover:opacity-50">
        <Icon.Naver className="fill-white" />
      </button>
    ),
    github: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-black text-black">
        <div className="flex size-10 items-center justify-center rounded-full bg-white">
          <AiFillGithub className="scale-125 text-[200px]" />
        </div>
      </button>
    ),
    google: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-white shadow-md">
        <Icon.Google className="" />
      </button>
    ),
    facebook: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-[#1778F2]">
        <Icon.Facebook className="mb-1 mr-[0.5px] fill-transparent " />
      </button>
    ),
    apple: (
      <button className="relative flex size-14 items-center justify-center rounded-full bg-black">
        <Icon.Apple className="fill-white" />
      </button>
    ),
  };
  const mainSsoTypes = mainSsos.filter((ssoType) => mainSsoButtonMap[ssoType]);
  const subSsoTypes = subSsos.filter((ssoType) => subSsoButtonMap[ssoType]);
  return (
    <div className={clsx("flex w-full flex-col justify-between gap-1.5 md:gap-3", className)}>
      {mainSsoTypes.map((ssoType) => (
        <Link href={`${baseClientEnv.serverHttpUri}/keyring/${ssoType}`} key={ssoType}>
          {mainSsoButtonMap[ssoType]}
        </Link>
      ))}
      {subSsoTypes.length ? (
        <div className="mt-5 flex items-center justify-center gap-4">
          {subSsoTypes.map((ssoType) => (
            <Link href={`${baseClientEnv.serverHttpUri}/keyring/${ssoType}`} key={ssoType}>
              {subSsoButtonMap[ssoType]}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const ForgotPassword = () => {
  const { l } = usePage();
  const resetPasswordMailSent = st.use.resetPasswordMailSent();
  const keyringForm = st.use.keyringForm();
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="mb-4 text-center text-3xl font-bold">{l("keyring.forgotPassword")}</div>
      <div className="mb-6 text-center text-sm">{l("keyring.forgotPasswordDesc")}</div>
      <div className="mb-2 flex w-full items-baseline">
        <Input
          // icon={<AiOutlineMail />}
          // iconClassName="btn btn-square text-xl"
          className="w-full"
          inputClassName="w-full"
          placeholder={l("keyring.accountIdPlaceholder")}
          value={keyringForm.accountId ?? ""}
          onChange={st.do.setAccountIdOnKeyring}
          validate={(value) => {
            if (!isEmail(keyringForm.accountId)) return "이메일 형식이 아닙니다.";
            else return true;
          }}
        />
      </div>
      <button
        className="btn btn-primary text-base-100 w-full"
        disabled={!isEmail(keyringForm.accountId) || resetPasswordMailSent}
        onClick={() => {
          void (async () => {
            try {
              await fetch.resetPassword(keyringForm.accountId ?? "");
              msg.success("keyring.emailSentSuccess", { key: "forgotPassword" });
              st.do.setResetPasswordMailSent(true);
            } catch (e) {
              //
            }
          })();
        }}
      >
        {l("keyring.sendResetEmail")}
      </button>
    </div>
  );
};

interface SignaddChainWalletProps {
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
  children?: ReactNode;
  onAdded?: () => void;
}
export const SignaddChainWallet = ({ provider, network, children, onAdded }: SignaddChainWalletProps) => {
  const myKeyring = st.use.myKeyring();
  const { l } = usePage();
  const sign = async () => {
    msg.loading("keyring.creatingWallet", { key: "createWallet" });
    const signature = getSignature();
    if (!signature) {
      msg.error("keyring.notSignedWalletError", { key: "createWallet" });
      return;
    }
    const keyring = await fetch.signaddChainWallet();
    st.set({ myKeyring: keyring });
    msg.info("keyring.addedWallet", { key: "createWallet" });
    onAdded?.();
  };
  return (
    <Web3.SignWallet provider={provider} network={network} onSigned={() => void sign()}>
      {children ? (
        children
      ) : (
        <button className="w-fit cursor-pointer rounded-sm border-gray-300 bg-gray-100 px-2 py-1 text-xs transition duration-500 hover:bg-gray-200">
          Add Wallet
        </button>
      )}
    </Web3.SignWallet>
  );
};
interface SignsubChainWalletProps {
  className?: string;
  network: cnst.util.ChainNetwork;
  address: string;
  children: any;
}
export const SignsubChainWallet = ({ className, network, address, children }: SignsubChainWalletProps) => {
  return (
    <Popconfirm title="Are you sure to remove?" onConfirm={() => void st.do.signsubChainWallet(network, address)}>
      {children}
    </Popconfirm>
  );
};

export const ViewUser = ({
  userId,
  viewUser,
}: {
  userId: string;
  viewUser: ({ user }: { user: any }) => JSX.Element;
}) => {
  const ViewUser = viewUser;
  return (
    <>
      <button
        className="btn"
        onClick={() =>
          void (
            st.do as unknown as {
              viewUser: (userId: string) => Promise<void>;
            }
          ).viewUser(userId)
        }
      >
        View User
      </button>
      <Model.ViewModal
        id={userId}
        sliceName="user"
        renderTitle={(user: cnst.User) => user.nickname}
        renderView={(user: cnst.User) => <ViewUser user={user} />}
      />
    </>
  );
};

interface ViewKeyringProps {
  id: string;
}
export const ViewKeyring = ({ id }: ViewKeyringProps) => {
  return (
    <>
      <button className="btn btn-sm" onClick={() => void st.do.viewKeyring(id, { modal: `viewKeyring-${id}` })}>
        View Keyring
      </button>
      <Model.ViewModal
        id={id}
        modal={`viewKeyring-${id}`}
        sliceName="keyring"
        renderTitle={(keyring: cnst.Keyring) => keyring.accountId ?? "no account ID"}
        renderView={(keyring: cnst.Keyring) => <Keyring.View.General keyring={keyring} />}
      />
    </>
  );
};
interface SignoutProps {
  className?: string;
  href?: string;
  children: any;
}
export const Signout = ({ className, href, children }: SignoutProps) => {
  return (
    <Link className={className} href={href} onClick={() => void st.do.logout()}>
      {children}
    </Link>
  );
};

interface ChangeAccountIdByAdminProps {
  className?: string;
  accountId: string | null;
}
export const ChangeAccountIdByAdmin = ({ className, accountId }: ChangeAccountIdByAdminProps) => {
  const [changeId, setChangeId] = useState(accountId ?? "empty");
  const [editState, setEditState] = useState<"edit" | "saving" | null>(null);
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <label className="w-24">AccountId: </label>
      <input
        className="input"
        value={changeId}
        onChange={(e) => {
          setChangeId(e.target.value);
        }}
        disabled={!editState}
      />
      {editState ? (
        <>
          <button
            className="btn btn-primary"
            disabled={
              editState === "saving" ||
              changeId === accountId ||
              changeId.length < 4 ||
              (isEmail(accountId) && !isEmail(changeId))
            }
            onClick={async () => {
              setEditState("saving");
              await st.do.changeAccountIdByAdmin(changeId);
              setEditState(null);
            }}
          >
            <AiOutlineSave />
          </button>
          <button
            className="btn btn-outline"
            disabled={editState === "saving"}
            onClick={() => {
              setChangeId(accountId ?? "");
              setEditState(null);
            }}
          >
            <AiOutlineClose />
          </button>
        </>
      ) : (
        <button
          className="btn"
          onClick={() => {
            setEditState("edit");
          }}
        >
          <AiOutlineEdit />
        </button>
      )}
    </div>
  );
};
interface ChangePasswordByAdminProps {
  className?: string;
}
export const ChangePasswordByAdmin = ({ className }: ChangePasswordByAdminProps) => {
  const [password, setPassword] = useState("********");
  const [editState, setEditState] = useState<"edit" | "saving" | null>(null);
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <label className="w-24">Password: </label>
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        disabled={!editState}
      />
      {editState ? (
        <>
          <button
            className="btn btn-primary"
            disabled={editState === "saving" || password.length < 8 || password.length > 20}
            onClick={async () => {
              setEditState("saving");
              await st.do.changePasswordByAdmin(password);
              setEditState(null);
            }}
          >
            <AiOutlineSave />
          </button>
          <button
            className="btn btn-outline"
            disabled={editState === "saving"}
            onClick={() => {
              setPassword("********");
              setEditState(null);
            }}
          >
            <AiOutlineClose />
          </button>
        </>
      ) : (
        <button
          className="btn"
          onClick={() => {
            setEditState("edit");
          }}
        >
          <AiOutlineEdit />
        </button>
      )}
    </div>
  );
};

interface ChangePhoneByAdminProps {
  className?: string;
  phone: string | null;
}
export const ChangePhoneByAdmin = ({ className, phone }: ChangePhoneByAdminProps) => {
  const [changePhone, setChangePhone] = useState(phone ?? "empty");
  const [editState, setEditState] = useState<"edit" | "saving" | null>(null);
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <label className="w-24">Phone: </label>
      <input
        className="input"
        value={changePhone}
        onChange={(e) => {
          setChangePhone(formatPhone(e.target.value));
        }}
        disabled={!editState}
      />
      {editState ? (
        <>
          <button
            className="btn btn-primary"
            disabled={editState === "saving" || !isPhoneNumber(changePhone) || changePhone === phone}
            onClick={async () => {
              setEditState("saving");
              await st.do.changePhoneByAdmin(changePhone);
              setEditState(null);
            }}
          >
            <AiOutlineSave />
          </button>
          <button
            className="btn btn-outline"
            disabled={editState === "saving"}
            onClick={() => {
              setChangePhone(phone ?? "");
              setEditState(null);
            }}
          >
            <AiOutlineClose />
          </button>
        </>
      ) : (
        <button
          className="btn"
          onClick={() => {
            setEditState("edit");
          }}
        >
          <AiOutlineEdit />
        </button>
      )}
    </div>
  );
};

interface CreateUserForKeyringByAdminProps {
  className?: string;
  keyringId: string;
  editUser: () => JSX.Element;
}
export const CreateUserForKeyringByAdmin = ({ className, keyringId, editUser }: CreateUserForKeyringByAdminProps) => {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const EditUser = editUser;
  const Submit = () => {
    const userSubmit = storeUse.userSubmit<Submit>();
    return (
      <button
        className="btn w-full"
        {...userSubmit}
        onClick={async () => {
          await st.do.createUserForKeyringByAdmin(
            keyringId,
            (
              st.get() as unknown as {
                userForm: cnst.User;
              }
            ).userForm
          );
        }}
      >
        Create
      </button>
    );
  };
  return (
    <>
      <button className="btn btn-warning" onClick={() => storeDo.newUser({}, { modal: `${keyringId}-createUser` })}>
        Create User
      </button>
      <Model.EditModal sliceName="user" modal={`${keyringId}-createUser`} renderSubmit={Submit}>
        <EditUser />
      </Model.EditModal>
    </>
  );
};

interface NameProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Name = ({ className, inputClassName, placeholder, onKeyPress }: NameProps) => {
  const keyringForm = st.use.keyringForm();

  return (
    <Input
      autoFocus
      inputStyleType="underline"
      className={className}
      inputClassName={inputClassName}
      onKeyPress={onKeyPress}
      placeholder={placeholder ?? "이름을 입력해주세요"}
      validate={(value: string) =>
        value.length >= 2 && value.length <= 20 ? true : "2자 이상 20자 이내로 입력해주세요."
      }
      value={keyringForm.name ?? ""}
      onChange={st.do.setNameOnKeyring}
    />
  );
};

interface ResetEmailProps {
  inputStyleType?: "underline" | "bordered" | "borderless";
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onPressEnter?: () => void;
}

export const ResetEmail = ({
  inputStyleType = "bordered",
  className,
  inputClassName,
  placeholder,
  onPressEnter,
}: ResetEmailProps) => {
  const keyringForm = st.use.keyringForm();

  return (
    <Input.Email
      autoFocus
      inputStyleType={inputStyleType}
      className={className}
      inputClassName={inputClassName}
      placeholder={placeholder ?? "이메일을 입력해주세요"}
      value={keyringForm.resetEmail ?? ""}
      onChange={(value) => {
        st.do.setResetEmailOnKeyring(value);
      }}
      onPressEnter={onPressEnter}
      validate={(value) => isEmail(value)}
    />
  );
};

interface PhoneProps {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  onPressEnter?: () => void;
}

export const Phone = ({ className, onPressEnter, inputClassName, placeholder }: PhoneProps) => {
  const { l } = usePage();
  const keyringForm = st.use.keyringForm();
  const inputRef = useRef<HTMLInputElement>(null);
  const path = st.use.path();
  useEffect(() => {
    inputRef.current?.focus();
  }, [path]);

  return (
    <Input
      inputRef={inputRef}
      type="tel"
      maxLength={13}
      className={className}
      inputClassName={inputClassName}
      placeholder={placeholder ?? l("keyring.phonePlaceholder")}
      value={keyringForm.phone ?? ""}
      onChange={(value) => {
        st.do.setPhoneOnKeyring(formatPhone(value));
      }}
      onPressEnter={onPressEnter}
      validate={(value) => true}
    />
  );
};
interface VerifyPhoneCodeProps {
  className?: string;
  inputClassName?: string;
  submitBtnClassName?: string;
  requestBtnClassName?: string;
}

export const VerifyPhoneCode = ({
  className,
  inputClassName,
  submitBtnClassName,
  requestBtnClassName,
}: VerifyPhoneCodeProps) => {
  const { l } = usePage();
  const phoneCodeAt = st.use.phoneCodeAt();
  const phoneCode = st.use.phoneCode();
  const signupKeyring = st.use.signupKeyring();
  const verifyingKeyringId = st.use.verifyingKeyringId();
  const keyringForm = st.use.keyringForm();
  const [phoneCodeRemain, setPhoneCodeRemain] = useState({ minute: 0, second: 0 });
  const onRequest = () => {
    if (!keyringForm.phone || !verifyingKeyringId) return;
    void st.do.requestPhoneCode(verifyingKeyringId, keyringForm.phone);
  };
  useInterval(() => {
    if (!phoneCodeAt) return;
    const remainSec = Math.max(0, phoneCodeAt.add(3, "minutes").diff(dayjs(), "second"));
    setPhoneCodeRemain({
      minute: Math.floor(remainSec / 60),
      second: remainSec % 60,
    });
  }, 1000);

  return (
    <div className="w-full pb-5">
      <div className="relative flex w-full items-center gap-3">
        <Input
          autoFocus
          type="tel"
          maxLength={6}
          className={className}
          inputClassName={inputClassName}
          value={phoneCode}
          placeholder={signupKeyring?.verifies.includes("phone") ? "인증 완료" : l("keyring.phoneCode")}
          onChange={(value) => {
            st.do.setPhoneCode(value);
          }}
          disabled={signupKeyring?.verifies.includes("phone")}
          onPressEnter={async () => {
            signupKeyring ? await st.do.signupPhone() : await st.do.signinPhone();
            router.push(signupKeyring ? "/signup" : "/");
          }}
          validate={(value) => true}
        />
        {phoneCodeAt && !signupKeyring?.verifies.includes("phone") && (
          <div className="text-primary/70 absolute right-28 flex items-center align-middle text-sm">
            {pad(phoneCodeRemain.minute, 2)}:{pad(phoneCodeRemain.second, 2)}
          </div>
        )}
        <button
          className={clsx(
            "text-base-100 btn  btn-success w-20 whitespace-nowrap text-xs disabled:border-gray-300",
            submitBtnClassName
          )}
          disabled={phoneCode.length < 6 || !phoneCodeAt || signupKeyring?.verifies.includes("phone")}
          onClick={async () => {
            if (signupKeyring) {
              await st.do.signupPhone();
              router.push("/signup");
            } else {
              await st.do.signinPhone();
              router.push("/");
            }
          }}
        >
          {signupKeyring?.status !== "prepare" && signupKeyring?.verifies.includes("phone") ? "인증완료" : "인증하기"}
        </button>
      </div>
      {!signupKeyring?.verifies.includes("phone") && (
        <div className="flex w-auto items-center justify-center px-5 font-thin text-gray-400 ">
          인증번호가 오지 않았나요?
          <button
            disabled={!phoneCodeAt || (phoneCodeRemain.minute > 0 && phoneCodeRemain.second > 20)}
            onClick={() => {
              onRequest();
            }}
            className={clsx("btn text-info btn-ghost w-auto disabled:bg-transparent ", requestBtnClassName)}
          >
            재전송
          </button>
        </div>
      )}
    </div>
  );
};

interface PhoneCodeProps {
  className?: string;
  inputClassName?: string;
  submitBtnClassName?: string;
  requestBtnClassName?: string;
  autoComplete?: boolean;
  onComplate?: () => void;
  signupHref: string;
  signinHref: string;
}

export const PhoneCode = ({
  className,
  inputClassName,
  submitBtnClassName,
  requestBtnClassName,
  autoComplete = true,
  signupHref,
  signinHref,
}: PhoneCodeProps) => {
  const { l } = usePage();
  const phoneCode = st.use.phoneCode();
  const signupKeyring = st.use.signupKeyring();

  const handleClick = async () => {
    try {
      if (signupKeyring) {
        await st.do.signupPhone();
        router.push(signupHref);
      } else {
        await st.do.signinPhone();
        router.push(signinHref);
      }
    } catch (e) {
      Logger.error(e as string);
    }
  };

  return (
    <div className="w-full pb-4">
      <CodeInput
        autoComplete={autoComplete}
        unitStyle="underline"
        value={phoneCode}
        onChange={st.do.setPhoneCode}
        maxNum={6}
        onComplete={handleClick}
      />
    </div>
  );
};

export const ResendPhoneCode = () => {
  const myKeyring = st.use.myKeyring();
  const keyringForm = st.use.keyringForm();

  return (
    <div className="mt-2 flex justify-center">
      <button
        className="cursor-pointer border-b border-dashed text-sm opacity-60 duration-300 hover:opacity-100"
        // onClick={async () => myKeyring.phone && st.do.requestPhoneCode(myKeyring.id, myKeyring.phone)}
        onClick={async () => {
          await st.do.verifyPhone();
        }}
      >
        인증번호 다시받기
      </button>
    </div>
  );
};

interface SubmitPhoneProps {
  nextHref: string;
  className?: string;
  submitable?: boolean;
}

export const SubmitPhone = ({ nextHref, className = "", submitable = true }: SubmitPhoneProps) => {
  const keyringForm = st.use.keyringForm();

  const handleClick = async () => {
    await st.do.verifyPhone();
    router.push(nextHref);
  };
  return (
    <button
      className={clsx("btn btn-primary", className)}
      disabled={!isPhoneNumber(keyringForm.phone) || !submitable}
      onClick={handleClick}
    >
      인증번호 받기
    </button>
  );
};

interface SubmitPhoneCodeProps {
  signupHref: string;
  signinHref: string;
  className?: string;
}

export const SubmitPhoneCode = ({ signupHref, signinHref, className = "" }: SubmitPhoneCodeProps) => {
  const phoneCode = st.use.phoneCode();
  const signupKeyring = st.use.signupKeyring();
  const myKeyring = st.use.myKeyring();

  const handleClick = async () => {
    try {
      if (signupKeyring) {
        await st.do.signupPhone();
        router.push(signupHref);
      } else {
        await st.do.signinPhone();
        router.push(signinHref);
      }
    } catch (e) {
      Logger.error(e as string);
    }
  };

  return (
    <button className={clsx("btn btn-primary", className)} disabled={phoneCode.length !== 6} onClick={handleClick}>
      다음
    </button>
  );
};

export const SubmitName = ({ nextHref }: { nextHref: string }) => {
  const keyringForm = st.use.keyringForm();
  const handleClick = () => {
    router.push(nextHref);
  };
  return (
    <button
      className={"btn btn-primary"}
      disabled={!keyringForm.name || keyringForm.name.length < 2}
      onClick={handleClick}
    >
      다음
    </button>
  );
};

export const SubmitEmail = ({ nextHref }: { nextHref: string }) => {
  const keyringForm = st.use.keyringForm();
  const handleClick = () => {
    router.push(nextHref);
  };

  return (
    <button
      className={"btn btn-primary"}
      disabled={!keyringForm.resetEmail || !isEmail(keyringForm.resetEmail)}
      onClick={handleClick}
    >
      다음
    </button>
  );
};

export const SubmitPolicy = ({ nextHref }: { nextHref: string }) => {
  const keyringForm = st.use.keyringForm();
  const signupKeyring = st.use.signupKeyring();

  const handleClick = async () => {
    if (!signupKeyring) return;
    await st.do.updatePrepareKeyring(signupKeyring.id);
    router.push(nextHref);
  };

  return (
    <button
      className={"btn btn-primary"}
      disabled={!["termofservice", "privacy", "location"].every((policy) => keyringForm.agreePolicies.includes(policy))}
      onClick={handleClick}
    >
      다음
    </button>
  );
};

export const GetPhoneNumber = () => {
  const keyringForm = st.use.keyringForm();
  return keyringForm.phone;
};

interface ComebackProps {
  comeback: string;
  unsatisfied: string;
  other: string;
  comebackHref: string;
  unsatisfiedHref: string;
  otherHref: string;
}

export const Comeback = ({ comeback, unsatisfied, other, comebackHref, otherHref, unsatisfiedHref }: ComebackProps) => {
  const keyringForm = st.use.keyringForm();

  const { l } = usePage();

  const value =
    keyringForm.leaveInfo.type === "comeback"
      ? comeback
      : keyringForm.leaveInfo.type === "unsatisfied"
        ? unsatisfied
        : other;
  return (
    <>
      <Radio
        className="flex flex-col items-start  justify-start gap-5 px-2"
        value={value}
        onChange={(value) => {
          const type = value === comeback ? "comeback" : value === unsatisfied ? "unsatisfied" : "other";
          st.do.setLeaveInfoOnKeyring({ ...keyringForm.leaveInfo, ["type"]: type } as cnst.LeaveInfo);
        }}
      >
        {[comeback, unsatisfied, other].map((answer, idx) => (
          <Radio.Item className="text-start" key={idx} value={answer}>
            {answer}
          </Radio.Item>
        ))}
      </Radio>
      <Link href={value === comeback ? comebackHref : value === unsatisfied ? unsatisfiedHref : otherHref}>
        <button className="btn btn-primary w-full ">다음</button>
      </Link>
    </>
  );
};

interface ReasonProps {
  answers: string[];
}

export const Reason = ({ answers }: ReasonProps) => {
  const keyringForm = st.use.keyringForm();
  return (
    <>
      <Radio
        className="flex flex-col items-start  justify-start gap-5 px-2"
        value={keyringForm.leaveInfo.reason}
        onChange={(value) => {
          st.do.setLeaveInfoOnKeyring({ ...keyringForm.leaveInfo, reason: value } as cnst.LeaveInfo);
        }}
      >
        {answers.map((answer, idx) => (
          <Radio.Item className="text-start" key={idx} value={answer}>
            {answer}
          </Radio.Item>
        ))}
      </Radio>
    </>
  );
};

export const Satisfaction = () => {
  const keyringForm = st.use.keyringForm();
  const satisfyLevel = ["매우 만족", "만족", "보통", "불만족", "매우 불만족"];
  return (
    <Radio
      className="flex flex-col items-start  justify-start gap-5 px-2"
      value={keyringForm.leaveInfo.satisfaction}
      onChange={(value) => {
        st.do.setLeaveInfoOnKeyring({ ...keyringForm.leaveInfo, satisfaction: value } as cnst.LeaveInfo);
      }}
    >
      {satisfyLevel.map((answer, idx) => (
        <Radio.Item className="text-start" key={idx} value={idx}>
          {answer}
        </Radio.Item>
      ))}
    </Radio>
  );
};

export const Voc = () => {
  const keyringForm = st.use.keyringForm();
  return (
    <>
      <Input.TextArea
        autoFocus
        inputClassName="p-2 w-full rounded-md h-[120px] resize-none bg-base-100"
        value={keyringForm.leaveInfo.voc}
        validate={(value) => true}
        placeholder="기타 의견을 남겨주세요."
        onChange={(value) => {
          st.do.setLeaveInfoOnKeyring({ ...keyringForm.leaveInfo, voc: value } as cnst.LeaveInfo);
        }}
      />
      <button
        className="btn btn-secondary w-full"
        onClick={async () => {
          if (!window.confirm("탈퇴하시겠습니까?")) return;
          await st.do.removeAccount();
          msg.success("keyring.leaveSuccess");
        }}
      >
        제출후 탈퇴하기
      </button>
    </>
  );
};

interface PushNotificationSwitchProps {
  className?: string;
}

export const PushNotificationSwitch = ({ className }: PushNotificationSwitchProps) => {
  const keyring = st.use.keyring();
  const myKeyring = st.use.myKeyring();
  const pushNoti = usePushNoti();
  const deviceToken = st.use.deviceToken();
  const checked = myKeyring.notiDeviceTokens.includes(deviceToken);

  useEffect(() => {
    const getToken = async () => {
      const deviceToken = await pushNoti.getToken();
      if (!deviceToken) return;
      st.do.setDeviceToken(deviceToken);
    };
    void getToken();
  }, []);

  return (
    <div>
      <input
        type="checkbox"
        className="toggle"
        checked={checked}
        onClick={() => {
          checked
            ? void st.do.subNotiDeviceTokensOfMyKeyring(deviceToken)
            : void st.do.addNotiDeviceTokensOfMyKeyring(deviceToken);
        }}
      />
    </div>
  );
};
