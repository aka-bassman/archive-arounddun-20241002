import { HtmlContent } from "../HtmlContent";

interface ServicePolicyProps {
  className?: string;
  companyName: string;
  serviceName: string;
  startDateStr?: string;
}
export const ServicePolicy = ({
  className,
  companyName,
  serviceName,
  startDateStr = "2023년 1월 1일",
}: ServicePolicyProps) => {
  const content = `<p>제 1조 목적
이 약관은 ${companyName}(이하 "회사")에서 제공하는 "${serviceName}"에서 제공하는 제반 서비스(이하 "서비스")에 접속과 사용자에 의해서 업로드 및 다운로드 되어 표시되는 모든 정보, 텍스트, 이미지 및 기타 자료를 이용하는 이용자(이하 "회원")와 서비스 이용에 관한 권리 및 의무와 책임사항, 기타 필요한 사항을 규정하는 것을 목적으로 합니다.
제 2조 용어의 정의
- 서비스: 개인용 컴퓨터 (PC), TV, 휴대형 단말기, 전기통신설비 등 포함 각종 유무선 장치와 같이 구현되는 단말기와 상관없이 회원이 이용할 수 있는 "${serviceName}" 관련 제반 서비스를 의미합니다.
- 회원: 회사와 서비스 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 모든 사용자를 의미합니다.
- 아이디: 회원이 가입할 때 입력한 회원 본인의 이메일 주소를 의미합니다.
- 비밀번호: 회원의 개인 정보 및 확인을 위해서 회원이 정한 문자 또는 숫자의 조합을 의미합니다.
- 도메인: 회원의 서비스 이용을 위하여 회사가 부여한 고유한 인터넷 주소를 의미합니다. 회사는 제공하는 제반 서비스를 위해서 서비스에 따라 별도의 도메인 주소를 추가적으로 제공합니다.
- 유료서비스: 회사가 유료로 제공하는 각종 온라인디지털콘텐츠 및 제반 서비스를 의미합니다.
- 유료재화: 서비스를 이용 또는 구매하기 위해 사용되는 가상의 화폐 단위로서 회원이 대금을 지급하고 구입하는 것을 의미합니다.
제 3조 이용약관의 효력 및 변경
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력이 발생합니다.
2. 이 약관의 내용은 서비스를 통해 게시하여 회원에게 공시하고, 이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.
3. 사업자가 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스초기화면에 그 적용일 최소한 7일 이전부터 적용일 후 상당한 기간동안 공지한다.
다만 이용자에게 불리하거나 중대한 사항을 변경할 경우에는 최소한 30일 이전부터 공지하며, 기존이용자에게는 변경될 약관, 적용일자 및 변경사유를 이메일, 문자메시지 등으로 고지한다. 4. 사업자가 약관을 변경할 경우에는 제3항의 공지 및(또는) 고지와 함께 또는 그 후에 변경약관의 적용에 대한 이용자의 동의 여부를 확인한다. 이 경우 동의나 거절의 방법을 위 공지 및(또는) 고지 시에 함께 알려야 한다.
예시 ) 중대한 사항
중대한 사항이라 함은 사회통념에 비추어 이용자에게 불리하거나 약관에 정하여져 있는 중요한 내용으로 이를 예시하면 다음과 같다.
1. 급부의 변경
2. 청약의 철회, 계약의 해제 및 해지
3. 포인트, 아이템 등의 유효기간 변경
5. 회원은 변경된 약관에 대하여 동의하지 않을 경우 서비스 이용을 중단하고 이용 계약을 해지할 수 있으며, 만약 변경된 약관의 적용 이후에도 서비스를 계속 이용하는 경우에는 약관의 변경 사항에 동의한 것으로 간주합니다.
6. 본 약관에서 정하지 아니한 본 약관의 해석에 관하여는 본 약관 관련법령 또는 상관례에 따릅니다.
제 4조 약관 외 준칙
이 약관에 명시되지 않은 사항에 대해서는 콘텐츠산업진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관계법령 및 회사가 정한 서비스의 세부 이용 지침 등의 규정에 의합니다.
개인정보 및 위치정보에 관해서는 개인정보 처리방침 및 위치기반 이용약관이 적용됩니다.
서비스 이용 계약
제 5조 이용계약의 성립
1. 이용계약은 회원이 "${serviceName}" 서비스 및 제반 서비스에서 제공하는 회원가입 페이지에서 서비스 이용약관에 동의한 후 이용신청을 하고 신청한 내용에 대해서 회사가 승낙함으로써 체결됩니다.
2. 회사는 이용약관에 동의한 후 이용신청한 사용자에 대해서 서비스 이용을 승낙함을 원칙으로 합니다. 다만 업무 수행상 또는 기술상 지장이 있을 경우 일정시간 가입승인을 유보할 수 있습니다.
제 6조 이용 신청
1. 회원으로 가입하고자 하는 이용자는 회사가 요청하는 양식에 필요한 정보를 입력하여 이용 신청을 합니다.
2. 가입시 기재하는 사항에는 필수 항목 및 선택 항목이 있으며 필수 항목을 모두 기입해야만 이용 신청이 완료됩니다.
3. 필수 항목에는 아이디(E-mail), 비밀번호, 닉네임, 휴대폰 번호 및 기타 회사가 필요하다고 인정하는 사항이 포함됩니다.
제 7조 이용 신청의 승낙과 제한
1. 회사는 제6조에서 정한 사항을 정확히 기재한 이용자에 대하여 서비스 이용 신청을 승낙합니다.
2. 회사는 다음 각 호에 해당하는 신청에 대해서 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
- 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우
- 제3자의 전자우편 주소를 이용하여 신청한 경우
- 허위의 정보를 기재하거나, 회사가 필수적으로 입력을 요청한 부분을 기재하지 않은 경우
- 부정한 용도로 서비스를 사용하고자 하는 경우
- 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반하며 신청하는 경우
- 회사의 정책에 적합하지 않는 회원으로 판단되는 경우나 서비스 제공이 곤란한 경우
- 회원의 이용 목적이나 서비스 이용 방법이 회사의 재산권이나 영업권을 침해하거나 침해할 우려가 있는 경우
- 비정상적인 방법을 통하여 아이디 및 도메인을 대량으로 생성하는 행위
3. 회사는 다음 사항에 해당하는 경우에 승낙을 보류할 수 있습니다.
- 회사의 설비나 기술 상의 이유로 서비스 이용 승낙이 곤란한 경우
- 이용 신청자의 연령이 만18세 이하일 경우
- 최근 7일 이내에 이용 계약을 해지한 적이 있는 이용자가 신청하는 경우
4. 회사는 이용 계약 절차 완료 이후 제2항 각 호에 따른 사유가 발견된 경우 즉시 이용 승낙을 철회할 수 있으며 해당 이용자는 서비스 이용과 관련하여 아무런 권리를 주장할 수 없습니다.
제 8조 계약 사항의 변경
1. 회원은 이용 신청시 기재한 사항이 변경되었을 경우 회사가 별도로 정하는 방법에 따라 수정하여야 합니다.
2. 이용자의 ID 또는 닉네임 등 기재사항이 다음에 해당하는 경우에는 회원의 요청 또는 회사의 직권으로 변경 또는 이용을 정지할 수 있습니다.
- 타인에게 혐오감을 주거나 미풍양속에 어긋나는 경우 또는 사생활 침해가 우려되는 경우
- 회사, 회사의 서비스 또는 운영자, 관리자 등의 명칭과 동일하거나 유사하여 오인의 우려가 있는 경우
- 기타 합리적인 사유가 있는 경우
서비스 이용
제 9조 서비스의 이용 개시
회사는 회원과 서비스 이용 계약이 성립한 때로부터 서비스를 개시합니다. 다만 가입기간 혹은 특정한 자격 조건을 지정한 일부 서비스는 회원의 해당 조건이 충족된 이후 서비스를 개시합니다.
제 10조 서비스 이용 시간
1. 서비스는 연중무휴, 1일 24시간 운영을 원칙으로 합니다.
2. 단 회사의 업무상 또는 기술상의 이유, 서비스의 점검 및 기타 부득이한 사유로 서비스가 일시 중지될 수 있으며, 예정되어 있는 서비스 중지는 사전에 서비스를 통해 공지합니다.
3. 회사는 메뉴별로 서비스 이용가능 시간을 별도로 정할 수 있으며, 그 내용을 공지합니다.
제 11조 서비스의 변경 및 중지
1. 회사가 제공하는 서비스의 내역은 서비스 개선 또는 기타 사유에 의하여 변동될 수 있습니다. 중요 변경사실에 대해서는 사전에 서비스를 통해 공지합니다.
2. 회사는 설비의 보수, 서비스 제공에 연관된 계약의 종료, 새로운 서비스로의 교체, 기타 불가피한 사유가 있을 경우 서비스의 일부 또는 전부를 완전히 중단할 수 있습니다.
3. 제2항에 의한 서비스 중단의 경우 제 22 조에서 정한 방법으로 이용자에게 통지합니다. 단 회사가 통제할 수 없는 사유로 인한 서비스 중단으로 인하여 사전 통지가 불가능한 경우에는 그러하지 아니합니다.
제 12조 게시물 또는 콘텐츠
1. 회사는 서비스 내에 회원이 매칭할 수 있는 콘텐츠를 용도별로 구분하여 제공하며 각 콘텐츠의 용도에 대하여 서비스를 통해 공지합니다. 단, 콘텐츠 이름만으로 그 용도가 명확하게 인지되는 경우에는 별도로 공지하지 않을 수 있습니다.
2. 회사는 회원에 대해 회사정책에 따라 회원별로 구분하여 이용시간, 이용횟수, 서비스 메뉴 등을 세분하여 이용(새로운 기능 및 서비스 등)에 차등을 둘 수 있습니다. 3. 회사는 회원이 서비스 내에 게시하거나 전달하는 모든 내용물(회원간 전달 포함)이 다음 각 호에 해당한다고 판단될 경우 사전 통보 없이 게시 중단, 이동, 삭제 등의 조치를 취할 수 있고, 필요하다고 판단되는 경우 해당 회원의 서비스 이용 자격을 제한하거나 정지, 상실시킬 수 있습니다.
- 회사, 다른 회원 또는 제3자에 대한 인신공격, 비방, 욕설, 명예훼손 내용이 포함된 경우
- 공공질서 및 미풍양속에 위반되는 내용을 유포하는 경우
- 위법행위, 범죄행위와 결부되는 내용인 경우
- 회사, 다른 회원 또는 제3자의 저작권이나 초상권 등 기타 권리를 침해하는 내용일 경우
- 회사의 운영진, 직원 또는 관계자를 사칭하는 게시물인 경우
- 회사가 승인하지 않은 광고, 홍보물을 게시한 경우
- 타인에게 불쾌감을 주거나 회원간 분쟁을 야기하는 내용으로서, 이러한 분쟁으로 회사의 업무가 방해되거나 방해되리라고 판단되는 경우
- 제1항에서 지정한 용도에 맞지 않는 내용을 게시한 경우
- 기타 관계법령에 위배되거나, 회사에서 정한 매칭 원칙에 어긋나는 경우
- 다른 회원의 신고가 접수된 경우
- 다른 회원의 신고가 접수되어 신고내용이 위 각 호에 해당하는 경우
제 13조 게시물에 대한 저작권
1. 회원이 서비스 내에 작성한 텍스트, 이미지, 동영상, 링크 등의 기타 정보(이하 "게시물")에 대한 책임 및 권리는 게시물을 등록한 회원에게 있습니다.
2. 회원 또는 회사가 서비스 내에 게시한 게시물은 저작권법에 의한 보호를 받으며, 게시물의 저작권은 해당 게시물의 작성자에게 귀속합니다.
3. 회원은 다음 각 호에 해당하는 범위 내에서 회원이 등록한 게시물을 회사가 사용하는 것을 허락합니다.
- 서비스 내에서 게시물의 복제, 전송, 전시, 배포 및 이를 위하여 게시물 크기를 변화하거나 단순화하는 등의 방식으로 수정하는 것
- 서비스 운영 및 홍보를 위해 게시물을 사용, 저장, 복제, 수정, 공중 송신, 전시, 배포 등의 방식으로 이용하는 것.
- 본 항에 따른 복제, 전송, 전시, 배포의 범위에는 회사가 운영하는 관련 사이트의 서비스 및 홍보 수단이 포함됩니다.
- 본 항에 대하여 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는 서비스 내 관리기능을 통해 해당 게시물에 대해 삭제, 검색 결과 제외, 비공개 등의 조처를 할 수 있습니다
4. 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는 서비스 내 관리기능을 통해 자신의 게시한 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 취할 수 있습니다.
5. 회사는 제3항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우 전화, E-Mail 또는 기타 서비스 내에서 회사가 제공하는 방식으로 사전에 회원에게 동의를 얻어야 합니다.
6. 회원이 회원탈퇴를 한 경우에는 본인이 생성한 게시물은 삭제되지 않습니다. 단, 탈퇴 하기 전 본인의 게시물을 스스로 삭제할 수 있습니다. 게시물이 제3자에 의하여 보관되거나 무단복제 등을 통하여 복제됨으로써 해당 저작물이 삭제되지 않고 재 게시된 경우에 대하여 회사는 책임을 지지 않습니다.
7. 회사는 회사의 합병, 영업양도, 회사가 운영하는 사이트간의 통합, 서비스 개편 등의 사유로 원래의 게시물의 내용을 변경하지 않고 게시물의 게시 위치를 변경할 수 있습니다.
제 14조 결제, 환불 및 결제 취소
1. 회원은 회사가 제공하는 다양한 결제수단을 통해 유료서비스를 이용할 수 있으며, 결제가 비정상적으로 처리되어 정상처리를 요청할 경우 회사는 회원의 결제금액을 정상처리 할 의무를 가집니다.
2. 회사는 부정한 방법 또는 회사가 금지한 방법을 통해 충전 및 결제된 금액에 대해서는 이를 취소하거나 환불을 제한할 수 있습니다.
3. 회원은 다음 각 호의 사유가 있으면 아래의 4항의 규정에 따라서 회사로부터 결제 취소, 환불 및 보상을 받을 수 있습니다.
- 결제를 통해 사용할 수 있는 서비스가 전무하며 그에 대한 책임이 전적으로 회사에 있을 경우 (단, 사전 공지된 시스템 정기 점검 등의 불가피한 경우는 제외)
- 회사 또는 결제대행사의 시스템의 오류로 인하여 결제기록이 중복으로 발생한 경우
- 서비스 종료 등의 명목으로 회사가 회원에게 해지를 통보하는 경우
- 기타 소비자 보호를 위하여 당사에서 따로 정하는 경우.
- 회원이 미사용한 아이템을 유료 결제 후 7일 이내에 환불 요청 하는 경우.
4. 환불, 결제 취소 절차는 다음 각 항목과 같습니다.
- 환불을 원하는 회원은 전자 우편을 통해 회원 본인임을 인증하는 절차를 거쳐 고객센터에 접수하셔야 하며 본인 인증과 동시에 환불을 신청하여야 합니다. 다만, Apple ID를 이용해 구독한 상품 또는 Google 계정을 이용해 구독한 상품의 경우는 9항에 따릅니다.
- 회사는 회원이 환불 요청 사유가 적합한지를 판단하고 3항의 환불사유가 존재하고, 적합한 절차를 거친 것으로 판명된 회원에게 환불합니다.
- 회사는 회원에게 환불되어야 할 금액 산정 방식과 절차를 회원에게 상세히 설명하고 난 후 회원에게 해당 환불 및 결제 취소 처리합니다.
- 회원은 구매시점으로부터 7일 이내인 경우 환불 요청이 가능하며 구매시점 7일 이후에는 시스템 오류로의 미지급 등 회사의 귀책사유로 인정되는 경우에만 환불이 가능합니다.
5. 회원이 이용약관을 위반한 행위로 인해 이용정지 또는 강제탈퇴 되는 경우 환불 및 보상하지 않습니다.
6. 회원의 자진탈퇴로 인해 계약이 해지되는 경우, 회원이 보유한 아이템은 자동으로 소멸되어 복구 및 환불이 불가능합니다.
7. 신원 인증과정에서 회원의 등록정보가 허위 정보로 판명되거나 가입 조건에 부합되지 않는 점이 판명될 경우 징계 및 강제 탈퇴가 되며 회원 본인의 귀책사유로 인해 환불 및 보상이 불가능합니다.
8. 회사와 이용자간에 발생한 분쟁은 전자문서 및 전자거래 기본법 제32조에 의거하여 설치된 기관인 전자거래분쟁조정위원회의 조정에 따를 수 있습니다.
9. 구독 아이템 환불 요청 방법
Apple ID를 이용해 구독 상품을 구매한 경우 ${serviceName}가 아니라 Apple에서 환불 처리를 합니다. 먼저 구독을 취소하려면 설정 앱의 iTunes 항목에서 Apple ID를 클릭해 Apple ID 보기 메뉴를 선택한 다음 나오는 화면에서 다시 구독 메뉴를 골라 구독 취소를 하셔야 합니다. 환불을 원하시면 iTunes를 열어 귀하의 Apple ID를 클릭하고 구매 내역을 선택한 다음 구매 내역 중에 환불을 원하는 항목을 찾아 문제 보고를 눌러 상담원과 연결하셔야 합니다. Google Play 계정을 이용해 구독 상품을 구매한 경우 Google Play 앱에서 직접 취소하거나 주문 번호와 함께 고객 센터(hello@claire.team)로 연락해주셔야 합니다.
제 15조 정보의 제공 및 광고 게재
1. 회사는 본 서비스의 운영과 관련하여 광고성 정보를 제공하는 서비스를 운영할 수 있습니다.
2. 회사는 광고성 정보 및 회원 맞춤형 정보를 쪽지, 문자 메시지나 이메일, 전화 또는 카카오톡 플러스 친구, 앱 내 PUSH 메시지 형식으로 제공 할 수 있으며, 이는 광고성 정보에 대한 사전 수신 동의가 있는 경우 등 법령상 허용된 경우에 한하여 제공됩니다.
3. 회원은 약관의 개정 및 관련법령 공지, 거래관련 정보, 고객센터 답변 등을 제외하고 선택적으로 일부 전달 방법에 대하여(E-Mail, 우편, 전화 등) 거부 의사를 표시할 수 있습니다.
4. 회사는 서비스 개선 및 회원 대상의 서비스 소개 등의 목적으로 회원의 동의 하에 관련 법령에 따라 추가적인 개인 정보를 수집할 수 있습니다.
5. 회원은 서비스상에 게재되어 있는 광고를 이용하거나 서비스를 통한 광고주의 판촉활동에 참여할 수 있으며 이 과정에서 회원과 광고주간에 문제가 발생할 경우에 회사는 아래 각 호의 활동을 위하여 노력합니다.
- 회사는 회원의 권익보호와 피해방지를 위해 회사가 제공할 수 있는 범위 내의 관련 정보(판촉활동에 참여한 회원의 당첨 여부 등)를 제공합니다.
- 회사는 회원에게 고의적으로 피해를 입한 사실이 언론보도 등을 통하여 객관적으로 증명된 광고주에 대하여 광고 게재 중단, 광고 계약 체결 제한 등의 조치를 취합니다.
6. 회사는 광고성 정보 및 회원 맞춤형 정보를 문자 메시지나 이메일 또는 카카오톡 플러스 친구, 앱 내 PUSH 메시지 형식으로 제공 할 수 있으며, 이는 광고성 정보에 대한 사전 수신 동의가 있는 경우 등 법령상 허용된 경우에 한하여 제공됩니다.
의무 및 책임한계
제 16조 회사의 의무
1. 회사는 계속적이고 안정적인 서비스의 제공을 위하여 최선을 다하여 노력합니다.
2. 회사는 회원의 개인정보 보호를 위해 보안시스템을 구축하며 개인정보 처리방침을 공시하고 준수합니다.
3. 회사는 서비스와 관련한 회원의 정당한 불만 혹은 의견을 접수하기 위하여 전담 메뉴를 운영하며 회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우, 이를 처리합니다.
4. 회사는 회원의 개인정보를 본인의 동의없이 제3자에게 제공하지 않으며 “개인정보취급방침”을 공지하고 준수하며 회원정보를 취급함에 있어 안정성 확보 및 기술적 대책을 수립 운영합니다.
5. 회사는 유료서비스 제공시 유료서비스의 내용, 이용방법, 이용료, 결제방법 등을 명확히 공지해야 합니다.
6. 회사는 정보통신망 이용촉진 및 정보보호에 관한 법률, 통신비밀보호법, 전기통신사업법 등 서비스의 운영, 유지와 관련 있는 법규를 준수합니다.
제 17조 회원의 의무
1. 회원은 관계법령, 이 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.
2. 회원은 회원가입 신청 또는 회원정보 변경 시 모든 사항을 사실에 근거하여 본인의 진정한 정보로 작성하여야 하며, 허위 또는 타인의 정보를 등록할 경우 서비스 이용과 관련된 모든 권리를 주장할 수 없습니다.
3. 회원은 서비스의 이용권한, 기타 이용계약상의 지위를 타인에게 양도, 증여할 수 없으며 이를 담보 혹은 대가로 제공할 수 없습니다. 회원이 작성한 게시물 등에 대한 모든 권리와 책임은 이를 게시한 회원에게 있습니다.
4. 회원은 ID및 비밀번호를 제3자에게 이용하게 해서는 안되며 이와 관련한 관리 소홀, 부정 사용에 의하여 발생하는 모든 문제에 대한 책임은 회원 본인에게 있습니다. 만약 본인의 아이디에 대한 부정 사용을 인지한 경우에는 지체없이 회사에 통보하고 회사의 안내에 따라야 합니다.
5. 회원은 연락처, 전자우편 주소 등 회원정보 사항이 변경된 경우에 해당 사실을 즉시 변경하여야하며, 이를 지체하거나 잘못된 정보를 등록하여 발생하는 손해는 회원에게 있습니다.
6. 회원은 회사의 사전 승낙 없이 서비스를 이용하여 영리 목적의 활동을 할 수 없으며, 그 활동의 결과에 대해 회사는 책임을 지지 않습니다. 또한, 이와 같은 활동으로 회사가 손해를 입은 경우 회원은 회사에 대해 손해배상의무를 지며, 회사는 해당 회원에 대해 서비스 이용제한 및 적법한 절차를 거쳐 손해배상 등을 청구할 수 있습니다.
7. 회원은 서비스를 통해 얻을 수 있는 정보를 회사의 명시적 동의없이 수집, 복제, 배포, 제공하거나 타 회원의 개인정보를 수집, 저장, 공개하는 행위를 해서는 안됩니다.
8. 회원은 회사의 운영진, 직원 또는 관계자를 사칭하거나 고의로 서비스를 방해하는 등 정상적인 서비스 운영에 방해가 되는 행위를 해서는 안됩니다.
9. 회원은 약관에서 규정하는 사항과 기타 회사가 정한 제반 규정, 공지사항 등 회사가 공지하는 사항 및 관계 법령을 준수하여야 하며, 기타 회사의 업무에 방해가 되는 행위, 회사의 명예를 손상시키는 행위, 타인에게 피해를 주는 행위를 해서는 안됩니다.
10. 회원은 추가적으로 다음 각 호에 해당하는 행위를 해서는 안됩니다.
- 이용 신청 또는 회원정보 변경 시 허위내용 등록하는 경우
- 타인의 정보도용을 하는 경우
- 상업적인 행위를 하는 경우
- 본인의 연락 정보를 유포하는 경우
- 2개 이상의 계정을 운영하는 경우
- 식별하기 힘든 사진을 게재하는 경우
- 교제중인 이성이 있거나, 결혼을 한 상태에서 서비스를 이용하는 경우
- 회사가 게시한 정보의 변경을 하는 경우
- 해킹을 통해서 다른 사용자의 정보를 취득하는 행위를 하는 경우
- 회사와 다른 회원 및 기타 제3자를 희롱하거나, 위협하거나 명예를 손상시키는 행위를 하는 경우
- 외설, 폭력적인 메시지, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위를 하는 경우
- 자신의 종교적 신념을 표현하거나 타인의 종교를 비하하는 경우
- 허위사실 유포 및 사기 행위를 하는 경우
- 국내법상 온라인 판매가 금지된 제품의 판매나 홍보를 하는 경우
- 장물, 마약/향 정신성 약품 등 국내 반입 및 판매가 금지된 제품의 판매나 홍보를 하는 경우
- 매점매석과 같이 공정거래에 위반되는 행위를 하는 경우
- 음란물 및 성인물을 게시하거나 판매 혹은 홍보를 하는 경우
- 유흥업, 퇴폐향락업 및 불법업태에 관련한 사항을 게시하거나 홍보하는 경우
- 정치적, 사회적인 물의를 일으킬 수 있는 행위를 하는 경우
- 회사와 기타 제3자의 저작권, 영업비밀, 특허권 등 지적재산권에 대한 침해를 하는 경우
- 정보통신설비의 오작동이나 정보 등의 파괴를 유발시키는 악성코드나 데이터 등을 유포하는 경우
- 기타 현행 법령에 위반되는 불법적인 행위를 하는 경우
- 기타 서비스 목적에 맞지 않는 행위를 하는 경우
- 기타 "${serviceName}" 모바일 어플리케이션 또는 온라인 웹 페이지를 통하여 추가로 공지되는 사항에 위배되는 경우
11. 회원은 회사의 사전 허락 없이 회사가 정한 이용 목적과 방법에 반하여 영업/광고활동 등을 할 수 없고, 회원의 서비스 이용이 회사의 재산권, 영업권 또는 비즈니스 모델을 침해하여서는 안됩니다.
12. 회사는 회원이 제 18조에서 금지한 행위를 하는 경우, 위반 행위의 경중에 따라 서비스의 이용정지/계약의 해지 등 서비스 이용 제한, 수사 기관에의 고발 조치 등 합당한 조치를 취할 수 있습니다.
계약해지 및 이용제한
제 18조 계약해지 및 이용제한
1. 회원이 서비스 이용계약을 해지하고자 할 경우에는 회사가 제공하는 서비스 내의 탈퇴 기능을 통하여 해지 신청을 할 수 있습니다.
2. 회사는 회원이 약관에 규정한 의무 사항을 이행하지 않을 경우 회사 직권에 의하여 이용 계약을 해지하거나 일시적으로 제한할 수 있습니다.
3. 회사는 이용계약을 해지하는 경우 개인정보 처리방침에 따라 회원 등록을 말소합니다.
4. 제 2항의 조치에 대하여 회원은 회사가 정한 절차에 따라 이의신청을 할 수 있으며 이의가 정당하다고 회사가 인정하는 경우 서비스 이용을 재개할 수 있습니다.
개인정보의 보호 및 기타사항
제 19조 이용자의 개인정보 보호
1. 회사는 관련법령이 정하는 바에 따라서 회원 등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다. 회원의 개인정보보호에 관한 사항은 관련법령 및 회사가 정하는 “개인정보처리방침”에 정한 바에 따릅니다.
2. 회사는 제공된 회원의 정보를 이용자의 동의 없이 목적 외의 이용이나 제 3자에게 제공할 수 없으며, 이에 대한 모든 책임은 회사가 집니다. 다만, 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우 등 법령상 허용된 경우에는 예외로 합니다.
제 20조 손해배상
1. 회사는 고의 또는 중대한 과실에 의하여 회원에게 손해를 입힌 경우, 그 손해를 배상할 책임이 있습니다. 단 회사가 무료로 제공하는 서비스의 이용과 관련하여서는 개인정보보호정책에서 정하는 내용에 위반하지 않는 한 어떠한 손해도 책임을 지지 않습니다.
2. 회원이 서비스를 이용함에 있어 행한 불법적 행위나 본 약관의 규정을 위반함으로 인하여 회사에 손해가 발생하거나 제3자로부터 회사가 손해배상 청구 또는 소송을 비롯한 각종 이의제기를 받는 경우, 당해 회원은 회사에 발생하는 모든 손해를 배상하여야 합니다.
제 21조 면책조항
1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
2. 회사는 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 발생한 손해에 대한 책임이 면제됩니다.
3. 회사는 회원의 귀책사유로 인한 서비스의 이용장애에 대한 책임이 면제됩니다.
4. 회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 자료로 인한 손해 등에 대하여 책임을 지지않습니다.
5. 회사는 회원이 사이트에 게재한 정보, 자료, 사실의 신뢰도 및 정확성 등 내용에 대하여는 책임을 지지않습니다.
6. 회사는 상시적으로 회원이 서비스 내에 게시하는 게시물의 내용을 확인 또는 검토하여야 할 의무가 없으며, 그 결과에 대한 책임을 지지 않습니다.
7. 회사는 회원 상호간 및 회원과 제 3자 상호 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며 이로 인한 손해를 배상할 책임도 없습니다.
8. 회사는 무료로 제공되는 서비스 이용과 관련하여 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.
9. 회사는 회원이 자신의 결정에 의하여 회사의 서비스를 사용하여 특정 프로그램이나 정보 등을 다운받거나 접근함으로써 입게 되는 컴퓨터 시스템상의 손해나 데이터, 정보의 상실에 대한 책임을 지지 않습니다.
10. 회사는 기간통신사업자가 전기통신서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우에는 책임이 면제됩니다.
11. 회사는 회원의 컴퓨터 환경이나 회사의 관리 범위에 있지 아니한 보안 문제로 인하여 발생하는 제반 문제 또는 현재의 보안기술 수준으로 방어가 곤란한 네트워크 해킹 등 회사의 귀책사유 없이 발생하는 문제에 대해서 책임을 지지 않습니다.
12. 회사는 회원이 자신의 개인정보를 타인에게 유출 또는 제공함으로써 발생하는 피해에 대해서는 일체의 책임을 지지 않습니다.
13. 회사는 회원의 게시물을 등록 전에 사전심사 하거나 상시적으로 게시물의 내용을 확인 또는 검토하여야 할 의무가 없으며, 그 결과에 대한 책임을 지지 않습니다.
14. WiFi환경이 아닌 곳에서 접속하여 데이터 요금 발생 시, 사용자는 부과된 요금에 대해 회사에게 일체 지불 요청을 할 수 없습니다.
제 22조 통지
1. 회사가 회원에 대하여 통지를 하는 경우 서비스 내 전달 기능(쪽지, 앱 내 PUSH 메시지 형식) 또는 회원이 회사에 등록한 전자우편 주소로 할 수 있습니다.
2. 회사는 회원이 전자우편 수신이 곤란한 경우나 불특정다수 회원에게 통지를 해야 할 경우 서비스 내 게시판 등에 게시함으로써 개별 통지에 갈음할 수 있습니다.
제 23조 분쟁해결
1. 서비스 이용과 관련하여 회사와 회원 사이에 분쟁이 발생한 경우, 회사와 회원은 분쟁의 해결을 위해 성실히 협의합니다.
2. 제 1항의 협의에도 불구하고 분쟁이 해결되지 않아 소송이 제기되는 경우 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.
3. 회사와 이용자간에 제기된 소송에는 대한민국 법을 적용합니다.
이 약관은 ${startDateStr}부터 시행됩니다.</p>`.replace(/\n/g, "</p><p>");
  return <HtmlContent className={className} content={content} />;
};
