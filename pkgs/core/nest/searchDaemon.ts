/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Global, Inject, Injectable, Module } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Logger, lowerlize } from "@core/common";
import { default as MeiliSearch } from "meilisearch";
import {
  type TextDoc,
  type Type,
  getCnstMeta,
  getFieldMetaMap,
  getFieldMetas,
  getFilterSortMap,
  getFullModelRef,
} from "@core/base";
import { getAllDatabaseModelNames } from "@core/server";
import type { Connection, Types } from "mongoose";
// {
//   _id: {
//     _data: '8266BDC161000000012B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F69640064657ADB477DF7FD75CBED4B4D0004'
//   },
//   operationType: 'update',
//   clusterTime: new Timestamp({ t: 1723711841, i: 1 }),
//   wallTime: 2024-08-15T08:50:41.833Z,
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('657adb477df7fd75cbed4b4d') },
//   updateDescription: {
//     updatedFields: {
//       password: '$2a$11$.AESPbU/TMesyjz6djnrJuxPp7Wvqdicgz6wlBWvMk1FNDtlSFoXW',
//       updatedAt: 2024-08-15T08:50:41.317Z
//     },
//     removedFields: [],
//     truncatedArrays: []
//   }
// }
// {
//   _id: {
//     _data: '8266BDC1AB000000022B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F6964006466BDC1AB390B869C3FD0EE770004'
//   },
//   operationType: 'insert',
//   clusterTime: new Timestamp({ t: 1723711915, i: 2 }),
//   wallTime: 2024-08-15T08:51:55.642Z,
//   fullDocument: {
//     _id: new ObjectId('66bdc1ab390b869c3fd0ee77'),
//     accountId: 'qwesfddsfr@qwer.com',
//     password: '$2a$11$lwkGcmFVs6ug7EWEdkG0keXoHeP6UFZCURFzOe0pKVXt2aDU2lGiS',
//     roles: [],
//     status: 'active',
//     lastLoginAt: 2024-08-15T08:51:55.394Z,
//     createdAt: 2024-08-15T08:51:55.395Z,
//     updatedAt: 2024-08-15T08:51:55.395Z,
//     __v: 0
//   },
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('66bdc1ab390b869c3fd0ee77') }
// }
// {
//   _id: {
//     _data: '8266BDC1CE000000012B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F6964006466BDC1AB390B869C3FD0EE770004'
//   },
//   operationType: 'delete',
//   clusterTime: new Timestamp({ t: 1723711950, i: 1 }),
//   wallTime: 2024-08-15T08:52:30.668Z,
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('66bdc1ab390b869c3fd0ee77') }
// }
// {
//   _id: {
//     _data: '8266BDC2A2000000022B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F6964006466BAA5FCBA29D4D5B80B171F0004'
//   },
//   operationType: 'update',
//   clusterTime: new Timestamp({ t: 1723712162, i: 2 }),
//   wallTime: 2024-08-15T08:56:02.732Z,
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('66baa5fcba29d4d5b80b171f') },
//   updateDescription: {
//     updatedFields: { 'testField.testNested.testStr': 'afdjkladsjflkas' },
//     removedFields: [],
//     truncatedArrays: []
//   }
// }
// {
//   _id: {
//     _data: '8266BDC3E4000000022B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F6964006466BAA5FCBA29D4D5B80B171F0004'
//   },
//   operationType: 'update',
//   clusterTime: new Timestamp({ t: 1723712484, i: 2 }),
//   wallTime: 2024-08-15T09:01:24.028Z,
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('66baa5fcba29d4d5b80b171f') },
//   updateDescription: {
//     updatedFields: {},
//     removedFields: [ 'testField.testNested.asdf' ],
//     truncatedArrays: []
//   }
// }
// {
//   _id: {
//     _data: '8266BDC43F000000022B022C0100296E5A1004E9487B8EF2864139A085DBC4AD6DB29C46645F6964006466BAA5FCBA29D4D5B80B171F0004'
//   },
//   operationType: 'update',
//   clusterTime: new Timestamp({ t: 1723712575, i: 2 }),
//   wallTime: 2024-08-15T09:02:55.372Z,
//   ns: { db: 'seon-debug', coll: 'admins' },
//   documentKey: { _id: new ObjectId('66baa5fcba29d4d5b80b171f') },
//   updateDescription: {
//     updatedFields: {},
//     removedFields: [ 'testField.testNested' ],
//     truncatedArrays: []
//   }
// }

interface ChangedData {
  _id: { _data: string };
  operationType: "update" | "insert" | "delete";
  clusterTime: { t: number; i: number };
  wallTime: Date;
  ns: { db: string; coll: string };
  documentKey: { _id: Types.ObjectId };
  updateDescription?: {
    updatedFields: Record<string, any>;
    removedFields: string[];
    truncatedArrays: any[];
  };
  fullDocument?: Record<string, any>;
}

const hasTextField = (modelRef: Type) => {
  const fieldMetas = getFieldMetas(modelRef);
  return fieldMetas.some(
    (fieldMeta) =>
      !!fieldMeta.text ||
      (fieldMeta.isScalar && fieldMeta.isClass && fieldMeta.select && hasTextField(fieldMeta.modelRef))
  );
};
const getTextFieldKeys = (
  modelRef: Type
): {
  stringTextFields: string[];
  scalarTextFields: string[];
  allTextFields: string[];
  allSearchFields: string[];
  allFilterFields: string[];
} => {
  const allSearchFields: string[] = [];
  const allFilterFields: string[] = [];
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const fieldMetas = [...fieldMetaMap.values()];
  const stringTextFields = fieldMetas
    .filter((fieldMeta) => !!fieldMeta.text)
    .map((fieldMeta) => {
      if (fieldMeta.text === "filter") allFilterFields.push(fieldMeta.key);
      else if (fieldMeta.text === "search") allSearchFields.push(fieldMeta.key);
      return fieldMeta.key;
    });
  const scalarTextFields = fieldMetas
    .filter(
      (fieldMeta) => fieldMeta.isScalar && fieldMeta.isClass && fieldMeta.select && hasTextField(fieldMeta.modelRef)
    )
    .map((fieldMeta) => fieldMeta.key);
  const deepFields = scalarTextFields
    .map((key) => {
      const fieldMeta = fieldMetaMap.get(key);
      if (!fieldMeta) throw new Error(`No fieldMeta for ${key}`);
      const { stringTextFields, allTextFields, allSearchFields, allFilterFields } = getTextFieldKeys(
        fieldMeta.modelRef
      );
      allFilterFields.push(...allSearchFields.map((field) => `${key}.${field}`));
      allSearchFields.push(...stringTextFields.map((field) => `${key}.${field}`));
      return [
        ...stringTextFields.map((field) => `${key}.${field}`),
        ...allTextFields.map((field) => `${key}.${field}`),
      ];
    })
    .flat();
  return {
    stringTextFields,
    scalarTextFields,
    allTextFields: [...stringTextFields, ...deepFields],
    allSearchFields,
    allFilterFields,
  };
};
export const makeTextFilter = (modelRef: Type) => {
  const fieldMetaMap = getFieldMetaMap(modelRef);
  const { stringTextFields, scalarTextFields } = getTextFieldKeys(modelRef);
  const filterData = (data: Record<string, any> | Record<string, any>[], assignObj: { [key: string]: string } = {}) => {
    if (Array.isArray(data)) return data.map((d) => filterData(d));
    return Object.assign(
      Object.fromEntries([
        ...stringTextFields.map((key) => [key, data[key]]),
        ...scalarTextFields.map((key) => {
          const fieldMeta = fieldMetaMap.get(key);
          if (!fieldMeta) throw new Error(`No fieldMeta for ${key}`);
          const filterFunc = makeTextFilter(fieldMeta.modelRef);
          return [key, filterFunc(data[key])];
        }),
      ]),
      assignObj
    );
  };
  return filterData as (data: Record<string, any>, assignObj?: { [key: string]: string }) => TextDoc;
};
const getSortableAttributes = (refName: string) => {
  const cnst = getCnstMeta(refName);
  const sortMap = getFilterSortMap(cnst.Filter);
  const sortFields = Object.values(sortMap)
    .filter((val) => typeof val === "object")
    .map((sort: { [key: string]: any }) => Object.keys(sort))
    .flat();
  return [...new Set(sortFields)];
};

@Injectable()
class SearchDaemon {
  private readonly logger = new Logger("SearchDaemon");
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @Inject("MEILI_CLIENT") private readonly meili: MeiliSearch
  ) {}
  async onModuleInit() {
    const databaseModelNames = getAllDatabaseModelNames();
    const indexes = (await this.meili.getIndexes({ limit: 1000 })).results;
    const indexMap = new Map(indexes.map((index) => [index.uid, index]));
    const indexCreationNames: string[] = [];
    const indexUpdateNames: string[] = [];
    for (const modelName of databaseModelNames) {
      const indexName = lowerlize(modelName);
      const modelRef = getFullModelRef(modelName);
      if (!hasTextField(modelRef)) continue;
      const index = indexMap.get(indexName);
      if (!index) indexCreationNames.push(indexName);
      else if (index.primaryKey !== "id") indexUpdateNames.push(indexName);
    }
    for (const indexName of indexCreationNames) await this.meili.createIndex(indexName, { primaryKey: "id" });
    for (const indexName of indexUpdateNames) await this.meili.updateIndex(indexName, { primaryKey: "id" });

    for (const modelName of databaseModelNames) {
      const indexName = lowerlize(modelName);
      const model = this.connection.models[modelName];
      const modelRef = getFullModelRef(modelName);
      if (!hasTextField(modelRef)) continue;
      const searchIndex = this.meili.index(indexName);
      const { stringTextFields, scalarTextFields, allSearchFields, allFilterFields } = getTextFieldKeys(modelRef);
      const settings = await searchIndex.getSettings();
      const allSearchFieldSet = new Set(allSearchFields);
      const allFilterFieldSet = new Set(allFilterFields);
      const searchFieldSet = new Set(settings.searchableAttributes);
      const filterFieldSet = new Set(settings.filterableAttributes);
      const needUpdateSetting =
        !allSearchFields.every((field) => searchFieldSet.has(field)) ||
        !allFilterFields.every((field) => filterFieldSet.has(field)) ||
        !settings.searchableAttributes?.every((field) => allSearchFieldSet.has(field)) ||
        !settings.filterableAttributes?.every((field) => allFilterFieldSet.has(field));
      if (needUpdateSetting) {
        this.logger.info(`update index settings (${modelName})`);
        await searchIndex.updateSettings({
          searchableAttributes: allSearchFields,
          filterableAttributes: allFilterFields,
          sortableAttributes: getSortableAttributes(indexName),
        });
      }
      const stringTextFieldSet = new Set(stringTextFields);
      const scalarTextFieldSet = new Set(scalarTextFields);

      const filterText = makeTextFilter(modelRef);
      model.watch().on("change", async (data: ChangedData) => {
        try {
          const id = data.documentKey._id.toString();
          if (data.operationType === "delete") {
            this.logger.trace(`delete text doc (${modelName}): ${id}`);
            return await searchIndex.deleteDocument(id);
          } else if (data.operationType === "insert") {
            this.logger.trace(`insert text doc (${modelName}): ${data.documentKey._id}`);
            if (!data.fullDocument) throw new Error("No fullDocument");
            const textFilteredData = filterText(data.fullDocument);
            return await searchIndex.addDocuments([textFilteredData]);
          } else if (data.operationType === "update") {
            const updatedFields = data.updateDescription?.updatedFields ?? {};
            const isRemoved = !!updatedFields.removedAt;
            if (isRemoved) {
              this.logger.trace(`remove text doc (${modelName}): ${id}`);
              return await searchIndex.deleteDocument(id);
            }
            this.logger.trace(`update text doc (${modelName}): ${data.documentKey._id}`);
            const updatedFieldKeys = Object.keys(updatedFields);
            const removedFieldKeys = data.updateDescription?.removedFields ?? [];
            const isScalarTextFieldUpdated = [...updatedFieldKeys, ...removedFieldKeys]
              .map((key) => key.split(".")[0])
              .some((key) => scalarTextFieldSet.has(key));
            if (isScalarTextFieldUpdated) {
              const doc = await model.findById(data.documentKey._id);
              if (!doc) this.logger.error(`No doc for ${data.documentKey._id}`);
              const textFilteredData = filterText(doc, { id });
              return await searchIndex.updateDocuments([textFilteredData]);
            } else {
              const updateKeys = updatedFieldKeys.filter((key) => stringTextFieldSet.has(key));
              const removeKeys = removedFieldKeys.filter((key) => stringTextFieldSet.has(key));
              if (!updateKeys.length && !removeKeys.length) return;
              const textFilteredData = Object.fromEntries([
                ["id", id],
                ...updateKeys.map((key) => [key, updatedFields[key]]),
                ...removeKeys.map((key) => [key, null]),
              ]);
              return await searchIndex.updateDocuments([textFilteredData]);
            }
          }
        } catch (e) {
          this.logger.error(e as string);
        }
      });
    }
  }
}

@Global()
@Module({
  providers: [SearchDaemon],
})
export class SearchDaemonModule {}
