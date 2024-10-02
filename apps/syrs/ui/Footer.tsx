import { Image, Link } from "@util/ui";

export const Footer = () => {
  return (
    <div className="relative justify-center px-2 pb-12 mt-12 bg-[#f3f3f3] via-secondary-focus to-accent-focus">
      <div className="container py-10">
        <div className="justify-between mt-6 md:flex md:mt-10 sm:mt-0">
          <Link href="/" disabled>
            <Image src="/logo.svg" className="object-contain fill-black" width={200} height={36} />
          </Link>
          <div className="flex gap-4 mt-6 text-xs md:mt-0 md:text-base ">
            <Link href="/termsofservice">
              <span className="text-[#777777]">이용약관</span>
            </Link>
            <Link href="/privacy">
              <span className="text-[#777777]">개인정보처리방침</span>
            </Link>
          </div>
        </div>
        <div className="items-center justify-between mt-6 text-sm md:text-base md:mt-3 md:flex ">
          <div className="flex flex-col text-xs md:text-base gap-1 text-[#777777]">
            퍼핀플래닛(주) | 선강민 | 서울특별시 강남구 선릉로 555, 선릉빌딩 505호
          </div>
          <div>
            <div className="flex gap-4 mt-6 text-xs md:text-base md:mt-0">
              <span className="text-[#777]">문의</span>
              <a href="mailto:hello@puffinplace.com">
                <span className="text-[#777]">hello@puffinplace.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
