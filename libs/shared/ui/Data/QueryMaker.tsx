"use client";
import { BiSearch } from "react-icons/bi";
import { DatePicker, Input, Modal, Select } from "@util/ui";
import {
  type Dayjs,
  type FilterArgMeta,
  type GqlScalarName,
  type QueryOf,
  type Type,
  getCnstMeta,
  getFilterArgMetas,
  getFilterQuery,
  getFilterQueryMap,
  getGqlTypeStr,
  getQueryMap,
  hasTextField,
  scalarDefaultMap,
} from "@core/base";
import { capitalize } from "@core/common";
import { clsx } from "@core/client";
import { st } from "@shared/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@core/next";

interface QueryMakerProps {
  className?: string;
  sliceName: string;
  query?: { [key: string]: any };
}
interface QuerySetting {
  queryKey: string;
  arg: Record<string, any>;
}
const searchQuerySetting: QuerySetting = { queryKey: "search", arg: { $search: undefined as string | undefined } };
const byStatusQuerySetting: QuerySetting = { queryKey: "byStatuses", arg: { statuses: null } };

export default function QueryMaker({ className, sliceName, query }: QueryMakerProps) {
  const cnst = getCnstMeta(sliceName);
  const isModelSearchable = hasTextField(cnst.Full);
  const summaryRef = cnst.Summary;
  const { subMenu, filter } = st.use.searchParams();
  const summaryQueryMap = getQueryMap(summaryRef as Type);
  const filterRef = cnst.Filter;
  const filterQueryMap = getFilterQueryMap(filterRef);
  const defaultQuerySetting = { ...(isModelSearchable ? searchQuerySetting : byStatusQuerySetting), ...(query ?? {}) };
  const isInitialized = useRef(false);
  const [querySetting, setQuerySetting] = useState<QuerySetting>(defaultQuerySetting);
  const getQuery = useCallback(
    (querySetting: QuerySetting) => {
      if (summaryQueryMap[querySetting.queryKey]) {
        const query =
          typeof summaryQueryMap[querySetting.queryKey] === "function"
            ? (summaryQueryMap[querySetting.queryKey] as () => QueryOf<any>)()
            : (summaryQueryMap[querySetting.queryKey] ?? null);
        if (!query) throw new Error(`Query not found`);
        return query as QueryOf<any>;
      } else if (querySetting.queryKey === "search") {
        const query = querySetting.arg;
        return query;
      } else {
        const queryFn = getFilterQuery(filterRef, querySetting.queryKey);
        const filterQueryArgMetas = getFilterArgMetas(filterRef, querySetting.queryKey);
        const queryArgs = filterQueryArgMetas.map((queryArgMeta) => querySetting.arg[queryArgMeta.name] as string);
        const query = queryFn(...queryArgs);
        return query;
      }
    },
    [filter]
  );
  const setQueryOfModel = useDebounce((querySetting: QuerySetting) => {
    const query = getQuery(querySetting);
    if (!isInitialized.current) {
      void st.do[`init${capitalize(sliceName)}` as "initAdmin"](query);
      isInitialized.current = true;
    } else void st.do[`setQueryArgsOf${capitalize(sliceName)}` as "setQueryArgsOfAdmin"](query);
  });
  useEffect(() => {
    if (filter && subMenu === sliceName) setQuerySetting({ queryKey: filter, arg: {} });
  }, [filter, subMenu]);
  useEffect(() => {
    setQueryOfModel(querySetting);
  }, [querySetting]);
  return (
    <div className={clsx("flex w-full items-center gap-4", className)}>
      <div className="flex flex-col gap-2">
        Query
        <Select
          value={querySetting.queryKey}
          innerClassName="h-12 min-w-[196px]"
          onChange={(queryKey) => {
            const filterQueryArgMetas = getFilterArgMetas(filterRef, queryKey);
            const defaultArg = Object.fromEntries(
              filterQueryArgMetas.map((queryArgMeta) => [
                queryArgMeta.name,
                queryArgMeta.nullable
                  ? null
                  : queryArgMeta.arrDepth
                    ? { $in: [] }
                    : queryArgMeta.default
                      ? typeof queryArgMeta.default === "function"
                        ? queryArgMeta.default()
                        : queryArgMeta.default
                      : (scalarDefaultMap.get(queryArgMeta.modelRef) ?? null),
              ])
            );
            setQuerySetting({ queryKey, arg: defaultArg });
          }}
        >
          {[...(isModelSearchable ? ["search"] : []), ...[...filterQueryMap.keys()].filter((key) => key !== "any")].map(
            (queryKey) => (
              <Select.Option value={queryKey} key={queryKey}>
                {queryKey}
              </Select.Option>
            )
          )}
        </Select>
      </div>
      {querySetting.queryKey === "search" ? (
        <div className="flex w-full flex-col gap-2">
          Search
          <label className="input input-bordered flex w-full items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Type to search..."
              value={(querySetting.arg.$search as string | undefined) ?? ""}
              onChange={(e) => {
                setQuerySetting({ ...querySetting, arg: e.target.value ? { $search: e.target.value } : {} });
              }}
            />
            <BiSearch className="size-4 opacity-70" />
          </label>
        </div>
      ) : summaryQueryMap[querySetting.queryKey] ? null : (
        getFilterArgMetas(filterRef, querySetting.queryKey).map((queryArgMeta, idx) => (
          <div className="flex flex-col gap-2" key={idx}>
            <div className="text-sm text-gray-500">{queryArgMeta.name}</div>
            <QueryArg
              queryArgMeta={queryArgMeta}
              value={querySetting.arg[queryArgMeta.name] as string}
              onChange={(value) => {
                setQuerySetting({
                  ...querySetting,
                  arg: { ...querySetting.arg, [queryArgMeta.name]: value as string },
                });
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}

interface QueryArgProps {
  queryArgMeta: FilterArgMeta;
  value: any;
  onChange: (value: any) => void;
}
function QueryArg({ queryArgMeta, value, onChange }: QueryArgProps) {
  const argType = getGqlTypeStr(queryArgMeta.modelRef) as GqlScalarName;
  if (queryArgMeta.enum && queryArgMeta.arrDepth && queryArgMeta.arrDepth < 2)
    return (
      <QueryArg.Enum
        options={queryArgMeta.enum as (string | number)[]}
        value={value as (string | number)[] | null}
        onChange={onChange}
        nullable={queryArgMeta.nullable}
        multiple={queryArgMeta.arrDepth ? queryArgMeta.arrDepth >= 1 : false}
      />
    );
  return argType === "ID" ? (
    <QueryArg.ID queryArgMeta={queryArgMeta} value={value as string} onChange={onChange} />
  ) : argType === "Int" ? (
    <QueryArg.Int value={value as number} onChange={onChange} />
  ) : argType === "Float" ? (
    <QueryArg.Float value={value as number} onChange={onChange} />
  ) : argType === "String" ? (
    <QueryArg.String value={value as string} onChange={onChange} />
  ) : argType === "Boolean" ? (
    <QueryArg.Boolean value={value as boolean} onChange={onChange} />
  ) : argType === "Date" ? (
    <QueryArg.Date value={value as Dayjs} onChange={onChange} />
  ) : argType === "JSON" ? (
    <QueryArg.Json value={value as string} onChange={onChange} />
  ) : (
    <></>
  );
}

interface ArgEnumProps {
  options: (string | number)[];
  value: (string | number)[] | string | number | null;
  onChange: (value: (string | number)[] | string | number | null) => void;
  nullable?: boolean;
  multiple?: boolean;
}
const ArgEnum = ({ options, value, onChange, nullable, multiple }: ArgEnumProps) => {
  return (
    <Select
      innerClassName="h-12 min-w-[196px]"
      value={value ?? []}
      onChange={(val) => {
        onChange(val);
      }}
      mode={multiple ? "multiple" : "single"}
    >
      {options.map((option) => (
        <Select.Option key={option} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  );
};
QueryArg.Enum = ArgEnum;

interface ArgIDProps {
  queryArgMeta: FilterArgMeta;
  value: string | null;
  onChange: (value: string | null) => void;
}
const ArgID = ({ queryArgMeta, value, onChange }: ArgIDProps) => {
  if (!queryArgMeta.ref)
    return (
      <Input
        inputClassName="w-full"
        value={value ?? ""}
        onChange={(value) => {
          onChange(value ? value : null);
        }}
        validate={(e) => true}
      />
    );
  else return <SelectIDWithRef queryArgMeta={queryArgMeta} value={value} onChange={onChange} />;
};
QueryArg.ID = ArgID;

interface SelectIDWithRefProps {
  queryArgMeta: FilterArgMeta;
  value: string | null;
  onChange: (value: string | null) => void;
}
const SelectIDWithRef = ({ queryArgMeta, value, onChange }: SelectIDWithRefProps) => {
  if (!queryArgMeta.ref) throw new Error("No ref in queryArgMeta");
  const [modalOpen, setModalOpen] = useState(false);
  const storeUse = st.use as { [key: string]: <T>() => T };
  const modelMap = storeUse[`${queryArgMeta.ref}Map`]<Map<string, { [key: string]: string }>>();
  const renderOption = queryArgMeta.renderOption ?? ((value: { id: string }) => value.id);
  const selectedModel = value ? modelMap.get(value) : null;
  return (
    <>
      <button
        className="btn"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        {selectedModel ? renderOption(selectedModel) : `Select ${queryArgMeta.ref}`}
      </button>
      <Modal
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
      >
        <div className="flex w-full flex-col gap-4 pb-[256px]">
          <QueryMaker sliceName={queryArgMeta.ref} />
          <Select
            className="w-full"
            innerClassName="h-12 w-full"
            value={value}
            mode={queryArgMeta.arrDepth ? "multiple" : "single"}
            onChange={(value) => {
              onChange(value);
              if (!Array.isArray(value)) setModalOpen(false);
            }}
          >
            {[...modelMap.values()].map((model) => (
              <Select.Option key={model.id} value={model.id}>
                {renderOption(model)}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </>
  );
};

interface ArgIntProps {
  value: number;
  onChange: (value: number) => void;
}
const ArgInt = ({ value, onChange }: ArgIntProps) => {
  return (
    <Input.Number
      inputClassName="w-full"
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
      validate={(e) => true}
    />
  );
};
QueryArg.Int = ArgInt;

interface ArgFloatProps {
  value: number;
  onChange: (value: number) => void;
}
const ArgFloat = ({ value, onChange }: ArgFloatProps) => {
  return (
    <Input.Number
      inputClassName="w-full"
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
      validate={(e) => true}
    />
  );
};
QueryArg.Float = ArgFloat;

interface ArgStringProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}
const ArgString = ({ value, onChange }: ArgStringProps) => {
  return (
    <Input
      inputClassName="w-full"
      value={value ?? ""}
      onChange={(value) => {
        onChange(value ? value : null);
      }}
      validate={(e) => true}
    />
  );
};
QueryArg.String = ArgString;

interface ArgBooleanProps {
  value: boolean;
  onChange: (value: boolean) => void;
}
const ArgBoolean = ({ value, onChange }: ArgBooleanProps) => {
  return (
    <Input.Checkbox
      className="w-full"
      checked={value}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
};
QueryArg.Boolean = ArgBoolean;

interface ArgDateProps {
  value: Dayjs;
  onChange: (value: Dayjs | null) => void;
}
const ArgDate = ({ value, onChange }: ArgDateProps) => {
  return (
    <DatePicker
      className="w-full"
      value={value}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
};
QueryArg.Date = ArgDate;

interface ArgJsonProps {
  value: string;
  onChange: (value: string) => void;
}
const ArgJson = ({ value, onChange }: ArgJsonProps) => {
  return (
    <Input.TextArea
      validate={(e) => true}
      className="w-full "
      inputClassName="w-full min-h-[300px]"
      value={value}
      onPressEnter={(value) => {
        onChange(value);
      }}
      onChange={(value) => {
        onChange(value);
      }}
    />
  );
};
QueryArg.Json = ArgJson;
