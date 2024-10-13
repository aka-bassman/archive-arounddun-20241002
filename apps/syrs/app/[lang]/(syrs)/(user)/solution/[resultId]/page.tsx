/* eslint-disable @nx/workspace/noImportExternalLibrary */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";
import { Image, Link, Upload } from "@util/ui";
import { SolutionLoading } from "@syrs/ui/Loading";
import { capitalize } from "@core/common";
import { cnst } from "@shared/client";
import { fetch, st, usePage } from "@syrs/client";
import { router } from "@core/client";
import { useEffect, useState } from "react";
import { useInterval } from "@core/next";

export default function Page({ params: { resultId, lang } }) {
  if (!resultId || typeof resultId !== "string") return null;
  if (!lang || typeof lang !== "string") return null;
  const image = st.use.improvementImage();
  const test = st.use.test();
  const result = st.use.result();
  const { l } = usePage();
  const sliceName = "result";
  const names: { [key: string]: string } = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const [errorComponent, setErrorComponent] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  useEffect(() => {
    void (result && st.do.viewTest(result.testId));
  }, [result?.testId, result]);
  return (
    <div className="w-full h-full flex items-center flex-col flex-grow-0">
      <SolutionLoading
        className={isAnalyzing ? "" : " hidden "}
        bottomRender={() => <div className="text-lg text-center text-syrs-loading">{l("result.analyzingBottom")}</div>}
        topRender={() => (
          <div className=" text-xl font-semibold text-syrs-font">
            {l("result.analyzingTopHead") + (test ? test.name : "") + l("result.analyzingTop")}
          </div>
        )}
        setClose={() => {
          setIsAnalyzing(false);
        }}
      />
      <dialog id="ErrModal" className="modal">
        <div className="modal-box flex flex-col items-center bg-syrs-bg min-w-[530px] px-8">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <div className=" text-3xl w-full text-center text-syrs-font">Consultation Error</div>
          <div className="text-center py-16 text-opacity-70 text-syrs-font">{l("result.errorMsg")}</div>
          <div className="text-center text-syrs-font text-opacity-70 text-3xl">Error Message:</div>
          <br />
          {errorComponent} <br />
          <Link
            className="btn mt-8 border-syrs-logo text-syrs-logo text-lg border-opacity-40 text-opacity-40 hover:border-none hover:bg-syrs-selected hover:text-white font-semibold px-6 py-0 rounded-md"
            href={`/${lang}/test`}
          >
            Return to the beginning.
          </Link>
        </div>
      </dialog>
      <div className="flex flex-col pt-40">
        <Upload.Image
          type="image"
          wrapperClassName=" z-0"
          onSave={async (file) => {
            const files = Array.isArray(file) ? await addFiles(file) : await addFiles([file] as File[]);
            await st.do.setImprovementImage(files[0]);
            setIsAnalyzing(true);
            void st.do
              .calculateImprvement(
                resultId,
                files[0].id,
                (result) => {
                  router.push("/result/" + result.id);
                  setIsAnalyzing(false);
                },
                (error) => {
                  setErrorComponent(error.message);
                  (document.getElementById("ErrModal") as HTMLDialogElement).showModal();
                  setIsAnalyzing(false);
                }
              )
              .then(() => {
                setIsAnalyzing(false);
              });
          }}
          onRemove={() => {
            st.do.setImprovementImage(null);
          }}
          protoFile={image}
          styleType="square"
          renderEmpty={() => (
            <div className="w-full text-syrs-selected">
              <div className=" rounded border py-24 px-40 border-dashed border-syrs-selected flex justify-center items-center">
                <Image src="/microscope.svg" className="w-20 " width={66} height={66} />
              </div>
              <div className=" text-lg mt-8">{l("test.imageUpload")}</div>
            </div>
          )}
        />
      </div>
      <div className="flex w-full justify-center"></div>
    </div>
  );
}
