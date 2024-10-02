"use client";
import { AiOutlineFileWord, AiOutlineSend } from "react-icons/ai";
import {
  ArgMeta,
  GqlMeta,
  InternalArgMeta,
  type Type,
  getArgMetas,
  getGqlMetas,
  getGqlStr,
  getLightModelRef,
  getNonArrayModel,
  getSigMeta,
  getSignalRefsOnStorage,
  isGqlScalar,
  makeRequestExample,
} from "@core/base";
import { BiLogoGraphql } from "react-icons/bi";
import { st, usePage } from "@util/client";
import Arg from "./Arg";
import Object from "./Object";
import React, { useMemo, useState } from "react";
import Request from "./Request";
import Response from "./Response";

export default function GraphQL() {
  return <div></div>;
}

interface GraphQLEndpointsProps {
  refName: string;
  openAll?: boolean;
}
const GraphQLEndpoints = ({ refName, openAll }: GraphQLEndpointsProps) => {
  const sigRefs = getSignalRefsOnStorage(refName);
  const tryRoles = st.use.tryRoles();
  const gqlInfos = sigRefs
    .reduce<{ key: string; gqlMeta: GqlMeta; sigRef: Type }[]>(
      (acc, sigRef) => [...acc, ...getGqlMetas(sigRef).map((gqlMeta) => ({ key: gqlMeta.key, gqlMeta, sigRef }))],
      []
    )
    .sort((a, b) => (a.key > b.key ? 1 : -1))
    .filter(({ gqlMeta }: { gqlMeta: GqlMeta }) => gqlMeta.signalOption.onlyFor !== "restapi")
    .filter(({ gqlMeta }: { gqlMeta: GqlMeta }) => {
      if (gqlMeta.guards.includes("Public") && tryRoles.includes("Public")) return true;
      if ((gqlMeta.guards.includes("User") || gqlMeta.guards.includes("Every")) && tryRoles.includes("User"))
        return true;
      if ((gqlMeta.guards.includes("Admin") || gqlMeta.guards.includes("Every")) && tryRoles.includes("Admin"))
        return true;
      if (gqlMeta.guards.includes("SuperAdmin") && tryRoles.includes("SuperAdmin")) return true;
      return false;
    });
  return (
    <div>
      {gqlInfos.map(({ gqlMeta, sigRef }, idx) => (
        <GraphQLEndpoint key={idx} sigRef={sigRef} gqlMeta={gqlMeta} open={openAll} />
      ))}
    </div>
  );
};
GraphQL.Endpoints = GraphQLEndpoints;

interface GraphQLEndpointProps {
  sigRef: Type;
  gqlMeta: GqlMeta;
  open?: boolean;
}
const GraphQLEndpoint = ({ sigRef, gqlMeta, open }: GraphQLEndpointProps) => {
  const { l } = usePage();
  const sigMeta = getSigMeta(sigRef);
  const [viewStatus, setViewStatus] = useState<"doc" | "test">("doc");
  const [argMetas]: [ArgMeta[], InternalArgMeta[]] = getArgMetas(sigRef, gqlMeta.key);
  const gqlArgMetas = argMetas.filter((argMeta) => argMeta.type !== "Upload");
  const uploadArgMetas = argMetas.filter((argMeta) => argMeta.type === "Upload");
  return (
    <div className="collapse-arrow bg-base-300 collapse my-1">
      <input type="checkbox" checked={open} />
      <div className="collapse-title text-xl">
        <div className="flex items-center gap-3">
          <div className={`btn btn-xs w-16 ${gqlMeta.type === "Query" ? "btn-success" : "btn-accent"}`}>
            {gqlMeta.type}
          </div>
          {gqlMeta.key} <span className="text-sm">({l.api(sigMeta.refName as any, gqlMeta.key)})</span>
        </div>
      </div>
      <div className="collapse-content bg-base-200 w-full">
        <div className="mt-4 text-lg">
          Description
          <hr className="my-2 border-[0.1px] border-gray-400" />
          {gqlMeta.guards.some((guard) => guard !== "None") ? (
            <div className="flex items-center gap-2 pb-3 pl-3 text-base font-normal">
              - Guards:
              {gqlMeta.guards.map((guard) => (
                <span
                  className={`badge ${
                    guard === "Public"
                      ? "badge-success"
                      : guard === "SuperAdmin"
                        ? "badge-error"
                        : guard === "Admin"
                          ? "badge-error"
                          : guard === "User"
                            ? "badge-accent"
                            : guard === "Owner"
                              ? "badge-accent"
                              : guard === "Every"
                                ? "badge-warning"
                                : ""
                  }`}
                  key={guard}
                >
                  {guard}
                </span>
              ))}
            </div>
          ) : null}
          <div className="pb-3 pl-3 text-base font-normal">- {l.apidesc(sigMeta.refName as any, gqlMeta.key)}</div>
        </div>
        <div className="my-4 flex w-full">
          <button
            onClick={() => {
              setViewStatus("doc");
            }}
            className={`btn btn-success w-1/2 ${viewStatus === "doc" ? "" : "btn-outline"}`}
          >
            <AiOutlineFileWord className="text-xl" /> View Doc
          </button>
          <button
            onClick={() => {
              setViewStatus("test");
            }}
            className={`btn btn-primary w-1/2 ${viewStatus === "test" ? "" : "btn-outline"}`}
          >
            <BiLogoGraphql className="text-xl" /> GraphQL
          </button>
        </div>
        {viewStatus === "doc" ? (
          <GraphQLInterface
            sigRef={sigRef}
            gqlMeta={gqlMeta}
            gqlArgMetas={gqlArgMetas}
            uploadArgMetas={uploadArgMetas}
          />
        ) : (
          <GraphQLTry sigRef={sigRef} gqlMeta={gqlMeta} gqlArgMetas={gqlArgMetas} uploadArgMetas={uploadArgMetas} />
        )}
      </div>
    </div>
  );
};
GraphQL.Endpoint = GraphQLEndpoint;

interface GraphQLInterfaceProps {
  sigRef: Type;
  gqlMeta: GqlMeta;
  gqlArgMetas: ArgMeta[];
  uploadArgMetas: ArgMeta[];
}
const GraphQLInterface = ({ sigRef, gqlMeta, gqlArgMetas, uploadArgMetas }: GraphQLInterfaceProps) => {
  const sigMeta = getSigMeta(sigRef);
  const [returnRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
  const isReturnModelType = !isGqlScalar(returnRef);
  return (
    <div className="flex flex-col gap-4">
      {uploadArgMetas.length ? (
        <div>
          <div className="text-lg">Form data upload</div>
          <div className="bg-base-100 overflow-x-auto rounded-md p-3">
            <Arg.Table sigMeta={sigMeta} gqlMeta={gqlMeta} argMetas={uploadArgMetas} />
          </div>
        </div>
      ) : null}
      {gqlArgMetas.length ? (
        <div>
          <div className="text-lg">Variables</div>
          <div className="bg-base-100 overflow-x-auto rounded-md p-3">
            <Arg.Table sigMeta={sigMeta} gqlMeta={gqlMeta} argMetas={gqlArgMetas} />
          </div>
        </div>
      ) : null}
      <div className="text-lg font-bold">
        <div className="flex w-full flex-col gap-2 rounded-md font-normal md:flex-row">
          <div className="w-full md:w-1/2">
            Response Type
            <div className="bg-base-100 max-h-[500px] overflow-auto rounded-md p-4 md:h-[500px]">
              Returns: <Object.Type objRef={returnRef} arrDepth={arrDepth} />
              {isReturnModelType ? <Object.Detail objRef={returnRef} /> : null}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            Response Example
            <Response.Example sigRef={sigRef} gqlMeta={gqlMeta} />
          </div>
        </div>
      </div>
    </div>
  );
};
GraphQL.Interface = GraphQLInterface;

interface GraphQLTryProps {
  sigRef: Type;
  gqlMeta: GqlMeta;
  gqlArgMetas: ArgMeta[];
  uploadArgMetas: ArgMeta[];
}
const GraphQLTry = ({ sigRef, gqlMeta, gqlArgMetas, uploadArgMetas }: GraphQLTryProps) => {
  const tryJwt = st.use.tryJwt();
  const [modelRef, arrDepth] = getNonArrayModel(gqlMeta.returns());
  const isScalar = isGqlScalar(modelRef);
  const returnRef = isScalar || !arrDepth ? modelRef : getLightModelRef(modelRef);
  const gqlStr = useMemo(
    () =>
      getGqlStr(
        modelRef,
        gqlMeta,
        [...gqlArgMetas, ...uploadArgMetas].sort((a, b) => a.idx - b.idx),
        returnRef
      ),
    []
  );
  const requestExample = useMemo(() => JSON.stringify(makeRequestExample(sigRef, gqlMeta.key), null, 2), []);
  const [gqlRequest, setGqlRequest] = useState<string>(requestExample);
  const [uploadRequest, setUploadRequest] = useState<{ [key: string]: FileList }>({});
  const [response, setResponse] = useState<{ status: "idle" | "success" | "error" | "loading"; data: any }>({
    status: "idle",
    data: null,
  });
  const onSend = async () => {
    setResponse({ status: "loading", data: null });
    const request = { ...JSON.parse(gqlRequest), ...uploadRequest } as {
      [key: string]: string | number | boolean | null;
    };
    const argData = [...gqlArgMetas, ...uploadArgMetas]
      .sort((a, b) => a.idx - b.idx)
      .map((argMeta) => request[argMeta.name]);
    const fetchFn = fetch[gqlMeta.key] as (...args) => Promise<object>;
    const data = await fetchFn(...argData, {
      token: tryJwt,
      onError: (data: object) => {
        setResponse({ status: "error", data });
      },
    });
    setResponse({ status: "success", data });
  };
  return (
    <div className="flex w-full flex-col gap-4">
      {uploadArgMetas.length ? (
        <div>
          <div className="text-lg">Form data uplaod</div>
          {uploadArgMetas.map((argMeta) => (
            <Arg.FormData
              key={argMeta.name}
              argMeta={argMeta}
              value={uploadRequest[argMeta.name]}
              onChange={(fileList: FileList) => {
                setUploadRequest({ ...uploadRequest, [argMeta.name]: fileList });
              }}
            />
          ))}
        </div>
      ) : null}
      <div>
        <div className="grid gap-2 lg:grid-cols-2">
          <div>
            <div className="text-lg">Variables</div>
            <div className="w-full items-center justify-center">
              <Arg.Json
                value={gqlRequest}
                onChange={(value: string) => {
                  setGqlRequest(value);
                }}
              />
            </div>
          </div>
          <div>
            <div className="text-lg">Graphql String</div>
            <div className="w-full items-center justify-center">
              <Request.Example value={gqlStr} />
            </div>
          </div>
        </div>
        <button className="btn bg-success w-full" onClick={void onSend}>
          <AiOutlineSend className="-mt-0.5" /> Send Request
        </button>
      </div>

      <div>
        <div className="text-lg">Response</div>
        <Response.Result status={response.status} data={response.data as object} />
      </div>
    </div>
  );
};
GraphQL.Try = GraphQLTry;
