"use client";
import { System } from "@shared/ui";
import { st } from "@syrs/client";
import { useEffect, useRef } from "react";

export default function Layout({ children }) {
  const isSmall = st.use.isSmall();
  const isSmallRef = useRef(isSmall);
  const setIsSmall = (data: boolean) => {
    isSmallRef.current = data;
    st.do.setIsSmall(data);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && !isSmallRef.current) {
        setIsSmall(true);
      } else if (window.innerWidth > 640 && isSmallRef.current) {
        setIsSmall(false);
      }
    };

    // 창 크기 변경 이벤트 리스너 추가
    handleResize();
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <System.Root st={st}>{children}</System.Root>;
}
