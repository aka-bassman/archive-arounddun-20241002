import * as db from "../db";
import { DbService, type FileStream, type LocalFile, Service, Use } from "@core/server";
import { FileManager, type IpfsApi, type ObjectStorageApi, getImageAbstract } from "@util/nest";
import { cnst } from "../cnst";
import { sleep } from "@core/common";

@Service("FileService")
export class FileService extends DbService(db.fileDb) {
  @Use() protected readonly objectStorageApi: ObjectStorageApi;
  @Use() protected readonly ipfsApi: IpfsApi;
  localDir = `./data`;

  async generate(): Promise<db.File> {
    return (
      (await this.fileModel.findByFilename("sample.jpg")) ??
      (await this.addFileFromLocal(
        {
          filename: "sample.jpg",
          mimetype: "image/jpeg",
          encoding: "7bit",
          localPath: `./libs/shared/lib/file/sample.jpg`,
        },
        "generate",
        "generate"
      ))
    );
  }

  async addFiles(
    fileStreams: FileStream[],
    fileMetas: db.FileMeta[],
    purpose: string,
    group = "default"
  ): Promise<db.File[]> {
    if (fileStreams.length !== fileMetas.length) throw new Error("File Streams and File Metas are not matched");
    const files = await Promise.all(
      fileStreams.map(
        async (fileStream, idx) => await this.#addFileFromStream(fileStream, fileMetas[idx], purpose, group)
      )
    );
    return files;
  }
  async addFileFromUri(
    uri: string,
    purpose: string,
    group: string,
    header: { [key: string]: string } = {}
  ): Promise<db.File | null> {
    try {
      const file = await this.fileModel.findByOrigin(uri);
      if (file) return file;
      const localFile = await this.saveImageFromUri(uri, { header });
      return await this.addFileFromLocal(localFile, purpose, group, { origin: uri });
    } catch (err) {
      this.logger.warn(`Failed to add file from URI - ${uri}`);
      return null;
    }
  }
  async getJsonFromUri<T = any>(uri: string): Promise<T | undefined> {
    try {
      if (uri.includes("data:application/json;base64,"))
        return JSON.parse(Buffer.from(uri.replace("data:application/json;base64,", ""), "base64").toString()) as T;
      const response = (await fetch(this.ipfsApi.getHttpsUri(uri))).json();
      return response as T;
    } catch (err) {
      this.logger.warn(`Failed to get json from URI - ${uri}`);
      return undefined;
    }
  }

  async #addFileFromStream(fileStream: FileStream, fileMeta: db.FileMeta, purpose: string, group: string | null) {
    const resolvedFileStream = await (fileStream as unknown as Promise<FileStream>);
    const { filename, mimetype, encoding } = resolvedFileStream;
    const file = await this.fileModel.createFile({
      progress: 0,
      url: "",
      imageSize: [0, 0],
      filename,
      mimetype,
      encoding,
      ...fileMeta,
    });
    const rename = this.#convertFileName(file);
    const path = `${purpose.length ? purpose : "default"}/${group?.length ? group : "default"}/${rename}`;
    this.objectStorageApi.uploadFileFromStream({
      path: path,
      body: resolvedFileStream.createReadStream(),
      mimetype,
      updateProgress: async (progress) => {
        await this.fileModel.progressUpload(file.id, progress.loaded, fileMeta.size);
      },
      uploadSuccess: async (url) => {
        const abstract = mimetype.startsWith("image/") ? await getImageAbstract(url) : {};
        void this.fileModel.finishUpload(file.id, url, abstract);
      },
    });
    return file;
  }
  async addFileFromLocal(
    localFile: LocalFile,
    purpose: string,
    group = "default",
    { origin }: { origin?: string } = {}
  ): Promise<db.File> {
    const size = FileManager.getFileSize(localFile);
    const file = await this.fileModel.createFile({ ...localFile, url: "", imageSize: [0, 0], origin, size });
    return new Promise((resolve, reject) => {
      this.objectStorageApi.uploadFileFromStream({
        path: `${purpose}/${group}/${localFile.filename}`,
        body: FileManager.readFileAsStream(localFile),
        mimetype: localFile.mimetype,
        updateProgress: async (progress) => {
          await this.fileModel.progressUpload(file.id, progress.loaded, size);
        },
        uploadSuccess: async (url) => {
          const abstract = localFile.mimetype.startsWith("image/") ? await getImageAbstract(url) : {};
          await this.fileModel.finishUpload(file.id, url, abstract);
          resolve(file.set({ status: "active", progress: 100, url, ...abstract }));
        },
      });
    });
  }
  async saveImageFromUri(
    uri: string,
    { cache, rename, header }: { cache?: boolean; rename?: string; header?: { [key: string]: string } } = {}
  ): Promise<LocalFile> {
    const dirname = `${this.localDir}/uriDownload`;
    if (uri.startsWith("data:")) return FileManager.saveEncodedData(uri, dirname);
    const readStream = await FileManager.readUrlAsStream(this.ipfsApi.getHttpsUri(uri));
    const localFile = await FileManager.writeStreamToFile(readStream, dirname, { cache, rename, header });
    return localFile;
  }
  #convertFileName(file: db.File) {
    const split = file.filename.split(".");
    const ext = split.length > 1 ? `.${split.at(-1)}` : "";
    return `${file.id}${ext}`;
  }
  async migrate(file: db.File) {
    if (!file.url) return;
    const root = this.objectStorageApi.root;
    const localFile = await this.saveImageFromUri(file.url);
    await sleep(100);
    const cloudPath = file.url.split("/").slice(3).join("/").split("?")[0];
    const path = root ? cloudPath.replace(`${root}/`, "") : cloudPath;
    const url = await this.objectStorageApi.uploadFileFromLocal({
      path,
      localPath: localFile.localPath,
    });
    return await file.set({ url }).save();
  }
  async summarize(): Promise<cnst.FileSummary> {
    return {
      ...(await this.fileModel.getSummary()),
    };
  }
}
