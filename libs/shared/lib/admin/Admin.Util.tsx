"use client";
import { AiFillGithub, AiOutlineMenu, AiOutlinePoweroff } from "react-icons/ai";
import { Data } from "@shared/ui";
import { Icon, Input, Link } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { ReactNode, useEffect } from "react";
import { client } from "@core/common";
import { cnst, st, usePage } from "@shared/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "admin",
  queryMap = getQueryMap(cnst.AdminSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalAdmin"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "admin" }: ModelInsightProps<cnst.AdminInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface AuthProps {
  logo?: ReactNode;
  password?: boolean;
  ssoTypes?: cnst.SsoType[];
}
export const Auth = ({ logo, password, ssoTypes = [] }: AuthProps) => {
  const adminForm = st.use.adminForm();
  const uri = client.uri.replace("/graphql", "");
  const { l } = usePage();

  //enter event handler

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") void st.do.signinAdmin();
    };
    window.addEventListener("keydown", handleEnter);
    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, []);
  const ssoButtons: { [key in cnst.SsoType]: ReactNode } = {
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
    kakao: (
      <button className="btn relative flex w-full items-center border-none bg-[#FEE500] text-[#3c1e1e] shadow hover:text-white">
        <Icon.Kakao className="absolute left-4 rounded-full" />
        {l("keyring.signWithKakao")}
      </button>
    ),
    naver: (
      <button className="btn relative flex w-full items-center border-none bg-[#1ec800] text-white shadow hover:text-white">
        <Icon.Naver className="absolute left-4 rounded-full fill-white" />
        {l("keyring.signWithNaver")}
      </button>
    ),
  };
  const ssos = ssoTypes.filter((ssoType) => ssoButtons[ssoType]);
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="bg-base-200 border-base-100/30 flex w-96 flex-col gap-4 rounded-2xl border p-8 shadow">
        <div className="grid w-full place-items-center">Admin System</div>
        {logo ? <div className="mb-4 grid w-full place-items-center">{logo} </div> : null}
        {password && (
          <>
            <div className="flex w-full justify-center gap-1">
              <div className="grid w-24 place-items-center">Account: </div>
              <Input
                className="text-base-content"
                value={adminForm.accountId}
                onChange={st.do.setAccountIdOnAdmin}
                validate={(value) => value.length > 0}
              />
            </div>
            <div className="flex w-full justify-center gap-1">
              <div className="grid w-24 place-items-center">Password: </div>
              <Input.Password
                className="text-base-content"
                value={adminForm.password ?? ""}
                onChange={st.do.setPasswordOnAdmin}
                validate={(value) => value.length > 0}
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") void st.do.signinAdmin();
              }}
              onClick={() => void st.do.signinAdmin()}
            >
              {l("shared.signIn")}
            </button>
          </>
        )}
        {ssos.map((sso) => (
          <Link href={`${uri}/keyring/${sso}`} key={sso}>
            {ssoButtons[sso]}
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ToolMenu = () => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost m-1">
        <AiOutlineMenu className="mt-0.5" />
      </label>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-32 p-2 shadow">
        <li onClick={() => void st.do.signoutAdmin()}>
          <div className="text-base-content flex items-center gap-2">
            <AiOutlinePoweroff className="mt-0.5" /> Logout
          </div>
        </li>
      </ul>
    </div>
  );
};

interface ManageAdminRoleProps {
  id: string;
  roles: cnst.AdminRole[];
}
export const ManageAdminRole = ({ id, roles }: ManageAdminRoleProps) => {
  if (roles.includes("admin"))
    return (
      <button className="btn btn-sm btn-error w-full" onClick={() => void st.do.subAdminRole(id, "admin")}>
        Remove Admin
      </button>
    );
  else
    return (
      <button className="btn btn-sm btn-warning w-full" onClick={() => void st.do.addAdminRole(id, "admin")}>
        Add Admin
      </button>
    );
};

interface ManageSuperAdminRoleProps {
  id: string;
  roles: cnst.AdminRole[];
}
export const ManageSuperAdminRole = ({ id, roles }: ManageSuperAdminRoleProps) => {
  if (roles.includes("superAdmin"))
    return (
      <button className="btn btn-sm btn-error w-full" onClick={() => void st.do.subAdminRole(id, "superAdmin")}>
        Remove SuperAdmin
      </button>
    );
  else
    return (
      <button className="btn btn-sm btn-warning w-full" onClick={() => void st.do.addAdminRole(id, "superAdmin")}>
        Add SuperAdmin
      </button>
    );
};
