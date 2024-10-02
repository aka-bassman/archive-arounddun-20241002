/* eslint-disable @nx/workspace/noImportExternalLibrary */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";
import { ResultReactive, Solution } from "@syrs/ui";
import { router } from "@core/client";
import { st, usePage } from "@syrs/client";
import { useEffect } from "react";

export default function Page({ params: { resultId } }) {
  const { l, lang } = usePage();
  const isSmall = st.use.isSmall();
  useEffect(() => {
    const loadResult = async () => {
      await st.do.viewResult(resultId as string);
    };
    const result = loadResult();
  }, [resultId]);
  const result = st.use.result();

  const pageTitle = {
    typeA: "[Type A - Expression Lines Skin]",
    typeB: "[Type B - Derteriorated Skin]",
    typeC: "[Type C - Pigmented Skin]",
    typeD: "[Type D - Unbalanced Skin]",
  };
  type Products =
    | "antiAgingAmpule"
    | "tighteningRepairCream"
    | "deepCareMask"
    | "whiteningAmpoule"
    | "cicaCalmingAmpoule"
    | "clearCoverMoisturizer"
    | "essentialToner"
    | "cleansingBalm";
  const products: {
    [key in Products]: {
      src?: string;
      title: string;
      subTitle: string;
      descriptions: string[];
      volume: string;
      footer?: string[];
      href?: string;
    };
  } = {
    antiAgingAmpule: {
      src: "antiAgingAmpoule.png",
      title: l("result.antiAgingAmpoule-title"),
      subTitle: l("result.antiAgingAmpoule-subTitle"),
      descriptions: [
        l("result.antiAgingAmpoule-desc1"),
        l("result.antiAgingAmpoule-desc2"),
        l("result.antiAgingAmpoule-desc3"),
        l("result.antiAgingAmpoule-desc4"),
      ],
      volume: l("result.antiAgingAmpoule-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.antiAgingAmpoule-href"),
    },
    tighteningRepairCream: {
      src: "tighteningRepairCream.png",
      title: l("result.tighteningRepairCream-title"),
      subTitle: l("result.tighteningRepairCream-subTitle"),
      descriptions: [
        l("result.tighteningRepairCream-desc1"),
        l("result.tighteningRepairCream-desc2"),
        l("result.tighteningRepairCream-desc3"),
        l("result.tighteningRepairCream-desc4"),
      ],
      volume: l("result.tighteningRepairCream-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.tighteningRepairCream-href"),
    },
    deepCareMask: {
      src: "deepCareMask.png",
      title: l("result.deepCareMask-title"),
      subTitle: l("result.deepCareMask-subTitle"),
      descriptions: [
        l("result.deepCareMask-desc1"),
        l("result.deepCareMask-desc2"),
        l("result.deepCareMask-desc3"),
        l("result.deepCareMask-desc4"),
        l("result.deepCareMask-desc5"),
      ],
      volume: l("result.deepCareMask-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.deepCareMask-href"),
    },
    whiteningAmpoule: {
      src: "whiteningAmpoule.png",
      title: l("result.whiteningAmpoule-title"),
      subTitle: l("result.whiteningAmpoule-subTitle"),
      descriptions: [
        l("result.whiteningAmpoule-desc1"),
        l("result.whiteningAmpoule-desc2"),
        l("result.whiteningAmpoule-desc3"),
        l("result.whiteningAmpoule-desc4"),
      ],
      volume: l("result.whiteningAmpoule-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.whiteningAmpoule-href"),
    },
    cicaCalmingAmpoule: {
      src: "cicaCalmingAmpoule.png",
      title: l("result.cicaCalmingAmpoule-title"),
      subTitle: l("result.cicaCalmingAmpoule-subTitle"),
      descriptions: [
        l("result.cicaCalmingAmpoule-desc1"),
        l("result.cicaCalmingAmpoule-desc2"),
        l("result.cicaCalmingAmpoule-desc3"),
        l("result.cicaCalmingAmpoule-desc4"),
      ],
      volume: l("result.cicaCalmingAmpoule-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.cicaCalmingAmpoule-href"),
    },
    clearCoverMoisturizer: {
      src: "clearCoverMoisturizer.png",
      title: l("result.clearCoverMoisturizer-title"),
      subTitle: l("result.clearCoverMoisturizer-subTitle"),
      descriptions: [
        l("result.clearCoverMoisturizer-desc1"),
        l("result.clearCoverMoisturizer-desc2"),
        l("result.clearCoverMoisturizer-desc3"),
        l("result.clearCoverMoisturizer-desc4"),
      ],
      volume: l("result.clearCoverMoisturizer-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.clearCoverMoisturizer-href"),
    },
    essentialToner: {
      src: "essentialToner.png",
      title: l("result.essentialToner-title"),
      subTitle: l("result.essentialToner-subTitle"),
      descriptions: [l("result.essentialToner-desc1"), l("result.essentialToner-desc2")],
      volume: l("result.essentialToner-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.essentialToner-href"),
    },
    cleansingBalm: {
      src: "cleansingBalm.png",
      title: l("result.cleansingBalm-title"),
      subTitle: l("result.cleansingBalm-subTitle"),
      descriptions: [
        l("result.cleansingBalm-desc1"),
        l("result.cleansingBalm-desc2"),
        l("result.cleansingBalm-desc3"),
        l("result.cleansingBalm-desc4"),
      ],
      volume: l("result.cleansingBalm-volume"),
      footer: [l("result.sol-footer1"), l("result.sol-footer2")],
      href: l("result.cleansingBalm-href"),
    },
  };
  const solutions = {
    typeA: [
      products.antiAgingAmpule,
      products.tighteningRepairCream,
      products.deepCareMask,
      products.whiteningAmpoule,
      products.cicaCalmingAmpoule,
      products.clearCoverMoisturizer,
      products.essentialToner,
      products.cleansingBalm,
    ],
    typeB: [products.tighteningRepairCream, products.deepCareMask],
    typeC: [products.whiteningAmpoule, products.cicaCalmingAmpoule, products.clearCoverMoisturizer],
    typeD: [products.essentialToner, products.cicaCalmingAmpoule, products.clearCoverMoisturizer],
    typeE: [products.cleansingBalm, products.clearCoverMoisturizer, products.cicaCalmingAmpoule],
  };

  if (!result) return null;
  return (
    <div className="w-full h-full flex flex-col text-syrs-font">
      <div className=" text-syrs-font text-opacity-80 sm:text-4xl text-xl mb-8">
        {pageTitle[result.data.type as keyof typeof pageTitle]}
      </div>
      <div className="text-syrs-label text-lg sm:px-6">{l("result.skinAge")}</div>
      <div className="flex w-full mb-8 px-6">
        <div className=" sm:text-8xl text-6xl text-opacity-80 sm:mx-6 text-syrs-font font-medium">
          {result.data.skinAge}
        </div>
        <div className=" flex-grow sm:min-w-96 sm:text-sm text-xs ml-4 mt-2 break-words">{result.data.overview}</div>
      </div>
      <ResultReactive result={result} isSmall={isSmall} />
      <div className=" text-primary mt-8 text-opacity-65 text-xl mb-4">
        {result.data.type.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (str) => str.toUpperCase())} Solution
      </div>
      <div className="carousel carousel-center space-x-2 min-h-max sm:mb-0 mb-8 sm:min-w-[320px] sm:space-x-4 rounded-none">
        {solutions[result.data.type].map((solution, i) => (
          <div className="carousel-item min-h-max" key={i}>
            <Solution {...solution} index={i + 1} isSmall={isSmall} />
          </div>
        ))}
      </div>
      <div className="my-8 w-full flex justify-end">
        {!result.prevResultId && (
          <div
            className=" ml-auto btn border-2   border-syrs-logo text-syrs-logo text-lg border-opacity-40 text-opacity-40 hover:border-none hover:bg-syrs-selected hover:text-white font-semibold px-4 py-0 rounded-md"
            onClick={() => {
              if (!(typeof lang === "string" && typeof resultId === "string")) return;
              router.push("/solution/" + resultId);
            }}
          >
            {l("result.use solution")}
          </div>
        )}
      </div>
    </div>
  );
}
