"use client";
import { Image, Link } from "@util/ui";
import { st } from "@syrs/client";

export const TopBanner = () => {
  return (
    <Link
      href={"/"}
      className="w-full flex md:justify-start justify-center sm:mb-0 -mb-4"
      onClick={() => {
        st.do.newTest();
        st.do.setImprovementImage(null);
      }}
    >
      <Image src="/Group 85.svg" className="w-14 " width={60} height={60} />
    </Link>
  );
};
