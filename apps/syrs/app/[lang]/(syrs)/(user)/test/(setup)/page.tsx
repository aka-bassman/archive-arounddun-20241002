/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";

import { Field } from "@shared/ui";
import { Image } from "@util/ui";
import { getSelf, router } from "@core/client";
import { st, usePage } from "@syrs/client";
import { useEffect } from "react";

export default function Page() {
  const { l, lang } = usePage();

  const self = getSelf();
  const testForm = st.use.testForm();
  useEffect(() => {
    st.do.setLangOnTest(lang);
    st.do.setImprovementImage(null);
  }, []);

  useEffect(() => {
    if (!router.isInitialized) return;
    st.do.setLangOnTest(lang);
    router.refresh();
  }, [lang]);
  return (
    <>
      <div className="flex justify-center items-center sm:justify-between sm:items-end min-h-max gap-16 flex-col sm:flex-row mt-16  h-full">
        <div className="flex-[137]  sm:h-auto h-16 max-w-[205.5px]">
          <Image src="/skinAgingLevel.svg" width={137} height={120} />
        </div>
        <div className="flex-[135] sm:h-auto h-16 max-w-[202.5px]">
          <Image src={"/sensitivityLevel.svg"} width={135} height={73} />
        </div>
        <div className="flex-[150] sm:h-auto h-16 max-w-[225px]">
          <Image src="/oilWaterBalance.svg" width={150} height={108} />
        </div>
        <div className="flex-[94] sm:h-auto h-16 max-w-[141px]">
          <Image src="/skinAge.svg" width={94} height={132} />
        </div>
      </div>
      <div className=" text-syrs-font text-opacity-80 text-sm mt-8  whitespace-pre-wrap">{l("test.consult")}</div>
      <div className=" flex flex-wrap md:flex-nowrap md:flex-col mt-16 w-full gap-8">
        <Field.Text
          label={l("test.name")}
          nullable
          value={testForm.name}
          onChange={st.do.setNameOnTest}
          className="w-full text-syrs-font text-opacity-80 text-sm max-w-[768px]"
          inputClassName=" border-none h-8 mt-2 bg-syrs-selector"
        />
        <div className="flex gap-12 flex-wrap">
          <Field.DateDropdown
            label={l("test.dateOfBirth")}
            nullable
            value={testForm.dateOfBirth}
            onChange={st.do.setDateOfBirthOnTest}
            className="text-syrs-font text-opacity-80 text-sm "
            dropdownClassName="w-full border-none bg-syrs-selector mt-2 h-8 min-w-14 px-4 "
            selectedClassName="text-primary bg-syrs-bg"
            selectorClassName=" bg-syrs-selector text-center "
          />
          <Field.Dropdown
            label={l("test.lang")}
            options={[
              { label: "English", value: "en" },
              { label: "한국어", value: "ko" },
              { label: "日本語", value: "ja" },
              { label: "ไทย", value: "th" },
            ]}
            nullable
            value={testForm.lang}
            onChange={(e) => {
              if (!e) return;
              router.setLang(e);
            }}
            className="w-full max-w-32 text-syrs-font text-opacity-80 text-sm"
            dropdownClassName="w-full border-none bg-syrs-selector mt-2 h-8 "
            selectedClassName="text-primary bg-syrs-bg"
            selectorClassName=" bg-syrs-selector text-center "
          />
        </div>
        <Field.Text
          label={l("test.email")}
          nullable
          value={testForm.email}
          onChange={st.do.setEmailOnTest}
          className="w-full text-syrs-font text-opacity-80 text-sm max-w-[768px]"
          inputClassName=" border-none h-8 mt-2 bg-syrs-selector"
        />
      </div>
      <div className=" flex sm:absolute bottom-8 right-6">
        <label
          htmlFor="policy"
          className="btn border-syrs-logo text-syrs-logo text-xl border-opacity-40 text-opacity-40 hover:border-none hover:bg-syrs-selected hover:text-white text-wh font-semibold px-6 py-0 rounded-md"
        >
          {l("test.start")}
        </label>
      </div>
      <input type="checkbox" id="policy" className="modal-toggle" />
      <div className="modal max-w-none" role="dialog">
        <div className="modal-box w-11/12 max-w-[570px] flex-col items-center bg-[#F6F3EE] text-syrs-font text-opacity-70 px-12">
          <h3 className=" text-center text-3xl my-8 text-syrs-font text-opacity-100 whitespace-pre-wrap">
            {l("test.privacyTitle")}
          </h3>
          <p className="text-center leading-[2rem] whitespace-pre-wrap">{l("test.privacySubTitle")}</p>
          <div className=" text-xs text-opacity-20 overflow-auto max-h-[368px] mt-8 px-2 pl-4 bg-white bg-opacity-80 rounded scrollbar-syrs-selected scrollbar-track-transparent scrollbar-thin scrollbar-thumb-syrs-selected py-4 whitespace-pre-wrap">
            <p className="font-semibold">{l("test.privacyP1Title")}</p>
            <br />
            <p>{l("test.privacyP1")}</p>
            <p>
              <br />
              <span className="font-semibold">{l("test.privacyP2Title")}</span>
              <br />
            </p>
            <p>{l("test.privacyP2")}</p>
            <br />
            <p>
              <span className="font-semibold">{l("test.privacyP3Title")}</span>
              <br />
            </p>
            <p>{l("test.privacyP3")}</p>
            <br />
            <p>
              <span className="font-semibold">{l("test.privacyP4Title")}</span>
              <br />
              {l("test.privacyP4")}
            </p>
          </div>
          <label
            className="cursor-pointer flex items-center w-full justify-center my-8"
            onClick={() => {
              router.push("/test/Image");
            }}
          >
            <input
              type="checkbox"
              className="checkbox [--chkbg:theme(colors.syrs-selected)] [--chkfg:white] border-2 rounded-none border-syrs-selected opacity-70 checkbox-sm mr-2"
            />
            <span className="label-text font-medium">{l("test.privacyAgree")}</span>
          </label>
          {/* <div className="flex w-full justify-center">
            <button
              className="btn border-syrs-logo text-syrs-logo text-xl border-opacity-40 text-opacity-40 hover:border-none hover:bg-syrs-selected hover:text-white text-wh font-semibold px-6 py-0 rounded-md"
              onClick={() => {
                router.push("/test/Image");
              }}
            >
              {l("test.start")}
            </button>
          </div> */}
          <label htmlFor="policy" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </label>
        </div>
        <label className="modal-backdrop" htmlFor="policy">
          Close
        </label>
      </div>
    </>
  );
}
