/* eslint-disable @nx/workspace/noImportExternalLibrary */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";
import { Image, Upload } from "@util/ui";
import { capitalize } from "@core/common";
import { cnst } from "@shared/client";
import { fetch, st, usePage } from "@syrs/client";
import { router } from "@core/client";
import { useInterval } from "@core/next";

export default function Page() {
  const { l } = usePage();
  const testForm = st.use.testForm();
  const sliceName = "test";
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  const value = testForm.image;

  useInterval(async () => {
    if (value?.status !== "uploading") return;
    st.do.setImageOnTest(await fetch.file(value.id));
  }, 1000);
  return (
    <div className="w-full h-full flex items-center flex-col flex-grow-0">
      <div className="flex flex-col pt-40">
        <Upload.Image
          type="image"
          onSave={async (file) => {
            const files = Array.isArray(file) ? await addFiles(file) : await addFiles([file] as File[]);
            st.do.setImageOnTest(files[0]);
            router.push("/test/question");
          }}
          onRemove={() => {
            st.do.setImageOnTest(null);
          }}
          protoFile={testForm.image}
          styleType="square"
          renderEmpty={() => (
            <div className="w-full text-syrs-selected">
              <div className=" rounded border py-24 px-40 border-dashed border-syrs-selected flex justify-center items-center text-[#DDD3CA]">
                <Image src="/microscope.svg" className="w-20 " width={66} height={66} />
              </div>
              <div className=" text-lg mt-8">{l("test.imageUpload")}</div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
