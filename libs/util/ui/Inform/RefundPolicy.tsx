import { HtmlContent } from "../HtmlContent";

interface RefundPolicyProps {
  className?: string;
  // companyName: string;
  // serviceName: string;
  startDateStr?: string;
}
export const RefundPolicy = ({
  className,
  // companyName,
  // serviceName,
  startDateStr = "2023년 1월 1일",
}: RefundPolicyProps) => {
  const content = `
  환불 대상 O
  - 대화가 열린 후 상대방이 72시간 동안 무응답 혹은
  사칭 혹은 제재를 당한 경우 대상자에 해당합니다.

  환불 대상 X
  - 상대방에게 친구 요청, 상대방에게 친구 요청 후
  일주일이 경과되어 사라진 경우는 환불이 불가합니다.
  이와 관련된 문의사항은 언제든지 
  hello@puffinplace.com으로 연락주시기 바랍니다.

  결제 후 7일 내 사용하지 않은 경우 환불이 가능합니다.
  재화를 사용한 경우 환불 대상에서 제외대며, 잔여 재화의 부분 환불은 불가합니다.
  \n\n
  비정기 청구, 구매 후 지정된 기간이 지날 시 군한은 소멸됩니다.
  모든 개인정보는 엘유 개인정보 취급 방침 및 서비스 이용약관에
  따라 관리됩니다.`;
  return <HtmlContent className={className} content={content} />;
};
