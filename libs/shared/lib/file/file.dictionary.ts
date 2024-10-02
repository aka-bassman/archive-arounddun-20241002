import { ModelDictionary, SignalDictionary, SummaryDictionary, baseTrans, getBaseSignalTrans } from "@core/base";
import type { File, FileFilter, FileInsight, FileSummary } from "./file.constant";
import type { FileSignal } from "./file.signal";

const modelDictionary = {
  ...baseTrans,
  modelName: ["File", "파일"],
  modelDesc: [
    "File is a blob data that is stored in the database, such as image, document or video",
    "파일은 이미지, 문서, 비디오 등과 같이 데이터베이스에 저장되는 blob 데이터입니다.",
  ],

  // * ==================== Model ==================== * //
  imageSize: ["Image Size", "이미지사이즈"],
  "desc-imageSize": ["Size of the image as width and height tuple in pixel", "이미지의 가로세로 픽셀 사이즈"],

  filename: ["File Name", "파일명"],
  "desc-filename": ["Name of the file with extension", "확장자를 포함한 파일명"],

  origin: ["Origin", "원본"],
  "desc-origin": ["Origin source url of the file", "파일의 원본 소스 url"],

  mimetype: ["Mime Type", "파일타입"],
  "desc-mimetype": ["Mime type of the file", "파일의 Mime 타입"],

  encoding: ["Encoding", "인코딩"],
  "desc-encoding": ["Encoding of the file", "파일의 인코딩"],

  url: ["Url", "Url"],
  "desc-url": ["Url of the file", "파일의 Url"],

  progress: ["Progress", "진행률"],
  "desc-progress": [
    "Upload progress of the file, uploading status files are used only",
    "파일의 업로드 진행률, 업로드중인 파일만 사용됩니다",
  ],

  lastModifiedAt: ["Last Modified At", "마지막 수정일"],
  "desc-lastModifiedAt": ["Last modified date of the file", "파일의 마지막 수정일"],

  size: ["Size", "용량"],
  "desc-size": ["File size in bytes", "파일의 바이트 단위 용량"],

  abstractData: ["Abstract Data", "요약 데이터"],
  "desc-abstractData": [
    "Abstract blurred encoded data of image files to preview",
    "미리보기를 위한 이미지 파일의 추상화된 블러 처리된 인코딩 데이터",
  ],
  // * ==================== Model ==================== * //

  // * ==================== Insight ==================== * //
  count: ["Count", "개수"],
  "desc-count": ["File count in current query settting", "현재 쿼리 설정에 맞는 파일 수"],
  // * ==================== Insight ==================== * //

  // * ==================== Sort ==================== * //
  // * ==================== Sort ==================== * //

  // * ==================== Etc ==================== * //
  "enum-status-active": ["Active", "활성"],
  "enumdesc-status-active": [
    "File is successfully uploaded and created with normally accessible",
    "파일 업로드가 완료되어 정상적으로 생성되었으며 접근 가능합니다",
  ],
  "enum-status-uploading": ["Uploading", "업로드중"],
  "enumdesc-status-uploading": [
    "File is being uploaded, but not yet created",
    "파일이 업로드중이며 아직 생성되지 않았습니다",
  ],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<File, FileInsight, FileFilter>;

export const fileSummaryDictionary = {
  // * ==================== Summary ==================== * //
  totalFile: ["Total File", "총 파일 수"],
  "desc-totalFile": ["Total file count in the database", "데이터베이스에 저장된 총 파일 수"],
  // * ==================== Summary ==================== * //
} satisfies SummaryDictionary<FileSummary>;

const signalDictionary = {
  ...getBaseSignalTrans("file" as const),
  // * ==================== Endpoint ==================== * //
  // * Mutation.addFiles * //
  "api-addFiles": ["Add Files", "파일 추가"],
  "apidesc-addFiles": ["Add files to the database", "데이터베이스에 파일 추가"],
  "arg-addFiles-files": ["File Streams", "파일 스트림"],
  "argdesc-addFiles-files": ["File streams to be uploaded", "업로드할 파일 스트림"],
  "arg-addFiles-metas": ["File Metas", "파일 메타"],
  "argdesc-addFiles-metas": ["File metas to be uploaded", "업로드할 파일 메타"],
  "arg-addFiles-type": ["Parent Type", "상위 타입"],
  "argdesc-addFiles-type": ["Parent type of file in database", "데이터베이스에 저장될 파일의 상위 타입"],
  "arg-addFiles-parentId": ["Parent Id", "상위 Id"],
  "argdesc-addFiles-parentId": ["Parent id to be uploaded", "상위 Id"],

  // * Mutation.addFilesRestApi * //
  "api-addFilesRestApi": ["Add Files (for RESTful API", "파일 추가 (RESTful API)"],
  "apidesc-addFilesRestApi": ["Add files to the database (for RESTful API)", "데이터베이스에 파일 추가 (RESTful API)"],
  "arg-addFilesRestApi-files": ["File Streams", "파일 스트림"],
  "argdesc-addFilesRestApi-files": ["File streams to be uploaded", "업로드할 파일 스트림"],
  "arg-addFilesRestApi-metas": ["File Metas", "파일 메타"],
  "argdesc-addFilesRestApi-metas": ["File metas to be uploaded", "업로드할 파일 메타"],
  "arg-addFilesRestApi-type": ["Parent Type", "상위 타입"],
  "argdesc-addFilesRestApi-type": ["Parent type of file in database", "데이터베이스에 저장될 파일의 상위 타입"],
  "arg-addFilesRestApi-parentId": ["Parent Id", "상위 Id"],
  "argdesc-addFilesRestApi-parentId": ["Parent id to be uploaded", "상위 Id"],
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<FileSignal, File>;

export const fileDictionary = { ...modelDictionary, ...signalDictionary };
