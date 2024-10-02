"use client";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiMenu } from "react-icons/bi";
import { Data } from "@shared/ui";
import { Link, Modal } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps, router } from "@core/client";
import { cnst, fetch, st, usePage } from "@social/client";
import { getQueryMap } from "@core/base";
import { isEmail } from "@core/common";
import { msg } from "../dict";
import { useState } from "react";

declare global {
  interface Window {
    [key: string]: any;
  }
}

export const Stat = ({
  className,
  summary,
  sliceName = "org",
  queryMap = getQueryMap(cnst.OrgSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalOrg"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "org" }: ModelInsightProps<cnst.OrgInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ToolboxProps {
  orgId: string;
  name: string;
  role: "owner" | "operator" | "viewer";
}
export const Toolbox = ({ orgId, name, role }: ToolboxProps) => {
  const [orgName, setOrgName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="dropdown dropdown-end ">
        <label tabIndex={0} className="btn m-1 ">
          <BiMenu className="text-xl" />
        </label>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow">
          <li>
            <Link href={`/org/${orgId}/edit`}>
              <AiOutlineEdit /> edit
            </Link>
          </li>
          {role === "owner" ? (
            <li>
              <a
                className="text-error"
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                <AiOutlineDelete /> remove
              </a>
            </li>
          ) : null}
        </ul>
      </div>
      {role === "owner" ? (
        <Modal
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
          }}
          title={<div className="text-error text-lg font-bold">Delete Organiztion</div>}
          bodyClassName="border-error"
          action={
            <button
              className="btn btn-error w-full"
              disabled={orgName !== name}
              onClick={async () => {
                await st.do.removeOrg(orgId);
                msg.success("org.removeSuccess");
                router.push("/org");
              }}
            >
              Yes, delete this organization
            </button>
          }
        >
          <div className="py-4">
            Are you sure to delete organization {name}? Thie operation is irreversible, and all data cannot be backed
            up.
            <br />
            If you want to delete this organization, please enter the name of the organization to confirm.
          </div>
          <input
            className="input input-bordered w-full text-center"
            placeholder="organiztion name"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
            }}
          />
        </Modal>
      ) : null}
    </>
  );
};

interface InviteProps {
  type: "owner" | "operator" | "viewer";
}
export const Invite = ({ type }: InviteProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <input
        className="input input-bordered w-full"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <button
        className="btn"
        disabled={!isEmail(email) || loading}
        onClick={() => {
          setLoading(true);
          if (type === "owner") void st.do.inviteOwnerFromOrg(email);
          else if (type === "operator") void st.do.inviteOperatorFromOrg(email);
          else void st.do.inviteViewerFromOrg(email);
          setLoading(false);
          setEmail("");
        }}
      >
        {loading ? <span className="loading loading-spinner" /> : "Invite"}
      </button>
    </div>
  );
};

interface RemoveUserProps {
  userId: string;
  nickname: string;
  orgName: string;
  disabled?: boolean;
}
export const RemoveUser = ({ userId, nickname, orgName, disabled }: RemoveUserProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button
        className={`btn btn-ghost text-warning ${disabled ? "opacity-0" : ""}`}
        disabled={disabled}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Remove
      </button>
      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        title={<div className="text-warning text-lg font-bold">Remove {nickname}</div>}
        bodyClassName=" border-warning"
        action={
          <button
            className="btn btn-warning w-full"
            onClick={async () => {
              await st.do.removeUserFromOrg(userId);
            }}
          >
            Yes, remove this user
          </button>
        }
      >
        Remove User {nickname} from {orgName}.
      </Modal>
    </>
  );
};

interface RemoveEmailProps {
  email: string;
  orgName: string;
}
export const RemoveEmail = ({ email, orgName }: RemoveEmailProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <button
        className="btn btn-ghost text-warning"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Remove
      </button>
      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        title={<div className="text-warning text-lg font-bold">Remove {email}</div>}
        bodyClassName=" border-warning"
        action={
          <button
            className="btn btn-warning w-full"
            onClick={async () => {
              await st.do.removeEmailFromOrg(email);
            }}
          >
            Yes, remove
          </button>
        }
      >
        Remove User {email} from {orgName}.
      </Modal>
    </>
  );
};

interface AcceptInviteProps {
  userId: string;
  orgId: string;
}
export const AcceptInvite = ({ userId, orgId }: AcceptInviteProps) => {
  const { l } = usePage();
  return (
    <button
      className="btn btn-primary text-xl"
      onClick={async () => {
        msg.loading("org.acceptInviteLoading");
        await fetch.acceptInviteFromOrg(orgId);
        msg.success("org.acceptInviteSuccess");
        router.push("/org");
      }}
    >
      {l("org.acceptInvite")}
    </button>
  );
};
