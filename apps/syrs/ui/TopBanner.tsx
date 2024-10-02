"use client";
import { Image, Link } from "@util/ui";
import { st } from "@syrs/client";

export const TopBanner = () => {
  return (
    <Link
      href={"/"}
      className="w-full flex md:justify-start justify-center "
      onClick={() => {
        st.do.newTest();
      }}
    >
      <Image src="/Group 85.svg" className="w-14 " width={60} height={60} />
    </Link>
  );
};
