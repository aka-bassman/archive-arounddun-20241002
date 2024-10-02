import { Id, type LocalFile } from "@core/server";
import { dayjs } from "@core/base";
import axios, { type AxiosRequestConfig } from "axios";
import fs from "fs";

export class FileManager {
  static getFileSize(localFile: string | LocalFile) {
    const localPath = typeof localFile === "string" ? localFile : localFile.localPath;
    const { size } = fs.statSync(localPath);
    return size;
  }
  static readFileAsStream(localFile: string | LocalFile) {
    const localPath = typeof localFile === "string" ? localFile : localFile.localPath;
    return fs.createReadStream(localPath);
  }
  static async readUrlAsStream(url: string, header?: AxiosRequestConfig) {
    return (await axios.get<fs.ReadStream>(url, { ...header, responseType: "stream" })).data;
  }
  static writeStreamToFile(
    readStream: fs.ReadStream,
    dirname: string,
    { cache, rename, header }: { cache?: boolean; rename?: string; header?: AxiosRequestConfig } = {}
  ): Promise<LocalFile> | LocalFile {
    const filename = rename ?? new Id().toString();
    const localPath = `${dirname}/${filename}`;
    if (cache && fs.existsSync(localPath)) {
      const stat = fs.statSync(localPath);
      const fileMeta = { size: stat.size, lastModifiedAt: dayjs(stat.mtime) };
      return { filename, localPath, mimetype: this.#getMimetype(filename), encoding: "7bit", ...fileMeta };
    }
    if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
    const writeStream = readStream.pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject("File Download Timeout");
      }, 6000000);
      writeStream.on("finish", () => {
        clearTimeout(timeout);
        const stat = fs.statSync(localPath);
        const fileMeta = { size: stat.size, lastModifiedAt: dayjs(stat.mtime) };
        resolve({ filename, encoding: "7bit", mimetype: this.#getMimetype(filename), localPath, ...fileMeta });
        writeStream.destroy();
      });
    });
  }
  static saveEncodedData(data: string, dirname: string): LocalFile {
    const mimetype = data.split(";")[0].replace("data:", "");
    const encoding = data.split(",")[0].split(";")[1] as "base64" | "utf-8";
    const encoded = data.split(",")[1];
    const extension = mimetype.split("/")[1].split("+")[0];
    const filename = `${new Id().toString()}.${extension}`;
    const localPath = `${dirname}/${filename}`;
    const stat = fs.statSync(localPath);
    const fileMeta = { size: stat.size, lastModifiedAt: dayjs(stat.mtime) };
    fs.writeFileSync(localPath, Buffer.from(encoded, encoding).toString());
    return { filename, encoding: "7bit", mimetype, localPath, ...fileMeta };
  }
  static #getMimetype(filename: string) {
    return filename.includes(".png")
      ? "image/png"
      : filename.includes(".jpg")
        ? "image/jpeg"
        : filename.includes(".jpeg")
          ? "image/jpeg"
          : filename.includes(".jfif")
            ? "image/jfif"
            : filename.includes(".gif")
              ? "image/gif"
              : "unknown";
  }
}
