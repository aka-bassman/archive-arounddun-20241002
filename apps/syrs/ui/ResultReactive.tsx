import { cnst, usePage } from "@syrs/client";

export interface ResultProps {
  result: cnst.Result;
  isSmall?: boolean;
}

export const ResultReactive = ({ result, isSmall }: ResultProps) => {
  return <>{isSmall ? <SmallResult result={result} /> : <BigResult result={result} />}</>;
};

const BigResult = ({ result }: ResultProps) => {
  const { l } = usePage();
  return (
    <div className=" sm:flex-row flex flex-col mt-4 mb-2 sm:gap-8 sm:px-4">
      <div className="flex-1 sm:p-0 py-8 ">
        <div className=" text-syrs-label ">{l("result.skinAgingLevel")}</div>
        <div className="mt-2 text-xs flex py-2">
          {result.data.skinAgingImprovement && (
            <div className=" text-syrs-label text-4xl -mt-1 p-4 pt-0 mx-2 sm:ml-0 sm:px-0">
              {result.data.skinAgingImprovement}
            </div>
          )}
          <div>{result.data.skinAgingDesc}</div>
        </div>
      </div>
      <div className="flex-1 sm:p-0 py-8 border-y border-y-syrs-label sm:border-none border-opacity-50">
        <div className=" text-syrs-label ">{l("result.sensitivityLevel")}</div>
        <div className="mt-2 text-xs flex py-2">
          {result.data.sensitivityImprovement && (
            <div className=" text-syrs-label text-4xl -mt-1 p-4 pt-0 mx-2 sm:ml-0 sm:px-0">
              {result.data.sensitivityImprovement}
            </div>
          )}
          <div>{result.data.sensitivityDesc}</div>
        </div>
      </div>
      <div className="flex-1 sm:p-0 py-8">
        <div className=" text-syrs-label ">{l("result.oilWaterBalance")}</div>
        <div className="mt-2 text-xs flex py-2">
          {result.data.oilWaterBalanceImprovement && (
            <div className=" text-syrs-label text-4xl -mt-1 p-4 pt-0 mx-2 sm:ml-0 sm:px-0">
              {result.data.oilWaterBalanceImprovement}
            </div>
          )}
          <div>{result.data.oilWaterBalanceDesc}</div>
        </div>
      </div>
    </div>
  );
};
const SmallResult = ({ result }: ResultProps) => {
  const { l } = usePage();

  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-6  relative mb-10">
      <div className="text-syrs-label text-sm text-nowrap pt-6 w-0 h-10 ">{l("result.skinAgingLevel")}</div>
      <div></div>
      {result.data.skinAgingImprovement ? (
        <>
          <div className="col-span-1 text-syrs-label text-center text-[40px] px-2 sm:px-0 font-semibold leading-10">
            {result.data.skinAgingImprovement}
          </div>
          <div className="col-span-1 text-syrs-font text-opacity-70 text-sm">
            {result.data.skinAgingDesc}
            {/* asd fasdf asdf asdfasdf asdfas dfasdf as dfas dfasdf */}
          </div>
        </>
      ) : (
        <div className="col-span-2 text-syrs-font text-opacity-70 text-sm">{result.data.skinAgingDesc}</div>
      )}

      <div className="text-syrs-label text-sm text-nowrap pt-8 w-0 ">
        <hr className="w-full absolute -mt-6 border-t-[0.5px] h-10" />
        {l("result.sensitivityLevel")}
      </div>
      <div></div>
      {result.data.sensitivityImprovement ? (
        <>
          <div className="col-span-1 text-syrs-label text-center text-[40px] px-2 sm:px-0 font-semibold leading-10">
            {result.data.sensitivityImprovement}
          </div>
          <div className="col-span-1 text-syrs-font text-opacity-70 text-sm">
            {result.data.sensitivityDesc}
            {/* asd fasdf asdf asdfasdf asdfas dfasdf as dfas dfasdf */}
          </div>
        </>
      ) : (
        <div className="col-span-2 text-syrs-font text-opacity-70 text-sm">{result.data.sensitivityDesc}</div>
      )}

      <div className="text-syrs-label text-sm text-nowrap pt-8 w-0 ">
        <hr className="w-full absolute -mt-6 border-t-[0.5px] h-10" />
        {l("result.oilWaterBalance")}
      </div>
      <div></div>
      {result.data.oilWaterBalanceImprovement ? (
        <>
          <div className="col-span-1 text-syrs-label text-center text-[40px] px-2 sm:px-0 font-semibold leading-10">
            {result.data.oilWaterBalanceImprovement}
          </div>
          <div className="col-span-1 text-syrs-font text-opacity-70 text-sm">
            {result.data.oilWaterBalanceDesc}
            {/* asd fasdf asdf asdfasdf asdfas dfasdf as dfas dfasdf */}
          </div>
        </>
      ) : (
        <div className="col-span-2 text-syrsoilWaterBalanceDesc-font text-opacity-70 text-sm">
          {result.data.oilWaterBalanceDesc}
        </div>
      )}
    </div>
  );
};
