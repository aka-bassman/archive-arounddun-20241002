import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { Test, TestFilter, TestInsight, TestSummary } from "./test.constant";
import type { TestSignal } from "./test.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["Test", "Test"],
  modelDesc: ["Test description", "Test 설명"],

  // * ==================== Model ==================== * //
  lang: ["Language", "언어", "言語 (げんご)", "ภาษา"],
  "desc-lang": ["Language", "언어", "言語 (げんご)", "ภาษา"],

  name: ["Name", "이름", "名前 (なまえ)", "ชื่อ"],
  "desc-name": ["Name", "이름", "名前 (なまえ)", "ชื่อ"],

  dateOfBirth: ["Date of Birth", "생년월일", "生年月日 (せいねんがっぴ)", "วันเดือนปีเกิด"],
  "desc-dateOfBirth": ["Date of Birth", "생년월일", "生年月日 (せいねんがっぴ)", "วันเดือนปีเกิด"],

  email: ["Email", "이메일", "メールアドレス", "อีเมล"],
  "desc-email": ["Email", "이메일", "メールアドレス", "อีเมล"],

  image: ["Image", "이미지"],
  "desc-image": ["Image", "이미지"],

  answers: ["Answers", "답변"],
  "desc-answers": ["Answers", "답변"],

  status: ["Status", "상태"],
  "desc-status": ["Status", "상태"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["Test count in current query settting", "현재 쿼리 설정에 맞는 Test 수"],

  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": ["Active statu s", "활성 상태"],
  consult: [
    "Analyze the extent of aging, sensitivity, and oil-water balance to uncover various issues and determine the age of your skin. SYRS's exclusive AI skin diagnosis uses microscopic images to deeply analyze your skin and suggest care methods tailored to your skin concerns. Now, let your skin tell its story.",
    "피부 노화의 정도, 민감성, 그리고 유수분 밸런스를 분석하여 다양한 문제를 파악하고 나만의 솔루션을 만나보세요.\nSYRS의 자체 AI 피부 진단은 현미경 이미지를 통해 피부를 깊이 있게 분석하고, 피부 고민에 맞춘 관리 방법을 제안합니다.\n이제, 피부가 들려주는 이야기를 들어보세요.",
    "肌の老化の程度、敏感性、および油分と水分のバランスを分析し、さまざまな問題を把握して、自分だけのソリューションに出会いましょう。SYRSの独自のAI肌診断は、顕微鏡画像を通じて肌を深く分析し、肌の悩みに合わせたケア方法を提案します。\nさあ、肌が語るストーリーを聞いてみましょう。",
    "วิเคราะห์ความเป็นไปได้ของการเกิดริ้วรอย ความเซนซิทีฟของผิว และความสมดุลของน้ำมันและน้ำ เพื่อค้นหาปัญหาผิวและระบุอายุผิวที่แท้จริงของคุณ ด้วยการวินิจฉัยโดย AI ที่ SYRS ได้พัฒนาขึ้นมาเป็นพิเศษ AI ของเราใช้ภาพถ่ายจากกล้องจุลทรรศน์ก่อนและหลังใช้สกินแคร์ของเราทันที เพื่อแสดงการเปลี่ยนแปลงของผิวคุณและแนะนำวิธีการดูแลที่เหมาะกับปัญหาผิวของคุณ \n\nวิเคราะห์ความเป็นไปได้ของการเกิดริ้วรอย ความเซนซิทีฟของผิว และความสมดุลของน้ำมันและน้ำเพื่อค้นหาปัญหาผิวและระบุ\nอายุผิวที่แท้จริงของคุณ",
  ],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Test, TestInsight, TestFilter>;

export const testSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalTest: ["Total Test", "총 Test 수"],
  "desc-totalTest": ["Total test count in the database", "데이터베이스에 저장된 총 Test 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<TestSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("test" as const),
  // * ==================== Endpoint ==================== * //
  "api-testListInPublic": ["Test List In Public", "공개된 Test 리스트"],
  "apidesc-testListInPublic": ["Get a list of public test", "공개된 Test의 리스트를 가져옵니다"],
  "arg-testListInPublic-statuses": ["Statuses", "상태"],
  "argdesc-testListInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  "arg-testListInPublic-skip": ["Skip", "건너뛰기"],
  "argdesc-testListInPublic-skip": ["Number of items to skip", "건너뛸 아이템 수"],
  "arg-testListInPublic-limit": ["Limit", "제한"],
  "argdesc-testListInPublic-limit": ["Maximum number of items to return", "반환할 최대 아이템 수"],
  "arg-testListInPublic-sort": ["Sort", "정렬"],
  "argdesc-testListInPublic-sort": ["Sort order of the items", "아이템의 정렬 순서"],

  "api-testInsightInPublic": ["Test Insight In Public", "공개된 Test 인사이트"],
  "apidesc-testInsightInPublic": [
    "Get insight data for public test",
    "공개된 Test에 대한 인사이트 데이터를 가져옵니다",
  ],
  "arg-testInsightInPublic-statuses": ["Statuses", "상태"],
  "argdesc-testInsightInPublic-statuses": ["Statuses to filter", "필터링할 상태"],
  next: ["Next", "다음", "次の", "ถัดไป"],
  prev: ["Prev", "이전", "前の", "ก่อนหน้า"],
  typeAQuestion: [
    "What is the condition of the facial skin wrinkles \nwhen you frown and then relax your expression?",
    "인상을 찡그렸다 풀었을때 얼굴 피부의 주름 상태는 어떤가요?",
    "顔をしかめてから元に戻したときの顔の肌の\nしわの状態はどうですか？",
    "สภาพของริ้วรอยบนผิวหน้าของคุณเป็นอย่างไรเมื่อ\nคุณขมวดคิ้วและจากนั้นผ่อนคลายใบหน้า?",
  ],
  typeAAnswer4: [
    "Overall, wrinkle marks remain.",
    "전체적으로 주름의 흔적이 유지된다.",
    "全体的にしわの跡が残る。",
    "โดยรวมแล้วมีร่องรอยของริ้วรอยคงอยู่",
  ],
  typeAAnswer3: [
    "Wrinkle marks remain only near\nthe eyes and mouth where\nthere is a lot of movement.",
    "움직임이 많은 눈가와 입가 근처에만\n 주름의 흔적이 유지된다.",
    "動きが多い目元や口元の近くにの\nみしわの跡が残る。",
    "มีร่องรอยของริ้วรอยจาง ๆ อยู่ช่วงสั้น\nๆ แล้วหายไปอย่างรวดเร็ว",
  ],
  typeAAnswer2: [
    "Very faint wrinkle marks remain\n briefly and then quickly\n disappear.",
    "아주 흐린 주름의 흔적이 잠시 남았다가\n 금방 사라진다.",
    "非常に薄いしわの跡が一時的に残って\nすぐに消える。",
    "มีร่องรอยของริ้วรอยคงอยู่เฉพาะบริเ\nวณรอบดวงตาและปากที่มีการเคลื่อน\nไหวมาก",
  ],
  typeAAnswer1: [
    "Smooth without any traces.",
    "흔적없이 매끈하다.",
    "跡がなく滑らか。",
    "เรียบเนียนโดยไม่มีร่องรอยใด ๆ",
  ],
  typeBQuestion: [
    "What kind of stimuli causes your skin to turn red?",
    "어떤 자극에 피부가 붉게 반응하나요?",
    "どのような刺激に肌が赤く反応しますか？",
    "สิ่งกระตุ้นชนิดใดที่ทำให้ผิวของคุณเปลี่ยนเป็นสีแดง?",
  ],
  typeBAnswer4: [
    "It turns red easily and lasts a long\ntime even with environmental\nchanges or minor stimuli.",
    "환경 변화나 미세한 자극에도 쉽게\n 붉어지며 오래 지속된다.",
    "環境の変化や微細な刺激にも\n簡単に赤くなり、長く続く。",
    " เปลี่ยนเป็นสีแดงง่ายและคงอยู่นานแม้\nมีการเปลี่ยนแปลงของสิ่งแวดล้อมหรือ\nการกระตุ้นเล็กน้อย",
  ],
  typeBAnswer3: [
    "It turns red easily with minor\n stimuli but quickly returns\nto normal.",
    "사소한 자극에도 쉽게 붉어지지만 금방\n 원래대로 돌아온다.",
    "些細な刺激にも簡単に赤くなるが、\nすぐに元に戻る。",
    "เปลี่ยนเป็นสีแดงง่ายเมื่อได้รับการกระ\nตุ้นเล็กน้อยแต่กลับสู่สภาพปกติอย่างร\nวดเร็ว ",
  ],
  typeBAnswer2: [
    "It only turns red when\nsubjected to strong stimuli,\nsuch as scratching.",
    "긁는 행위와 같이 강한 자극이\n 가해졌을 때에만 붉어진다.",
    "掻く行為のような強い刺激が\n加えられたときだけ赤くなる。",
    "เปลี่ยนเป็นสีแดงง่ายเมื่อได้รับการกระตุ้น\nเล็กน้อยแต่กลับสู่สภาพปกติอย่างรวดเร็ว",
  ],
  typeBAnswer1: [
    "There is hardly any redness.",
    "피부가 붉어지는 현상이 거의 없다.",
    "肌が赤くなることはほとんどない。",
    "แทบไม่มีรอยแดงเลย",
  ],
  typeCQuestion: [
    "How often do you get blemishes like \ndark spots or freckles on your face?",
    "얼굴에 기미나 주근깨 같은 잡티가\n얼마나 많이 생기나요?",
    "顔にシミやそばかすなどの斑点がどのくらいできますか？",
    "คุณมีจุดด่างดำหรือกระบนใบหน้าบ่อยแค่ไหน?",
  ],
  typeCAnswer4: [
    "They are widely distributed and\ncontinuously appear.",
    "전체적으로 많이 분포되어 있고\n 계속해서 생긴다.",
    "全体的に多く分布しており、\n常に新しいものができる。 ",
    "มีการกระจายอยู่ทั่วไปและปรากฏขึ้\nนอย่างต่อเนื่อง",
  ],
  typeCAnswer3: [
    "New blemishes appear periodically\nbut do not last long.",
    "오래 유지되진 않지만 주기적으로\n 새로운 잡티가 생긴다.",
    "長くは続かないが、\n定期的に新しい斑点ができる。",
    "มีจุดด่างดำใหม่ปรากฏเป็นระยะแต่ไม่คงอยู่นาน",
  ],
  typeCAnswer2: [
    "Small blemishes appear once\nevery few years.",
    "몇 년에 한번씩 자잘한 잡티가 생긴다.",
    "数年に一度、\n小さな斑点ができる。 ",
    "มีจุ ดด่างดำเล็ก ๆ ปรากฏทุก ๆ ไม่กี่ปี",
  ],
  typeCAnswer1: [
    "There are no noticeable blemishes\nand they hardly ever appear.",
    "눈에 띄는 잡티가 없고 거의\n생기지 않는다.",
    "目立つ斑点はなく、\nほとんどできない。",
    "ไม่มีจุดด่างดำที่เห็นได้ชัดเจนและแทบไม่เคยปรากฏ",
  ],
  typeDQuestion: [
    "On average, how often do you experience breakouts?",
    "평균적으로 트러블이 생기는 주기가 어떻게 되나요?",
    "平均的にトラブルが発生する周期はどのくらいですか？",
    "โดยเฉลี่ยแล้วคุณมีสิวขึ้นบ่อยแค่ไหน?",
  ],
  typeDAnswer4: [
    "They occur frequently, every\nfew days.",
    "며칠에 한번씩 빈번히 생긴다.",
    "数日に一度頻繁に発生する。",
    "เกิดขึ้นบ่อยทุกๆ ไม่กี่วัน",
  ],
  typeDAnswer3: [
    "They occur once every\n2-3 weeks. ",
    "2~3주에 한번씩 생긴다.",
    "2～3週間に一度発生する。",
    "เกิดขึ้นครั้งหนึ่งทุก 2-3 สัปดาห์",
  ],
  typeDAnswer2: [
    "They happen every few\nmonths or years.",
    "몇 달 혹은 몇 년에 한번씩 생긴다.",
    "数か月または数年に一度発生する。",
    "เกิดขึ้นครั้งหนึ่งทุก 2-3 สัปดาห์\nเกิดขึ้นครั้งหนึ่งทุก 2-3 เดือน",
  ],
  typeDAnswer1: ["They hardly ever occur.", "거의 생기지 않는다.", "ほとんど発生しない。", "แทบไม่เคยเกิดขึ้นเลย"],
  typeEQuestion: [
    "What is the condition of your skin immediately after cleansing?",
    "세안 직후 피부 상태는 어떤가요?",
    "洗顔直後の肌の状態はどうですか？",
    "สภาพผิวของคุณเป็นอย่างไรทันทีหลังการทำความสะอาด?",
  ],
  typeEAnswer4: [
    "It feels tight all over.",
    "전체적으로 꽉 조이듯이 당긴다.",
    "全体的にぴったり引き締まる感じ。",
    "รู้สึกตึงทั่วทั้งหน้า",
  ],
  typeEAnswer3: [
    "Large areas like the cheeks and\nforehead feel slightly tight.",
    "볼과 이마 같은 넓은 부위가 미세하게\n 당긴다.",
    "頬や額のような広い部分が微かに\n引き締まる。",
    "บริเวณกว้างเช่นแก้มและหน้าผากรู้สึก\nตึงเล็กน้อย",
  ],
  typeEAnswer2: [
    "It looks fine on the surface, but\nthere is a feeling of tightness\ndeep within the skin.",
    "겉으로 보기에는 괜찮으나 피부 속에\n 당김이 느껴진다.",
    "見た目は大丈夫だが、\n肌の内側に引き締まる感じがある。",
    "ผิวดูปกติบนผิวหน้า\nแต่รู้สึกตึงลึกภายในผิว",
  ],
  typeEAnswer1: [
    "There is no feeling of tightness at all.",
    "전체적으로 당기는 느낌이 전혀 없다.",
    "全体的に引き締まる感じが全くない。",
    "ไม่มีความรู้สึกตึงเลย",
  ],
  checkSubmission: ["Completed.", "결과 확인", "結果確認", "เสร็จสิ้นแล้ว"],
  completeTest: [
    "Skin report completed.",
    "스킨 리포트 작성을 완료했어요.",
    "スキンレポートの作成が完了しました。",
    "รายงานสภาพผิวเสร็จสมบูรณ์",
  ],
  submitAndCheck1: [
    "Submit your skin report and skin photos to receive a one-on-one consultation and solution tailored to your skin type,",
    "스킨 리포트와 피부 사진을 제출하고\n ",
    "スキンレポートと肌の写真を提出し\n",
    "ส่งรายงานสภาพผิวและภาพถ่ายผิวของคุณเพื่อรับคำปรึกษาแบบตัวต่อตัวและแนวทางการดูแลที่เหมาะกับสภาพผิวของคุณ,",
  ],
  submitAndCheck2: [
    ".",
    "님의 피부 타입에 대한 원온원 컨설팅과 솔루션을 확인하세요.",
    "様の肌タイプに関するワンオンワンコンサルティングとソリューションをご確認ください。",
    ".",
  ],
  submit: ["Submit", "분석시작", "提出する", "ส่ง"],
  flowDesc1: [
    "Syrs's skin consultant will analyze your skin, ",
    "시르즈의 스킨 컨설턴트가",
    "シルズのスキンコンサルタントが",
    "ที่ปรึกษาผิวของ SYRS จะวิเคราะห์ผิวของคุณ, \n",
  ],
  flowDesc2: [
    ", and propose the recommended care solutions.",
    "님의 피부 상태를 분석해 \n필요한 케어 솔루션을 제안해드립니다.",
    "様の肌を分析し、\n必要なケアソリューションをご提案いたします。",
    ", และเสนอแนวทางการดูแลที่จำเป็น",
  ],
  flowDesc3: [
    "Experience improved skin with sincere care.",
    "세심한 케어로 개선되는 피부를 경험하세요.",
    "細やかなケアで改善される肌を体験してください",
    "สัมผัสผิวที่ดีขึ้นด้วยการดูแลอย่างจริงใจ",
  ],
  privacyTitle: [
    "Consent to Collect and Use Personal Information for SYRS",
    "SYRS 개인 정보 수집 및 이용 동의",
    "SYRS個人情報収集および利用同意",
    "ยินยอมให้เก็บและใช้ข้อมูล \nส่วนบุคคลสำหรับ SYRS",
  ],
  privacySubTitle: [
    "The one-on-one skin consultation service provides the results of the consultation to your phone after a survey about your skin condition. Do you agree to the collection and use of personal information for the use of this service?",
    "One on one skin consultation 서비스는 피부상태에 대한 설문조사 후\n 컨설팅 결과를 고객님의 핸드폰으로 제공해드립니다.\n서비스 이용을 위한 개인정보 수집 및 이용에 동의하십니까?",
    "One on one skin consultationサービスでは、\nコンサルティング結果をメールでお送りします。\n個人情報の収集および利用に同意しますか？",
    "บริการให้คำปรึกษาผิวแบบตัวต่อตัวจะส่งผลการให้คำปรึกษา\nไปยังโทรศัพท์ของคุณหลังจากทำแบบสำรวจเกี่ยวกับสภาพผิวของคุณ\nคุณยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลสำหรับการใช้บริการนี้หรือไม่?",
  ],
  고객: [" ", "고객", "お客様", "ลูกค้า"],
  privacyP1Title: [
    'SYRS (hereinafter referred to as the "Company") prioritizes the protection of customers personal information.',
    'SYRS(이하 "회사"라 함)는 고객의 개인정보 보호를 최우선 고려합니다.',
    "SYRS（以下「会社」とします）は、お客様の個人情報保護を最優先に考慮します。",
    'ในการให้บริการวินิจฉัยผิว "การให้คำปรึกษาผิวแบบตัวต่อตัว" บริษัทจะเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของลูกค้า ข้อมูลส่วนบุคคลที่เก็บรวบรวมจะไม่ถูกนำไปใช้เพื่อวัตถุประสงค์อื่นหรือให้บุคคลที่สามโดยไม่ได้รับความยินยอมจากลูกค้า',
  ],
  privacyP1: [
    "In providing our skin diagnosis service, \"One on One Skin Consultation,\" the Company will collect and use customers' personal information.The collected personal information will not be used for any other purposes or provided to third parties without the customer's consent.\nThis consent form specifies the terms for collecting, storing, and using customers' personal information. While customers may choose not to agree, participation in the skin analysis service will not be possible without consent.",
    '자사의 피부 진단 서비스인 "One on one skin consultation" 서비스를 제공함에 있어 고객의 개인정보를 수집 및 이용하게 됩니다. 수집한 개인정보는 수집 및 이용 목적 이외에 고객의 동의 없이 다른 용도로 이용하거나 제3자에게 제공하지 않습니다.\n\n아래 동의서는 고객의 개인정보를 수집, 저장, 및 이용하는 데 동의하는 내용을 명시하고 있으며, 동의하지 않을 수 있으나, 미동의 시 피부 분석 서비스 참여가 불가합니다',
    "当社の肌診断サービスである「One on one skin consultation」サービスを提供するにあたり、お客様の個人情報を収集および利用させていただきます。収集した個人情報は、収集および利用目的以外に、お客様の同意なく他の用途に利用したり、第三者に提供したりすることはありません。\n以下の同意書は、顧客の個人情報を収集、保存、及び利用することに同意する内容を明示しています。同意しないことも可能ですが、同意しない場合、肌分析サービスへの参加はできません。",
    "แบบฟอร์มความยินยอมนี้ระบุเงื่อนไขสำหรับการเก็บรวบรวม การจัดเก็บ และการใช้ข้อมูลส่วนบุคคลของลูกค้า แม้ว่าลูกค้าจะเลือกไม่ยินยอม แต่การเข้าร่วมในบริการวิเคราะห์ผิวจะไม่สามารถทำได้หากไม่ได้รับความยินยอม",
  ],
  privacyP2Title: [
    "Personal Information Collected",
    "수집하는 개인정보",
    "収集する個人情報",
    "ข้อมูลส่วนบุคคลที่เก็บรวบรวม",
  ],
  privacyP2: [
    "The Company will collect the following personal information:\n 1. Customer's Name\n 2. Date of Birth\n 3. Email Address",
    "회사는 다음과 같은 개인정보를 수집할 예정입니다.\n 1. 고객의 이름   2. 생년월일   3. 이메일",
    "当社は以下の個人情報を収集する予定です。\n1. お客様の名前   2. 生年月日   3. メールアドレス",
    "บริษัทจะเก็บรวบรวมข้อมูลส่วนบุคคลดังต่อไปนี้:\nชื่อของลูกค้า\nวันเดือนปีเกิด\nที่อยู่อีเมล",
  ],
  privacyP3Title: [
    "Purpose of Collecting and Using Personal Information",
    "개인정보의 수집 및 이용 목적",
    "個人情報の収集及び利用目的",
    "วัตถุประสงค์ในการเก็บรวบรวมและการใช้ข้อมูลส่วนบุคคล",
  ],
  privacyP3: [
    "The Company will collect and use personal information for the following purposes:\n - Name, Date of Birth: To identify customers and utilize data for skin analysis.\n - Email Address: To deliver and provide guidance on the analysis and diagnosis results.",
    "회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다.\n이름, 생년월일: 고객 식별 및 피부 분석을 위한 데이터 활용\n이메일: 분석 진단 결과 전달 및 안내를 돕기 위한 목적",
    "当社は以下の目的で個人情報を収集および利用します。\n名前、生年月日: お客様の識別および肌分析のためのデータ活用\nメールアドレス: 分析診断結果の伝達および案内を支援する目的",
    "บริษัทจะเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลเพื่อวัตถุประสงค์ดังต่อไปนี้:\nชื่อ, วันเดือนปีเกิด: เพื่อระบุตัวตนของลูกค้าและใช้ข้อมูลในการวิเคราะห์ผิว\nที่อยู่อีเมล: เพื่อส่งมอบและให้คำแนะนำเกี่ยวกับผลการวิเคราะห์และการวินิจฉัย",
  ],
  privacyP4Title: [
    "Retention Period for Personal Information",
    "개인정보의 보유 기간",
    "個人情報の保有期間",
    "ระยะเวลาการเก็บรักษาข้อมูลส่วนบุคคล",
  ],
  privacyP4: [
    "The customer's personal information will be retained for four years from the date of collection. After this period, customers will be given the option to have their personal information discarded. If no response is received, the information will be discarded four years after the collection date.\nBy signing or clicking the confirmation button on this consent form, customers are deemed to have agreed to the collection and use of personal information as specified above. Customers have the right to access, modify, delete, restrict, transfer, or object to the processing of their personal information at any time. Additionally, they may withdraw their consent to the collection and use of personal information.",
    "고객의 개인정보는 수집일로부터 4년간 보관됩니다. 이 기간 이후, 개인정보 폐기에 대한 선택권을 고객께 제공하고, 무응답 시 수집일로부터 4년 이후 폐기됩니다\n고객이 이 동의서에 서명 또는 확인 버튼을 클릭함으로써, 고객은 위 명시된 개인정보 수집 및 이용에 동의하는 것으로 간주됩니다\n고객은 언제든지 개인정보에 대한 접근, 수정, 삭제, 제한, 이동, 또는 이의를 제기할 권리가 있습니다. 또한 개인정보 수집 및 이용에 대한 동의를 철회할 수 있습니다.",
    "お客様の個人情報は、収集日から4年間保管されます。この期間後、個人情報の廃棄に関する選択権をお客様に提供し、無回答の場合は収集日から4年後に廃棄されます。\nお客様がこの同意書に署名または確認ボタンをクリックすることにより、お客様は上記に明示された個人情報の収集および利用に同意したものとみなされます。\nお客様はいつでも個人情報へのアクセス、修正、削除、制限、移動、または異議を申し立てる権利があります。また、個人情報の収集および利用に対する同意を撤回することもできます。",
    "ข้อมูลส่วนบุคคลของลูกค้าจะถูกเก็บรักษาเป็นเวลา 4 ปีนับจากวันที่เก็บรวบรวม หลังจากช่วงเวลาดังกล่าว ลูกค้าจะได้รับตัวเลือกในการทิ้งข้อมูลส่วนบุคคล หากไม่มีการตอบรับ ข้อมูลจะถูกทิ้งหลังจาก 4 ปีนับจากวันที่เก็บรวบรวม\nโดยการลงนามหรือคลิกปุ่มยืนยันในแบบฟอร์มความยินยอมนี้ ลูกค้าจะถือว่าได้ยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตามที่ระบุข้างต้น ลูกค้ามีสิทธิ์เข้าถึง แก้ไข ลบ จำกัด โอน หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของตนได้ตลอดเวลา นอกจากนี้ยังสามารถถอนความยินยอมในการเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลได้",
  ],
  privacyAgree: [
    "I have reviewed all of the above information and agree to the terms.",
    "위 내용을 모두 확인하였고 동의합니다.",
    "上記の内容をすべて確認し、同意します。",
    "ฉันได้ตรวจสอบข้อมูลทั้งหมดข้างต้นและยอมรับเงื่อนไข",
  ],
  start: ["Start", "Start", "スタート", "เริ่ม "],
  imageUpload: [
    "microscope photo upload",
    "microscope photo upload",
    "microscope photo upload",
    "อัปโหลดภาพจากกล้องจุลทรรศน",
  ],
  returnToBeginning: ["Return to the beginning", "처음으로 돌아가기", "最初に戻る", "กลับไปที่จุดเริ่มต้น"],

  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<TestSignal, Test>;

export const testDictionary = { ...modelDictionary, ...signalDictionary };
