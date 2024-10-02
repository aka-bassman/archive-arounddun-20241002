import { SignalDictionary } from "@core/base";
import type { SecuritySignal } from "./security.signal";

export const securityDictionary = {
  // * ==================== Endpoint ==================== * //
  "api-ping": ["Ping", "Ping"],
  "apidesc-ping": ["Ping", "Ping"],

  "api-pingBody": ["Ping Body", "Ping Body"],
  "apidesc-pingBody": ["Ping Body", "Ping Body"],
  "arg-pingBody-data": ["Body data", "바디 데이터"],
  "argdesc-pingBody-data": ["Body data", "바디 데이터"],

  "api-pingParam": ["Ping Param", "Ping Param"],
  "apidesc-pingParam": ["Ping Param", "Ping Param"],
  "arg-pingParam-id": ["ID", "아이디"],
  "argdesc-pingParam-id": ["ID", "아이디"],

  "api-pingQuery": ["Ping Query", "Ping Query"],
  "apidesc-pingQuery": ["Ping Query", "Ping Query"],
  "arg-pingQuery-id": ["ID", "아이디"],
  "argdesc-pingQuery-id": ["ID", "아이디"],

  "api-pingEvery": ["Ping Every", "Ping Every"],
  "apidesc-pingEvery": ["Ping Every", "Ping Every"],

  "api-pingUser": ["Ping User", "Ping User"],
  "apidesc-pingUser": ["Ping User", "Ping User"],

  "api-pingAdmin": ["Ping Admin", "Ping Admin"],
  "apidesc-pingAdmin": ["Ping Admin", "Ping Admin"],

  "api-encrypt": ["Encrypt", "Encrypt"],
  "apidesc-encrypt": ["Encrypt", "Encrypt"],
  "arg-encrypt-data": ["Data", "데이터"],
  "argdesc-encrypt-data": ["Data", "데이터"],

  "api-updateSignature": ["Update Signature", "서명 업데이트"],
  "apidesc-updateSignature": ["Update Signature", "서명 업데이트"],
  "arg-updateSignature-signchain": ["Sign Chain", "서명 체인"],
  "argdesc-updateSignature-signchain": ["Sign Chain", "서명 체인"],
  "arg-updateSignature-signmessage": ["Sign Message", "서명 메시지"],
  "argdesc-updateSignature-signmessage": ["Sign Message", "서명 메시지"],
  "arg-updateSignature-signaddress": ["Sign Address", "서명 주소"],
  "argdesc-updateSignature-signaddress": ["Sign Address", "서명 주소"],

  "api-cleanup": ["Cleanup", "Cleanup"],
  "apidesc-cleanup": ["Cleanup", "Cleanup"],

  "api-wsPing": ["Socket.io Ping", "Socket.io Ping"],
  "apidesc-wsPing": ["Socket.io Ping", "Socket.io Ping"],
  "arg-wsPing-data": ["Data", "데이터"],
  "argdesc-wsPing-data": ["Data", "데이터"],
  // * ==================== Endpoint ==================== * //

  // * ==================== Etc ==================== * //
  // * ==================== Etc ==================== * //
} satisfies SignalDictionary<SecuritySignal>;
