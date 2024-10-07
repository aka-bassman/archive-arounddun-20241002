import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Result, ResultFilter, ResultInsight, ResultSummary } from "./result.constant";
import type { ResultSignal } from "./result.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Result", "Result"],
  modelDesc: ["Result description", "Result 설명"],

  // * ==================== Model ==================== * //
  userId: ["User ID", "사용자 ID"],
  "desc-userId": ["User ID", "사용자 ID"],

  testId: ["Test ID", "테스트 ID"],
  "desc-testId": ["Test ID", "테스트 ID"],

  prevResultId: ["Previous Result ID", "이전 Result ID"],
  "desc-prevResultId": ["Previous Result ID", "이전 Result ID"],

  status: ["Status", "상태"],
  "desc-status": ["Status", "상태"],

  rawResponse: ["Raw Response", "Raw Response"],
  "desc-rawResponse": ["Raw Response", "Raw Response"],

  threadId: ["Thread ID", "Thread ID"],
  "desc-threadId": ["Thread ID", "Thread ID"],

  data: ["Data", "데이터"],
  "desc-data": ["Data", "데이터"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Result count in current query settting", "현재 쿼리 설정에 맞는 Result 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active status", "활성 상태"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Result, ResultInsight, ResultFilter>;

export const resultSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalResult: ["Total Result", "총 Result 수"],
  "desc-totalResult": ["Total result count in the database", "데이터베이스에 저장된 총 Result 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<ResultSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("result" as const),
  // * ==================== Endpoint ==================== * //
  "api-resultListInPublic": ["Result List In Public", "공개된 Result 리스트"],
  "apidesc-resultListInPublic": ["Get a list of public result", "공개된 Result의 리스트를 가져옵니다"],
  "arg-resultListInPublic-statuses": ["Statuses", "상태"],
  "argdesc-resultListInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  "arg-resultListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-resultListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-resultListInPublic-limit": ["Limit", "제한"],
  "argdesc-resultListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-resultListInPublic-sort": ["Sort", "정렬"],
  "argdesc-resultListInPublic-sort": ["Sort order of the items", "아이템의 정렬 순서"],

  "api-resultInsightInPublic": ["Result Insight In Public", "공개된 Result 인사이트"],
  "apidesc-resultInsightInPublic": [
    "Get insight data for public result",
    "공개된 Result에 대한 인사이트 데이터를 가져옵니다",
  ],
  "arg-resultInsightInPublic-statuses": ["Statuses", "상태"],
  "argdesc-resultInsightInPublic-statuses": ["Statuses to filter", "필터링할 상태"],

  "api-calculateResult": ["Calculate Result", "Result 계산"],
  "apidesc-calculateResult": ["Calculate Result", "Result 계산"],

  "api-calculateImprvement": ["Calculate Imprvement", "개선 계산"],
  "apidesc-calculateImprvement": ["Calculate Imprvement", "개선 계산"],

  "antiAgingAmpoule-title": [
    "ExoActive™ Anti-Aging Ampoule",
    "ExoActive™ Anti-Aging Ampoule",
    "ExoActive™ Anti-Aging Ampoule",
    "ExoActive™ Anti-Aging Ampoule",
  ],
  "antiAgingAmpoule-subTitle": [
    "Anti-aging care that deeply absorbs into the skin",
    "피부 깊이 흡수되는 항노화 안티에이징 케어",
    "肌の奥深くまで吸収される抗老化ケア",
    "การดูแลผิวต่อต้านริ้วรอยที่ซึมลึกเข้าสู่ผิว",
  ],
  "antiAgingAmpoule-desc1": [
    "Anti-aging / Skin stress soothing effect",
    "강한 항노화/피부 스트레스 진정 효과",
    "強力な抗老化 / 肌ストレス鎮静効果",
    "การต่อต้านริ้วรอย / ผลการบรรเทาความเครียดของผิว",
  ],
  "antiAgingAmpoule-desc2": [
    "Approximately 25% reduction in skin irritation",
    "피부 자극 약 25% 완화",
    "肌刺激約25％緩和",
    "ลดการระคายเคืองผิวประมาณ 25%",
  ],
  "antiAgingAmpoule-desc3": [
    "15.8% improvement in eye wrinkles",
    "눈가주름 15.8% 개선",
    "目元のしわ15.8％改善",
    "ปรับปรุงริ้วรอยรอบดวงตาขึ้น 15.8%",
  ],
  "antiAgingAmpoule-desc4": [
    "23.5% decrease in elastase",
    "엘라스타제 23.5% 저하",
    "エラスターゼ23.5％低下",
    "ลดการทำงานของเอนไซม์อีลาสเตสลง 23.5%",
  ],
  "antiAgingAmpoule-volume": ["30ml", "30ml", "30ml", "30ml"],
  "antiAgingAmpoule-href": [
    "",
    "https://syrs.kr/product/엑소액티브-안티에이징-앰플/14/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-エイジングケア-美容液-30ML/1099231229?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Anti-aging-Ampoule-i.1207390333.25819871165?sp_atk=20a6f9a8-dd0f-4172-91b1-3bce42f11f75&xptdk=20a6f9a8-dd0f-4172-91b1-3bce42f11f75",
  ],
  "sol-footer1": [
    "* Limited to raw material characteristics",
    "* 원료적 특성에 한함",
    "* COSMAX 研究結果",
    "* 原料の特性に限る",
  ],
  "sol-footer2": [
    "* GFC Biotechnology research results",
    "* GFC 생명과학 연구결과",
    "* 原料特性に限る",
    "* GFC生命工学研究結果",
  ],

  "tighteningRepairCream-title": [
    "ExoActive™ Tightening Repair Cream",
    "ExoActive™ Tightening Repair Cream",
    "ExoActive™ Tightening Repair Cream",
    "ExoActive™ Tightening Repair Cream",
  ],
  "tighteningRepairCream-subTitle": [
    "Night care that restores loose skin overnight",
    "밤 사이 느슨해진 피부를 회복시키는 나이트 케어",
    "夜の間に緩んだ肌を回復させるナイトケア",
    "การดูแลผิวยามค่ำคืนที่ช่วยฟื้นฟูผิวที่หย่อนคล้อยในชั่วข้ามคืน",
  ],
  "tighteningRepairCream-desc1": [
    "37.8% reduction between damaged skin cells",
    "손상된 피부 세포 사이 37.8% 축소",
    "損傷した肌細胞間の37.8％縮小",
    "ลดช่องว่างระหว่างเซลล์ผิวที่เสียหายลง 37.8%",
  ],
  "tighteningRepairCream-desc2": [
    "39% improvement in skin density",
    "피부 치밀도 39% 개선",
    "肌の密度39％改善",
    "ปรับปรุงความหนาแน่นของผิวขึ้น 39%",
  ],
  "tighteningRepairCream-desc3": [
    "21.4% improvement in skin moisture content",
    "피부 수분 함량 21.4% 개선",
    "肌の水分含有量21.4％改善",
    "ปรับปรุงความชุ่มชื้นของผิวขึ้น 21.4%",
  ],
  "tighteningRepairCream-desc4": [
    "23.5% decrease in elastase",
    "엘라스타제 23.5% 저하",
    "エラスターゼ23.5％低下",
    "ลดการทำงานของเอนไซม์อีลาสเตสลง 23.5%",
  ],
  "tighteningRepairCream-desc5": ["50% skin regeneration", "피부 재생 50%", "肌再生50％", "การสร้างผิวขึ้นใหม่ 50%"],
  "tighteningRepairCream-volume": ["50ml", "50ml", "50ml", "50ml"],
  "tighteningRepairCream-href": [
    "",
    "https://syrs.kr/product/엑소액티브-타이트닝-리페어-크림/23/category/24/display/1/",
    "https://www.qoo10.jp/g/1099291578",
    "https://shopee.co.th/SYRS-ExoActive™-Tightening-Repair-Cream-i.1207390333.24569877671?sp_atk=d884d967-589a-4171-aa30-1293392c5157&xptdk=d884d967-589a-4171-aa30-1293392c5157",
  ],

  "deepCareMask-title": [
    "ExoActive™ Deep Care Mask (5p)",
    "ExoActive™ Deep Care Mask (5p)",
    "ExoActive™ Deep Care Mask (5p)",
    "ExoActive™ Deep Care Mask (5p)",
  ],

  "deepCareMask-subTitle": [
    "Special recovery care with strong adhesion sheets used in burn treatments",
    "화상 치료에도 쓰이는 시트의 강한 밀착 스페셜 회복 케어",
    "火傷治療にも使われるシートの強力密着回復ケア",
    "การดูแลฟื้นฟูพิเศษด้วยแผ่นยึดเกาะที่แข็งแรงที่ใช้ในการรักษาแผลไฟไหม้",
  ],
  "deepCareMask-desc1": [
    "Enhances epidermal elasticity by 27%",
    "염증 반응 40% 이상 감소",
    "炎症反応40％以上減少",
    "เพิ่มความยืดหยุ่นของชั้นหนังกำพร้า 27%",
  ],
  "deepCareMask-desc2": [
    "Decreases elastase by 23.5%",
    "엘라스타제 23.5% 저하",
    "エラスターゼ23.5％低下",
    "ลดการทำงานของเอนไซม์อีลาสเตสลง 23.5%",
  ],
  "deepCareMask-desc3": [
    "Improves skin moisture content by 21.4%",
    "피부 수분 함량 21.4% 개선 ",
    "肌の水分含有量21.4％改善 ",
    "ปรับปรุงความชุ่มชื้นของผิว 21.4%",
  ],
  "deepCareMask-desc4": [
    "15.8% improvement in eye wrinkles",
    "눈가주름 15.8% 개선",
    "目元のしわ15.8％改善",
    "ปรับปรุงริ้วรอยรอบดวงตาขึ้น 15.8%",
  ],
  "deepCareMask-desc5": [
    // "40% reduction in inflammatory response",
    " ",
    "표피 탄력 27% 개선",
    "表皮の弾力27％改善",
    " ",
  ],

  "deepCareMask-volume": ["5p", "5p", "5p", "5p"],
  "deepCareMask-href": [
    "",
    "https://syrs.kr/product/엑소액티브-딥-케어-마스크/33/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-ディープケア-マスクシート（5枚入り）/1099296517?ga_priority=-1&ga_prdlist=brand&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Deep-Care-Mask-(5p)-i.1207390333.24969872465?sp_atk=37108555-15f7-4f5f-ac60-7bc635d64d6b&xptdk=37108555-15f7-4f5f-ac60-7bc635d64d6b",
  ],

  "whiteningAmpoule-title": [
    "ExoActive™ Whitening Ampoule",
    "ExoActive™ Whitening Ampoule",
    "ExoActive™ Whitening Ampoule",
    "ExoActive™ Whitening Ampoule",
  ],
  "whiteningAmpoule-subTitle": [
    "Whitening care that improves pigmentation and boosts skin immunity",
    "색소 침착을 개선하고 피부의 면역력을 밝혀주는 미백 케어",
    "色素沈着を改善し、肌の免疫力を高める美白ケア",
    "การดูแลผิวขาวที่ช่วยปรับปรุงเม็ดสีและเสริมสร้างภูมิคุ้มกันของผิว",
  ],
  "whiteningAmpoule-desc1": [
    "8.7% improvement in melanin pigmentation",
    "멜라닌 색소 8.7% 개선",
    "メラニン色素8.7％改善",
    "ปรับปรุงเม็ดสีเมลานินขึ้น 8.7%",
  ],
  "whiteningAmpoule-desc2": [
    "Reduces inflammatory response by over 40%",
    "염증 반응 40% 이상 감소",
    "炎症反応40％以上減少",
    "ลดการตอบสนองต่อการอักเสบลงกว่า 40%",
  ],
  "whiteningAmpoule-desc3": [
    "Approximately 20% increase in cell viability",
    "세포 생존률 약 20% 증가",
    "細胞生存率約20％増加",
    "เพิ่มความสามารถในการอยู่รอดของเซลล์ประมาณ 20%",
  ],
  "whiteningAmpoule-desc4": [
    "Approximately 39% increase in natural moisturizing factor expression ",
    "천연 보습인자 발현 약 39% 증가",
    "天然保湿因子発現約39％増加",
    "เพิ่มการแสดงออกของปัจจัยความชุ่มชื้นตามธรรมชาติประมาณ 39% ",
  ],
  "whiteningAmpoule-volume": ["30ml", "30ml", "30ml", "30ml"],
  "cicaCalmingAmpoule-title": [
    "ExoActive™ Cica Calming Ampoule",
    "ExoActive™ Cica Calming Ampoule",
    "ExoActive™ Cica Calming Ampoule",
    "ExoActive™ Cica Calming Ampoule",
  ],
  "whiteningAmpoule-href": [
    "",
    "https://syrs.kr/product/엑소액티브-화이트닝-앰플/27/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-ブライトニング-美容液-30ML/1099285466?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Whitening-Ampoule-i.1207390333.24269872509?sp_atk=24c9c247-8912-43f9-bf26-7ee2ebaf34ab&xptdk=24c9c247-8912-43f9-bf26-7ee2ebaf34ab",
  ],
  "cicaCalmingAmpoule-subTitle": [
    "Soothing care that prevents inflammatory pigmentation and reduces redness",
    "유수분 밸런스를 맞춰 붉은기, 여드름 개선하는 진정 케어",
    "炎症性色素沈着を予防し、赤みを改善する鎮静ケア",
    "การดูแลบรรเทาที่ป้องกันการเกิดเม็ดสีอักเสบและลดรอยแดง",
  ],
  "cicaCalmingAmpoule-desc1": [
    "20% improvement in oil-water balance",
    "유수분 밸런스 20% 개선",
    "油分と水分のバランス20％改善",
    "ปรับปรุงสมดุลน้ำมัน-น้ำขึ้น 20%",
  ],
  "cicaCalmingAmpoule-desc2": [
    "25% reduction in redness and acne formation",
    "붉은기 및 여드름 유발 25% 억제",
    "赤みとニキビの発生を25％抑制",
    "ลดรอยแดงและการเกิดสิวลง 25%",
  ],
  "cicaCalmingAmpoule-desc3": [
    "20.3% reduction in extracellular melanin pigmentation",
    "손상된 세포 사이 간격 37.8% 감소",
    "細胞外メラニン色素20.3％減少",
    "ลดการสร้างเม็ดสีเมลานินภายนอกเซลล์ลง 20.3%",
  ],
  "cicaCalmingAmpoule-desc4": [
    "31.4% reduction in inflammatory nitric oxide",
    "염증 유발물질인 질소산화물 31.4% 억제",
    "炎症誘発物質である一酸化窒素31.4％抑制",
    "ลดการอักเสบของไนตริกออกไซด์ 31.4%",
  ],
  "cicaCalmingAmpoule-volume": ["30ml", "30ml", "30ml", "30ml"],
  "cicaCalmingAmpoule-href": [
    "",
    "https://syrs.kr/product/엑소액티브-시카-카밍-앰플/26/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-シカ-鎮静美容液-30ML/1099287447?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Cica-Calming-Ampoule-i.1207390333.25619867588?sp_atk=a95ed7a1-4521-4ca8-9840-7a06bb87b110&xptdk=a95ed7a1-4521-4ca8-9840-7a06bb87b110",
  ],

  "clearCoverMoisturizer-title": [
    "ExoActive™ Clear Cover Moisturizer",
    "ExoActive™ Clear Cover Moisturizer",
    "ExoActive™ Clear Cover Moisturizer",
    "ExoActive™ Clear Cover Moisturizer",
  ],
  "clearCoverMoisturizer-subTitle": [
    "Moisture barrier care that helps improve and soothe blemishes caused by breakouts",
    "트러블로 인한 잡티 개선과 진정을 돕는 수분 장벽 케어",
    "トラブルによるシミ改善と鎮静の水分バリアケア",
    "การดูแลปราการความชุ่มชื้นที่ช่วยปรับปรุงและบรรเทารอยด่างดำที่เกิดจากการระคายเคือง",
  ],
  "clearCoverMoisturizer-desc1": [
    "50% recovery of the skin barrier",
    "피부 장벽 50% 회복",
    "肌バリア50％回復",
    "ฟื้นฟูปราการผิว 50%",
  ],
  "clearCoverMoisturizer-desc2": [
    "Approximately 25% reduction in skin irritation",
    "피부 자극 약 25% 완화",
    "肌刺激約25％緩和",
    "ลดการระคายเคืองผิวประมาณ 25%",
  ],
  "clearCoverMoisturizer-desc3": [
    "20.3% reduction in extracellular melanin pigmentation",
    "세포외 멜라닌 색소 20.3% 감소",
    "細胞外メラニン色素20.3％減少",
    "ลดการสร้างเม็ดสีเมลานินภายนอกเซลล์ลง 20.3%",
  ],
  "clearCoverMoisturizer-desc4": [
    "37.8% reduction between damaged skin cells",
    "손상된 세포 사이 간격 37.8% 감소",
    "損傷した細胞間の間隔37.8％減少",
    "ลดช่องว่างระหว่างเซลล์ผิวที่เสียหายลง 37.8%",
  ],
  "clearCoverMoisturizer-volume": ["50ml", "50ml", "50ml", "50ml"],
  "clearCoverMoisturizer-href": [
    "",
    "https://syrs.kr/product/엑소액티브-클리어-커버-모이스처라이저/22/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-クリアカバー-モイスチャライザー-50ML/1099291031?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Clear-Cover-Moisturizer-i.1207390333.24119868468?sp_atk=7cb53b90-1e77-489e-bf6b-017428bc9f3a&xptdk=7cb53b90-1e77-489e-bf6b-017428bc9f3a",
  ],
  "essentialToner-title": [
    "ExoActive™ Essential Toner",
    "ExoActive™ Essential Toner",
    "ExoActive™ Essential Toner",
    "ExoActive™ Essential Toner",
  ],
  "essentialToner-subTitle": [
    "Moisture care that soothes the skin, inhibits inflammation, and refines the skin surface at the initial stage of skincare.",
    "기초의 시작 단계에서 피부를 진정시키고 염증 생성을 억제하며 피부 표면을 정돈하는 수분 케어",
    "基礎の初段階で肌を鎮静し、炎症の生成を抑え、肌表面を整える水分ケア",
    "การดูแลความชุ่มชื้นที่บรรเทาผิว ยับยั้งการอักเสบ และปรับผิวให้เรียบเนียนในขั้นตอนแรกของการดูแลผิว",
  ],
  "essentialToner-desc1": [
    "37.8% reduction in the gap between damaged cells",
    "손상된 피부 세포 사이 37.8% 축소",
    "損傷した細胞間の間隔37.8％減少",
    "ลดช่องว่างระหว่างเซลล์ที่เสียหายลง 37.8%",
  ],
  "essentialToner-desc2": [
    "31.4% inhibition of nitric oxide, an inflammation-inducing substance",
    "염증 유발 질소산화물 31.4% 억제",
    "炎症誘発物質である一酸化窒素31.4％抑制",
    "ยับยั้งไนตริกออกไซด์ สารที่ก่อให้เกิดการอักเสบลง 31.4%",
  ],
  "essentialToner-volume": ["100ml", "100ml", "100ml", "100ml"],
  "essentialToner-href": [
    "",
    "https://syrs.kr/product/엑소액티브-에센셜-토너/55/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エクソソーム（エクソアクティブ）-エッセンシャル-トナー-150ML/1099288795?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-ExoActive™-Essential-Toner-i.1207390333.22864152935?sp_atk=5b326611-9d93-4ae6-a245-5f988d9dbcad&xptdk=5b326611-9d93-4ae6-a245-5f988d9dbcad",
  ],

  "cleansingBalm-title": [
    "Effective Cleansing Balm",
    "Effective Cleansing Balm",
    "Effective Cleansing Balm",
    "Effective Cleansing Balm",
  ],
  "cleansingBalm-subTitle": [
    "Melting cleansing care containing argan kernel oil with a strong water-binding effect.",
    "워터 바인딩 효과가 강한 아르간 커넬 오일이 함유된 멜팅 클렌징 케어",
    "ウォーターバインディング効果が高いアルガンカーネルオイルを含むメルティングクレンジングケア",
    "การดูแลทำความสะอาดที่ละลายได้ซึ่งมีน้ำมันเมล็ดอาร์แกนที่มีผลในการยึดน้ำอย่างดีเยี่ยม",
  ],
  "cleansingBalm-desc1": [
    "50% recovery of the skin barrier",
    "피부 장벽 50% 회복",
    "肌バリア50％回復",
    "ฟื้นฟูปราการผิว 50%",
  ],
  "cleansingBalm-desc2": [
    "Approximately 25% reduction in skin irritation",
    "피부 자극 약 25% 완화",
    "肌刺激約25％緩和",
    "ลดการระคายเคืองผิวประมาณ 25%",
  ],
  "cleansingBalm-desc3": [
    "Excellent water-binding effect",
    "워터바인딩 효과 탁월",
    "優れたウォーターバインディング効果",
    "มีผลในการยึดน้ำอย่างดีเยี่ยม",
  ],
  "cleansingBalm-desc4": [
    "Contains Omega‑6 and Omega‑9",
    "오메가‑6,9 함유",
    "オメガ6・9含有",
    "ประกอบด้วยโอเมก้า‑6 และโอเมก้า‑9",
  ],
  "cleansingBalm-volume": ["100ml", "100ml", "100ml", "100ml"],
  "cleansingBalm-href": [
    "",
    "https://syrs.kr/product/이펙티브-클렌징-밤/56/category/24/display/1/",
    "https://www.qoo10.jp/item/SYRS-エフェクティブ-クレンジング-バーム100ML/1099296225?ga_priority=-1&ga_prdlist=sellergoods&ga_tid=",
    "https://shopee.co.th/SYRS-Effective-Cleansing-Balm-i.1207390333.25219868160?sp_atk=e0c4ad58-58bd-4ae5-b955-1bede0a5f216&xptdk=e0c4ad58-58bd-4ae5-b955-1bede0a5f216",
  ],

  skinAgingLevel: ["Skin Aging Level", "Skin Aging Level", "肌老化レベル", "Skin Aging Level"],
  sensitivityLevel: ["Sensitivity Level", "Sensitivity Level", "敏感度レベル", "Sensitivity Level"],
  oilWaterBalance: ["Oil-Water Balance", "Oil-Water Balance", "油分と水分のバランス", "Oil-Water Balance"],
  skinAge: ["Skin Age", "Skin Age", "肌年齢", "Skin Age"],

  analyzingTop: [" ", "님의 피부 타입을 분석하고 있어요.", "様の肌タイプを分析しています。", " "],
  analyzingTopHead: ["Analyzing your skin type, ", " ", " ", "วิเคราะห์ประเภทผิวของคุณ, "],
  analyzingBottom: [
    "For an accurate analysis, this may take a little time.\nThrough the results, you can check your skin age, aging condition, sensitivity,\nand oil-water balance, and receive tailored solutions.",
    "정확한 분석을 위해 조금의 시간이 걸릴 수 있습니다.\n결과를 통해 자신의 피부 나이와 에이징 상태, 민감도, 유수분 밸런스를 확인하고\n솔루션을 받아보세요.",
    "正確な分析のため、少し時間がかかる場合があります。\n結果を通じて、ご自身の肌年齢やエイジング状態、敏感度、\n 油分と水分のバランスを確認し、\nソリューションを受け取ってください。",
    "เพื่อการวิเคราะห์ที่แม่นยำ อาจใช้เวลาสักครู่\nผ่านผลลัพธ์นี้ คุณสามารถตรวจสอบอายุผิว สภาพการเกิดริ้วรอย ความไว\nและสมดุลน้ำมัน-น้ำ และรับแนวทางการดูแลที่เหมาะสมกับคุณ",
  ],
  errorMsg: [
    "An error has occurred.\nPlease start a new consultation or use an alternative consultation.",
    "오류가 발생했습니다.\n컨설테이션을 새로 시작하거나 대체 컨설테이션을 사용해주세요.",
    "エラーが発生しました。\nコンサルテーションを新しく開始するか、\n代替コンサルテーションを使用してください。\n",
    "An error has occurred.\nPlease start a new consultation or use an alternative consultation.",
  ],
  "use solution": ["Use Solution", "솔루션 사용", "ソリューション使用", "ใช้แนวทางการดูแล"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ResultSignal, Result>;

export const resultDictionary = { ...modelDictionary, ...signalDictionary };
