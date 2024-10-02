import * as fs from "fs";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
  type ListObjectsCommandInput,
  PutObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Logger } from "@core/common";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import { Try } from "@core/server";

interface GetObjectRequest {
  path: string;
}
interface DownloadRequest extends GetObjectRequest {
  localPath: string;
  renamePath?: string;
}
interface LocalFilePath {
  localPath: string;
}
interface S3UploadRequest {
  path: string;
  localPath: string;
  meta?: { [key: string]: string };
  rename?: string;
  host?: string;
  root?: string;
}
interface CopyRequest {
  bucket: string;
  copyPath: string;
  pastePath: string;
  filename: string;
  host?: string;
}
interface Bucket {
  name: string;
  host: string;
  root: string;
}
export interface ObjectStorageOptions {
  service: "s3" | "minio" | "r2" | "naver";
  region: string;
  accessKey: string;
  secretAccessKey: string;
  distributionId: string;
  bucket: string;
  host: string | null;
}

export class ObjectStorageApi {
  readonly #logger = new Logger("ObjectStorageApi");
  readonly #options: ObjectStorageOptions;
  readonly root: string;
  readonly #s3: S3Client;
  readonly #cloudFront: CloudFrontClient | null;
  constructor(appName: string, options: ObjectStorageOptions) {
    this.root = `${appName}/backend`;
    this.#options = options;
    const s3 =
      this.#options.service === "s3"
        ? new S3Client({
            region: this.#options.region,
            credentials: {
              accessKeyId: this.#options.accessKey,
              secretAccessKey: this.#options.secretAccessKey,
            },
          })
        : this.#options.service === "r2"
          ? new S3Client({
              region: "auto",
              endpoint: this.#options.region,
              credentials: {
                accessKeyId: this.#options.accessKey,
                secretAccessKey: this.#options.secretAccessKey,
              },
            })
          : this.#options.service === "naver"
            ? new S3Client({
                endpoint: "https://kr.object.ncloudstorage.com",
                region: this.#options.region,
                credentials: {
                  accessKeyId: this.#options.accessKey,
                  secretAccessKey: this.#options.secretAccessKey,
                },
              })
            : undefined;
    if (!s3) throw new Error("Invalid service type");
    this.#s3 = s3;
    this.#cloudFront = new CloudFrontClient();
  }
  async getObject({ path }: GetObjectRequest) {
    const Key = `${this.root}/${path}`;
    return await this.#s3.send(new GetObjectCommand({ Bucket: this.#options.bucket, Key }));
  }
  async getJsonObject({ path }: GetObjectRequest) {
    const Key = `${this.root}/${path}`;
    const data = await this.#s3.send(new GetObjectCommand({ Bucket: this.#options.bucket, Key }));
    return JSON.parse(data.Body?.toString() ?? "") as object;
  }
  async getObjectList() {
    return await this.#s3.send(new ListObjectsCommand({ Bucket: this.#options.bucket, Prefix: this.root }));
  }
  async getFileList(prefix: string | undefined = undefined) {
    const filenames: string[] = [];
    return await this.getAllKeys(
      {
        Bucket: this.#options.bucket,
        Prefix: `${this.root}${prefix ? `/${prefix}` : ""}`,
      },
      filenames
    );
  }
  async getAllKeys(params: ListObjectsCommandInput, allKeys: string[] = []) {
    const response = await this.#s3.send(new ListObjectsCommand(params));
    response.Contents?.forEach((obj) => allKeys.push(obj.Key ?? ""));
    if (response.NextMarker) {
      params.Marker = response.NextMarker;
      await this.getAllKeys(params, allKeys); // RECURSIVE CALL
    }
    return allKeys;
  }
  async uploadFileFromLocal({ path, localPath, meta, root }: S3UploadRequest) {
    const Key = `${root ?? this.root}/${path}`;
    await this.#s3.send(
      new PutObjectCommand({
        Bucket: this.#options.bucket,
        Key,
        Metadata: meta,
        ACL: this.#options.service !== "r2" ? "public-read" : undefined,
        Body: fs.createReadStream(localPath),
        ContentType: this.#getContentType(path),
      })
    );
    return this.#options.host ? this.#getServiceUrl(this.#options.host, Key) : this.#getObjectUrl(Key);
  }

  uploadFileFromStream({
    path,
    body,
    mimetype,
    root,
    updateProgress,
    uploadSuccess,
  }: {
    path: string;
    body: fs.ReadStream | Readable;
    mimetype: string;
    root?: string;
    updateProgress: (progress: Progress) => void;
    uploadSuccess: (url: string) => void;
  }) {
    const Key = `${root ?? this.root}/${path}`;
    const upload = new Upload({
      client: this.#s3,
      params: {
        Bucket: this.#options.bucket,
        Key,
        ACL: this.#options.service !== "r2" ? "public-read" : undefined,
        Body: body,
        ContentType: mimetype,
      },
      partSize: 5 * 1024 * 1024,
    });
    upload.on("httpUploadProgress", (progress) => {
      updateProgress(progress);
    });
    upload.done().then(
      (value) => {
        const fileUrl = this.#options.host ? this.#getServiceUrl(this.#options.host, Key) : this.#getObjectUrl(Key);
        uploadSuccess(fileUrl);
      },
      (reason: string) => {
        this.#logger.error(reason);
      }
    );
  }

  async saveFile({ path, localPath, renamePath }: DownloadRequest): Promise<LocalFilePath> {
    if (!fs.existsSync(localPath)) fs.mkdirSync(localPath, { recursive: true });
    const { Body } = await this.getObject({ path });
    if (!Body) throw new Error("File Not Found");
    const stream = (Body as unknown as fs.ReadStream).pipe(fs.createWriteStream(localPath));
    return new Promise((resolve, reject) => {
      stream.on("end", () => {
        renamePath && fs.renameSync(localPath, renamePath);
        setTimeout(() => {
          resolve({ localPath: renamePath ?? localPath });
        }, 100);
      });
      stream.on("error", (error) => {
        reject("File Download Error");
      });
    });
  }
  async copyObject({ copyPath, pastePath, host }: CopyRequest) {
    const Key = `${this.root}/${pastePath}`;
    await this.#s3.send(
      new CopyObjectCommand({
        CopySource: `${this.#options.bucket}/${this.root}/${copyPath}`,
        Bucket: this.#options.bucket,
        Key,
        ACL: this.#options.service === "s3" ? "public-read" : undefined,
      })
    );
    return host ? this.#getServiceUrl(host, Key) : this.#getObjectUrl(Key);
  }
  @Try()
  async deleteObject(path: string) {
    const Key = `${this.root}/${path}`;
    await this.#s3.send(new DeleteObjectCommand({ Bucket: this.#options.bucket, Key }));
    return true;
  }
  async invalidateObjects(keys: string[]) {
    if (!this.#cloudFront) throw new Error("CloudFront is not initialized");
    await this.#cloudFront.send(
      new CreateInvalidationCommand({
        DistributionId: this.#options.distributionId,
        InvalidationBatch: {
          Paths: {
            Quantity: keys.length,
            Items: keys.map((key) => `${this.root}/${key}`),
          },
          CallerReference: new Date().getTime().toString(),
        },
      })
    );
  }
  async makePublic(path: string) {
    const Key = `${this.root}/${path}`;
    await this.#s3.send(new PutObjectAclCommand({ ACL: "public-read", Bucket: this.#options.bucket, Key }));
    return true;
  }
  async makePrivate(path: string) {
    const Key = `${this.root}/${path}`;
    await this.#s3.send(new PutObjectAclCommand({ ACL: "private", Bucket: this.#options.bucket, Key }));
    return true;
  }
  #getObjectUrl(object: string) {
    return `https://${this.#options.bucket}.s3.${this.#options.region}.amazonaws.com/${object}`;
  }
  #getServiceUrl(host: string, object: string) {
    return `https://${host}/${object}`;
  }
  #getContentType(path: string) {
    const dirs = path.split("/");
    const filename = dirs.at(-1) ?? "";
    return filename.includes(".png")
      ? "image/png"
      : filename.includes(".jpg")
        ? "image/jpeg"
        : filename.includes(".json")
          ? "application/json"
          : undefined;
  }
}
