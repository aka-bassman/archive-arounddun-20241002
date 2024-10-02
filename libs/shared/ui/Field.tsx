"use client";
import { AiOutlineCloseCircle, AiOutlineNumber, AiOutlinePlus, AiTwotoneEnvironment } from "react-icons/ai";
import { BiHelpCircle, BiMinusCircle } from "react-icons/bi";
import {
  DatePicker,
  DraggableList,
  Input,
  MapView,
  Modal,
  Select,
  Upload,
  ToggleSelect as UtilToggleSelect,
} from "@util/ui";
import { Dayjs, SortType, dayjs } from "@core/base";
import { Editor } from "./Editor";
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";
import { capitalize, formatPhone, isPhoneNumber, lowerlize } from "@core/common";
import { clsx } from "@core/client";
import { cnst, fetch, st, usePage } from "@shared/client";
import { lazy, useInterval } from "@core/next";

const DaumPostcode = lazy(() => import("react-daum-postcode"), { ssr: false });

interface LabelProps {
  className?: string;
  label: string;
  desc?: string;
  unit?: string;
  nullable?: boolean;
  mode?: "view" | "edit";
}
const Label = ({ className, label, desc, unit, nullable, mode = "edit" }: LabelProps) => {
  return (
    <span className={clsx("flex shrink-0 items-center gap-1", className)}>
      {!nullable && mode === "edit" ? <span>* </span> : null}
      {capitalize(label)}
      {unit ? <span> ({unit})</span> : null}
      {desc ? (
        <span className="tooltip tooltip-right" data-tip={desc}>
          <BiHelpCircle />
        </span>
      ) : null}
    </span>
  );
};

interface FieldProps {
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  label?: string;
  desc?: string;
  nullable?: boolean;
  children?: any;
}
export const Field = ({
  className,
  containerClassName,
  labelClassName,
  label,
  desc,
  nullable,
  children,
}: FieldProps) => {
  return (
    <div className={className}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className={clsx("mt-2 flex flex-col gap-4 px-4", containerClassName)}>{children}</div>
    </div>
  );
};
Field.Label = Label;

interface ListProps<Item> {
  className?: string;
  labelClassName?: string;
  label?: string;
  desc?: string;
  nullable?: boolean;
  value: Item[];
  onChange: (value: Item[]) => void;
  onAdd: () => void;
  renderItem: (item: Item, idx: number) => ReactNode;
}
const List = <Item,>({
  className,
  labelClassName,
  label,
  desc,
  value,
  onChange,
  onAdd,
  nullable,
  renderItem,
}: ListProps<Item>) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {renderItem(item, idx)}
          <button
            className="btn"
            onClick={() => {
              onChange(value.filter((_, i) => i !== idx));
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="btn"
        onClick={() => {
          onAdd();
        }}
      >
        + Add
      </button>
    </div>
  );
};
Field.List = List;

interface TextProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
}
const Text = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  minlength = nullable ? 0 : 2,
  maxlength = 80,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
}: TextProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Input
        value={value ?? ""}
        nullable={nullable}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(transform(value));
        }}
        disabled={disabled}
        className={clsx("w-full", "")}
        inputClassName={clsx("focus:border-primary w-full", inputClassName)}
        validate={(text: string) => {
          if (text.length < minlength) return l("shared.textTooShortError", { minlength });
          else if (text.length > maxlength) return l("shared.textTooLongError", { maxlength });
          else return validate?.(text) ?? true;
        }}
        onPressEnter={onPressEnter}
      />
    </div>
  );
};
Field.Text = memo(Text);

interface DropdownProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
  dropdownClassName?: string;
  selectorClassName?: string;
  selectedClassName?: string;
  nullable?: boolean;
  disabled?: boolean;
}

const Dropdown = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  options,
  onChange,
  nullable,
  disabled,
  dropdownClassName,
  selectorClassName,
  selectedClassName,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { l } = usePage();

  const selectedOption = options.find((option) => option.value === value);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div className={clsx("flex flex-col", className)} ref={dropdownRef}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className="relative">
        <button
          className={clsx(
            "input input-bordered w-full focus:outline-none",
            disabled && "cursor-not-allowed opacity-50",
            dropdownClassName
          )}
          onClick={() => {
            if (!disabled) setIsOpen(!isOpen);
          }}
        >
          {selectedOption ? selectedOption.label : "none"}
        </button>
        {isOpen && (
          <ul className={clsx("bg-base-100 absolute z-10 mt-1 w-full rounded shadow-lg", selectorClassName)}>
            {nullable && (
              <li
                className="cursor-pointer p-2"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                {/* {l("shared.none")} */}
              </li>
            )}
            {options.map((option) => (
              <li
                key={option.value}
                className={clsx(
                  "m-2 cursor-pointer rounded p-2",
                  option.value === value && clsx(selectedClassName, "bg-primary ")
                )}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

Field.Dropdown = memo(Dropdown);

interface TextAreaProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  rows?: number;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
}
const TextArea = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  rows = 3,
  minlength = nullable ? 0 : 2,
  maxlength = 80,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
}: TextAreaProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Input.TextArea
        value={value ?? ""}
        nullable={nullable}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(transform(value));
        }}
        disabled={disabled}
        rows={rows}
        className={clsx("w-full", "")}
        inputClassName={clsx("focus:border-primary w-full", inputClassName)}
        validate={(text: string) => {
          if (text.length < minlength) return l("shared.textTooShortError", { minlength });
          else if (text.length > maxlength) return l("shared.textTooLongError", { maxlength });
          else return validate?.(text) ?? true;
        }}
        onPressEnter={onPressEnter}
      />
    </div>
  );
};
Field.TextArea = memo(TextArea);

interface SlateProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  sliceName: string;
  value: string | null;
  onChange: (value: string) => void;
  addFile: (file: cnst.File | cnst.File[], options?: { idx?: number; limit?: number }) => void;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  debug?: boolean;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
  editorHeight?: string;
}
const Slate = ({
  label,
  desc,
  labelClassName,
  className,
  sliceName,
  value,
  onChange,
  addFile,
  placeholder,
  nullable,
  disabled,
  debug,
  minlength = nullable ? 0 : 2,
  maxlength = 80,
  transform = (v) => v,
  validate,
  onPressEnter,
  editorHeight,
}: SlateProps) => {
  const { l } = usePage();
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addModelFiles = fetch[names.addModelFiles] as (
    fileList: FileList,
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      {!disabled ? (
        <Editor.Slate
          defaultValue={value ? value : ""}
          placeholder={placeholder}
          addFilesGql={addModelFiles}
          addFile={addFile}
          // onChange={(val) => onChange(transform(val))}
          onChange={(val) => {
            onChange(val);
          }}
          disabled={disabled}
          className={clsx("w-full", "")}
          debug={debug}
          height={editorHeight}
        />
      ) : null}
    </div>
  );
};
Field.Slate = Slate;

interface SwitchProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  inputClassName?: string;
  onDesc?: string;
  offDesc?: string;
  disabled?: boolean;
}
const Switch = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  disabled,
  inputClassName,
  onDesc,
  offDesc,
}: SwitchProps) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable label={label} desc={desc} /> : null}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          disabled={disabled}
          className={clsx("toggle", inputClassName)}
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
        />
        {(onDesc ?? offDesc) ? <div className="text-info text-sm">{value ? onDesc : offDesc}</div> : null}
      </div>
    </div>
  );
};
Field.Switch = Switch;

interface ToggleSelectProps<I> {
  className?: string;
  labelClassName?: string;
  label?: string;
  desc?: string;
  model?: string;
  field?: string;
  items: { label: string; value: I }[] | readonly I[] | I[];
  value: I | null;
  nullable?: boolean;
  disabled?: boolean;
  validate?: (value: I) => boolean | string;
  onChange: (value: I) => void;
  btnClassName?: string;
}
const ToggleSelect = <I extends string>({
  className,
  labelClassName,
  label,
  desc,
  model,
  field,
  items,
  value,
  validate,
  onChange,
  nullable,
  disabled,
  btnClassName,
}: ToggleSelectProps<I>) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <UtilToggleSelect
        className="mt-2"
        nullable={!!nullable}
        btnClassName={btnClassName}
        items={
          model && field
            ? items.map((item) => ({ label: l.enum(model as any, field, item), value: item as I }))
            : (items as { label: string; value: I }[])
        }
        value={value}
        onChange={(value: I, idx) => {
          onChange(value);
        }}
        disabled={disabled}
        validate={(value: I) => {
          return validate?.(value) ?? true;
        }}
      />
    </div>
  );
};
Field.ToggleSelect = ToggleSelect;

interface MultiToggleSelectProps<I> {
  className?: string;
  labelClassName?: string;
  label?: string;
  desc?: string;
  model?: string;
  field?: string;
  items: { label: string; value: I }[] | readonly I[] | I[];
  value: I[];
  disabled?: boolean;
  minlength?: number;
  maxlength?: number;
  validate?: (value: I[]) => boolean | string;
  onChange: (value: I[]) => void;
}
const MultiToggleSelect = <I extends string>({
  className,
  labelClassName,
  label,
  desc,
  model,
  field,
  items,
  value,
  minlength,
  maxlength,
  validate,
  onChange,
  disabled,
}: MultiToggleSelectProps<I>) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={!!minlength} label={label} desc={desc} /> : null}
      <UtilToggleSelect.Multi
        nullable={!minlength}
        items={
          model && field
            ? items.map((item) => ({ label: l.enum(model as any, field, item), value: item as I }))
            : (items as { label: string; value: I }[])
        }
        value={value}
        onChange={(values: I[]) => {
          onChange(values);
        }}
        disabled={disabled}
        validate={(value: I[]) => {
          if (minlength && value.length < minlength) return l("shared.selectTooShortError", { minlength });
          else if (maxlength && value.length > maxlength) return l("shared.selectTooLongError", { maxlength });
          else return validate?.(value) ?? true;
        }}
      />
    </div>
  );
};
Field.MultiToggleSelect = MultiToggleSelect;

interface TextListProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  minTextlength?: number;
  maxTextlength?: number;
}
const TextList = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  disabled,
  transform = (v) => v,
  minlength = 0,
  maxlength = 50,
  minTextlength = 2,
  maxTextlength = 80,
  validate,
  inputClassName,
}: TextListProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={!minlength} label={label} desc={desc} /> : null}
      <DraggableList className="h-full" onChange={onChange}>
        {value.map((text, idx) => (
          <DraggableList.Item key={idx} value={text}>
            <DraggableList.Cursor>
              <div className="h-16">
                <div className="flex w-full items-center gap-2">
                  <Input
                    value={text}
                    onChange={(text) => {
                      const newValue = [...value];
                      newValue[idx] = transform(text);
                      onChange(newValue);
                    }}
                    validate={(text: string) => {
                      if (text.length < minlength) return l("shared.textTooShortError", { minlength: minTextlength });
                      else if (text.length > maxlength)
                        return l("shared.textTooLongError", { maxlength: maxTextlength });
                      else return validate?.(text) ?? true;
                    }}
                    className={clsx("w-full", inputClassName)}
                    inputClassName="w-full"
                    placeholder={placeholder}
                    disabled={disabled}
                  />
                  <button
                    className="w-6 text-2xl"
                    onClick={() => {
                      onChange(value.filter((_, i) => i !== idx));
                    }}
                  >
                    <BiMinusCircle />
                  </button>
                </div>
              </div>
            </DraggableList.Cursor>
          </DraggableList.Item>
        ))}
      </DraggableList>
      {value.length <= maxTextlength ? (
        <button
          className="btn w-full"
          onClick={() => {
            onChange([...value, ""]);
          }}
        >
          + New
        </button>
      ) : null}
    </div>
  );
};
Field.TextList = TextList;

interface TagsProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  minTextlength?: number;
  maxTextlength?: number;
  secret?: boolean;
}
const Tags = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  disabled,
  transform = (v) => v,
  minlength = 0,
  maxlength = 50,
  minTextlength = 2,
  maxTextlength = 80,
  validate,
  inputClassName,
}: TagsProps) => {
  const { l } = usePage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [tag, setTag] = useState("");
  const addTag = () => {
    if (!tag.length) return;
    onChange([...value, tag]);
    setInputVisible(false);
    setTag("");
  };
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={!minlength} label={label} desc={desc} /> : null}
      <div className="flex w-full flex-wrap items-center gap-1">
        {value.map((val, idx) => (
          <span className="badge badge-outline items-center" key={idx}>
            <AiOutlineNumber />
            {val}
            <AiOutlineCloseCircle
              className="ml-1 cursor-pointer"
              onClick={() => {
                if (!disabled) onChange(value.filter((v, i) => i !== idx));
              }}
            />
          </span>
        ))}
        {inputVisible ? (
          <Input
            inputRef={inputRef}
            icon={<AiOutlineNumber />}
            inputClassName="input input-xs w-24"
            placeholder={placeholder}
            value={tag}
            onChange={(value) => {
              setTag(transform(value));
            }}
            onBlur={addTag}
            onPressEnter={addTag}
            validate={(text: string) => {
              if (text.length < minTextlength) return l("shared.textTooShortError", { minlength: minTextlength });
              else if (text.length > maxTextlength) return l("shared.textTooLongError", { maxlength: maxTextlength });
              else return validate?.(text) ?? true;
            }}
          />
        ) : !disabled ? (
          <span
            className="badge badge-outline items-center hover:cursor-pointer"
            onClick={() => {
              setInputVisible(true);
            }}
          >
            <AiOutlinePlus /> New Tag
          </span>
        ) : null}
      </div>
    </div>
  );
};
Field.Tags = Tags;

interface CoordinateProps {
  className?: string;
  labelClassName?: string;
  mapClassName?: string;
  disabled?: boolean;
  label?: string;
  desc?: string;
  coordinate: cnst.util.Coordinate | null;
  nullable?: boolean;
  mapKey: string;
  onChange: (coordinate: cnst.util.Coordinate) => void;
}
const Coordinate = ({
  className,
  labelClassName,
  mapClassName,
  disabled,
  label,
  desc,
  nullable,
  coordinate,
  mapKey,
  onChange,
}: CoordinateProps) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <MapView.Google
        mapKey={mapKey}
        className={mapClassName}
        center={coordinate ? coordinate : undefined}
        zoom={3}
        onClick={(coordinate) => {
          if (!disabled) onChange(coordinate);
        }}
      >
        {coordinate ? (
          <MapView.Marker coordinate={coordinate}>
            <AiTwotoneEnvironment className="text-2xl" />
          </MapView.Marker>
        ) : null}
      </MapView.Google>
    </div>
  );
};
Field.Coordinate = Coordinate;

interface PostcodeProps {
  className?: string;
  label?: string;
  desc?: string;
  labelClassName?: string;
  nullable?: boolean;
  kakaoKey: string;
  address: string | null;
  onChange: ({
    address,
    addressEn,
    zipcode,
    coordinate,
  }: {
    address: string;
    addressEn: string;
    zipcode: string;
    coordinate: cnst.util.Coordinate;
  }) => void;
}
const Postcode = ({ className, labelClassName, nullable, kakaoKey, label, desc, address, onChange }: PostcodeProps) => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const getCoordinate = useCallback(async (address: string): Promise<cnst.util.Coordinate> => {
    const kakaoResp = (await (
      await window.fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${address}`, {
        headers: {
          authorization: `KakaoAK ${kakaoKey}`,
        },
      })
    ).json()) as { documents?: { x: string; y: string }[] };
    if (!kakaoResp.documents?.[0]) throw new Error("주소를 찾을 수 없습니다.");
    return {
      type: "Point",
      coordinates: [parseFloat(kakaoResp.documents[0].x), parseFloat(kakaoResp.documents[0].y)],
      altitude: 0,
    };
  }, []);
  return (
    <>
      <div className={clsx("flex flex-col", className)}>
        {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
        <input
          value={address ?? ""}
          className="input input-bordered w-96"
          onClick={() => {
            setPostModalOpen(true);
          }}
        />
      </div>
      <Modal
        open={postModalOpen}
        onCancel={() => {
          setPostModalOpen(false);
        }}
        bodyClassName="p-0"
        title="주소 선택"
      >
        <div className="size-full">
          <DaumPostcode
            onClose={() => {
              setPostModalOpen(false);
            }}
            onComplete={({ address, addressEnglish: addressEn, zonecode: zipcode }) => {
              void getCoordinate(address).then((coordinate) => {
                onChange({ address, addressEn, zipcode, coordinate });
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
};
Field.Postcode = Postcode;

interface DateProps<Nullable extends boolean> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  nullable?: boolean;
  className?: string;
  min?: Dayjs;
  max?: Dayjs;
  value: Nullable extends true ? Dayjs | null : Dayjs;
  showTime?: boolean;
  onChange: Nullable extends true ? (value: Dayjs | null) => void : (value: Dayjs) => void;
  datePickerClassName?: string;
}
const Date = <Nullable extends boolean>({
  className,
  labelClassName,
  nullable,
  label,
  desc,
  value,
  min,
  max,
  onChange,
  showTime,
  datePickerClassName,
}: DateProps<Nullable>) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <DatePicker
        showTime={showTime}
        disabledDate={(d) => (max && d.isAfter(dayjs(max))) ?? (min && d.isBefore(dayjs(min)))}
        value={value ? dayjs(value) : null}
        onChange={(e) => {
          e && onChange(!showTime ? e.set("hour", 0).set("minute", 0).set("second", 0) : e);
        }}
        className={datePickerClassName}
      />
    </div>
  );
};
Field.Date = Date;

interface DateRangeProps<Nullable extends boolean> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  nullable?: Nullable;
  className?: string;
  min?: Dayjs;
  max?: Dayjs;
  from: Nullable extends true ? Dayjs | null : Dayjs;
  to: Nullable extends true ? Dayjs | null : Dayjs;
  showTime?: boolean;
  onChangeFrom: Nullable extends true ? (value: Dayjs | null) => void : (value: Dayjs) => void;
  onChangeTo: Nullable extends true ? (value: Dayjs | null) => void : (value: Dayjs) => void;
  onChange?: (from: Dayjs, to: Dayjs) => void;
}
const DateRange = <Nullable extends boolean>({
  className,
  labelClassName,
  nullable,
  label,
  desc,
  from,
  to,
  min,
  max,
  onChangeFrom,
  onChangeTo,
  onChange,
  showTime,
}: DateRangeProps<Nullable>) => {
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <DatePicker.RangePicker
        showTime={showTime}
        value={[from, to] as [Dayjs | null, Dayjs | null]}
        disabledDate={(d) => (max && d.isAfter(dayjs(max))) ?? (min && d.isBefore(dayjs(min)))}
        onChange={([from, to]) => {
          if (from) onChangeFrom(from);
          if (to) onChangeTo(to);
          if (from && to) onChange?.(from, to);
        }}
      />
    </div>
  );
};
Field.DateRange = DateRange;

interface NumberProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: number | null;
  onChange: (value: number) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: number) => number;
  validate?: (text: number) => boolean | string;
  min?: number;
  max?: number;
  onPressEnter?: () => void;
  unit?: string;
}
const Number = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  min,
  max,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
  unit,
}: NumberProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} unit={unit} /> : null}
      <Input.Number
        value={value}
        nullable={nullable}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(transform(value));
        }}
        disabled={disabled}
        className={clsx("w-full", "")}
        inputClassName={clsx("focus:border-primary w-full", inputClassName)}
        validate={(value: number) => {
          if (min !== undefined && value < min) return l("shared.numberTooSmallError", { min });
          else if (max !== undefined && value > max) return l("shared.numberTooBigError", { max });
          else return validate?.(value) ?? true;
        }}
        onPressEnter={onPressEnter}
      />
    </div>
  );
};
Field.Number = Number;

interface DoubleNumberProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: [number, number] | null;
  onChange: (value: [number, number]) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: number) => number;
  validate?: (text: number) => boolean | string;
  min?: [number, number] | null;
  max?: [number, number] | null;
  onPressEnter?: () => void;
  separator?: ReactNode | string;
}
const DoubleNumber = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  min,
  max,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
  separator,
}: DoubleNumberProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className="flex items-center gap-2">
        <Input.Number
          value={value ? value[0] : 0}
          nullable={nullable}
          placeholder={placeholder}
          onChange={(num) => {
            onChange([transform(num), value ? value[1] : 0]);
          }}
          disabled={disabled}
          className={clsx("w-full", "")}
          inputClassName={clsx("focus:border-primary w-full", inputClassName)}
          validate={(value: number) => {
            if (min && value < min[0]) return l("shared.numberTooSmallError", { min: min[0] });
            else if (max && value > max[0]) return l("shared.numberTooBigError", { max: max[0] });
            else return validate?.(value) ?? true;
          }}
          onPressEnter={onPressEnter}
        />
        {separator}
        <Input.Number
          value={value ? value[1] : 0}
          nullable={nullable}
          placeholder={placeholder}
          onChange={(num) => {
            onChange([value ? value[0] : 0, transform(num)]);
          }}
          disabled={disabled}
          className={clsx("w-full", "")}
          inputClassName={clsx("focus:border-primary w-full", inputClassName)}
          validate={(value: number) => {
            if (min && value < min[1]) return l("shared.numberTooSmallError", { min: min[1] });
            else if (max && value > max[1]) return l("shared.numberTooBigError", { max: max[1] });
            else return validate?.(value) ?? true;
          }}
          onPressEnter={onPressEnter}
        />
      </div>
    </div>
  );
};
Field.DoubleNumber = DoubleNumber;

interface EmailProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
  inputStyleType?: "bordered" | "borderless" | "underline";
}
const Email = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  minlength = nullable ? 0 : 2,
  maxlength = 80,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
  inputStyleType,
}: EmailProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Input.Email
        value={value ?? ""}
        nullable={nullable}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(transform(value));
        }}
        disabled={disabled}
        className={clsx("w-full", "")}
        inputClassName={clsx("focus:border-primary w-full", inputClassName)}
        inputStyleType={inputStyleType}
        validate={(text: string) => {
          if (text.length < minlength) return l("shared.textTooShortError", { minlength });
          else if (text.length > maxlength) return l("shared.textTooLongError", { maxlength });
          else return validate?.(text) ?? true;
        }}
        onPressEnter={onPressEnter}
      />
    </div>
  );
};
Field.Email = Email;

interface PhoneProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
}
const Phone = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  placeholder,
  nullable,
  disabled,
  transform = (v) => formatPhone(v),
  validate,
  onPressEnter,
  inputClassName,
}: PhoneProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Input
        value={value ?? ""}
        nullable={nullable}
        placeholder={placeholder}
        onChange={(value) => {
          onChange(transform(value));
        }}
        disabled={disabled}
        className={clsx("w-full", "")}
        inputClassName={clsx("focus:border-primary w-full", inputClassName)}
        validate={(text: string) => {
          if (!isPhoneNumber(text)) return l("util.phoneInvalidError");
          else return validate?.(text) ?? true;
        }}
        onPressEnter={onPressEnter}
      />
    </div>
  );
};
Field.Phone = Phone;

interface PasswordProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: string | null;
  onChange: (value: string) => void;
  confirmValue?: string | null;
  onChangeConfirm?: (value: string) => void;
  inputClassName?: string;
  placeholder?: string;
  nullable?: boolean;
  disabled?: boolean;
  transform?: (value: string) => string;
  validate?: (text: string) => boolean | string;
  minlength?: number;
  maxlength?: number;
  onPressEnter?: () => void;
  showConfirm?: boolean;
}
const Password = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  confirmValue,
  onChangeConfirm,
  placeholder,
  nullable,
  disabled,
  minlength = nullable ? 0 : 2,
  maxlength = 80,
  transform = (v) => v,
  validate,
  onPressEnter,
  inputClassName,
  showConfirm,
}: PasswordProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className="flex flex-col gap-6">
        <Input.Password
          value={value ?? ""}
          nullable={nullable}
          placeholder={placeholder}
          onChange={(value) => {
            onChange(transform(value));
          }}
          disabled={disabled}
          className={clsx("w-full", "")}
          inputClassName={clsx("focus:border-primary w-full", inputClassName)}
          validate={(text: string) => {
            if (text.length < minlength) return l("shared.textTooShortError", { minlength });
            else if (text.length > maxlength) return l("shared.textTooLongError", { maxlength });
            else return validate?.(text) ?? true;
          }}
          onPressEnter={onPressEnter}
        />
        {showConfirm && (
          <Input.Password
            value={confirmValue ?? ""}
            nullable={nullable}
            placeholder={placeholder}
            onChange={(value) => onChangeConfirm?.(transform(value))}
            disabled={disabled}
            className={clsx("w-full", "")}
            inputClassName={clsx("focus:border-primary w-full", inputClassName)}
            validate={(text: string) => {
              if (value && text !== value) return l("shared.passwordNotMatchError");
              else return true;
            }}
            onPressEnter={onPressEnter}
          />
        )}
      </div>
    </div>
  );
};
Field.Password = Password;

interface ImageProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  nullable?: boolean;
  sliceName: string;
  value: cnst.File | null;
  render?: (file: cnst.File) => ReactNode;
  onChange: (file: cnst.File | null) => void;
  disabled?: boolean;
  aspectRatio?: number[];
}
const Img = ({
  label,
  desc,
  labelClassName,
  className,
  render,
  nullable,
  value,
  sliceName,
  onChange,
  disabled,
  aspectRatio,
}: ImageProps) => {
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  useInterval(async () => {
    if (value?.status !== "uploading") return;
    onChange(await fetch.file(value.id));
  }, 1000);
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Upload.Image
        type="image"
        styleType="circle"
        aspectRatio={aspectRatio}
        protoFile={value}
        onSave={async (file) => {
          const files = file instanceof FileList ? await addFiles(file) : await addFiles([file]);
          onChange(files[0]);
        }}
        onRemove={() => {
          onChange(null);
        }}
      />
    </div>
  );
};
Field.Img = Img;

interface ImagesProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  sliceName: string;
  render?: (file: cnst.File) => ReactNode;
  value: cnst.File[];
  onChange: (files: cnst.File[]) => void;
  disabled?: boolean;
  minlength?: number;
  maxlength?: number;
}

const Imgs = ({
  className,
  label,
  desc,
  labelClassName,
  render,
  value,
  onChange,
  sliceName,
  minlength = 1,
  maxlength = 30,
  disabled,
}: ImagesProps) => {
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  useInterval(async () => {
    if (!value.length) return;
    const uploadingFiles = value.filter((f) => f.status === "uploading");
    if (!uploadingFiles.length) return;
    const newFiles = await Promise.all(uploadingFiles.map(async (f) => await fetch.file(f.id)));
    onChange(value.map((f) => newFiles.find((nf) => nf.id === f.id) ?? f));
  }, 1000);
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={!!minlength} label={label} desc={desc} /> : null}
      <Upload
        multiple
        fileList={value}
        disabled={disabled}
        render={render}
        onRemove={(file: cnst.File) => {
          onChange(value.filter((f) => f.id !== file.id));
        }}
        onChange={async (file) => {
          //! Max Length 처리해야함.
          const files = file instanceof FileList ? await addFiles(file) : await addFiles([file]);
          onChange([...value, ...files]);
        }}
        accept="image/png, image/gif, image/jpeg"
      />
    </div>
  );
};
Field.Imgs = Imgs;

interface FileProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  render?: (file: cnst.File) => ReactNode;
  sliceName: string;
  nullable?: boolean;
  value: cnst.File | null;
  onChange: (file: cnst.File | null) => void;
  disabled?: boolean;
}
const File = ({
  label,
  desc,
  labelClassName,
  className,
  render,
  nullable,
  value,
  onChange,
  sliceName,
  disabled,
}: FileProps) => {
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  useInterval(async () => {
    if (value?.status !== "uploading") return;
    onChange(await fetch.file(value.id));
  }, 1000);
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Upload
        listType="text"
        render={render}
        disabled={disabled}
        fileList={value ? [value] : []}
        onRemove={() => {
          onChange(null);
        }}
        onChange={async (file) => {
          const files = file instanceof FileList ? await addFiles(file) : await addFiles([file]);
          onChange(files[0]);
        }}
      />
    </div>
  );
};
Field.File = File;

interface FilesProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  sliceName: string;
  render?: (file: cnst.File) => ReactNode;
  value: cnst.File[];
  onChange: (files: cnst.File[]) => void;
  disabled?: boolean;
  minlength?: number;
  maxlength?: number;
}

const Files = ({
  className,
  label,
  desc,
  labelClassName,
  render,
  value,
  onChange,
  sliceName,
  minlength = 1,
  maxlength = 30,
  disabled,
}: FilesProps) => {
  const names = {
    addModelFiles: `add${capitalize(sliceName)}Files`,
  };
  const addFiles = fetch[names.addModelFiles] as (
    fileList: FileList | File[],
    id?: string | undefined
  ) => Promise<cnst.File[]>;
  useInterval(async () => {
    if (!value.length) return;
    const uploadingFiles = value.filter((f) => f.status === "uploading");
    if (!uploadingFiles.length) return;
    const newFiles = await Promise.all(uploadingFiles.map(async (f) => await fetch.file(f.id)));
    onChange(value.map((f) => newFiles.find((nf) => nf.id === f.id) ?? f));
  }, 1000);
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={!!minlength} label={label} desc={desc} /> : null}
      <Upload
        multiple
        disabled={disabled}
        render={render}
        listType="text"
        fileList={value}
        onRemove={(file: cnst.File) => {
          onChange(value.filter((f) => f.id !== file.id));
        }}
        onChange={async (file) => {
          //! Max Length 처리해야함.
          const files = file instanceof FileList ? await addFiles(file) : await addFiles([file]);
          onChange([...value, ...files]);
        }}
      />
    </div>
  );
};
Field.Files = Files;

interface ParentProps<T extends string, State, Input, Full, Light, Sort extends SortType, QueryArgs extends any[]> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  selectClassName?: string;
  className?: string;
  disabled?: boolean;
  nullable?: boolean;
  initArgs?: any[];
  value: Light | null;
  onChange: (value: any) => void;
  sliceName: string;
  sortOption?: (a: Light, b: Light) => number;
  renderOption: (model: Light) => ReactNode;
}
const Parent = <
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
  QueryArgs extends any[],
>({
  label,
  desc,
  labelClassName,
  selectClassName,
  className,
  nullable,
  disabled,
  initArgs,
  sliceName,
  value,
  onChange,
  sortOption,
  renderOption,
}: ParentProps<T, State, Input, Full, Light, Sort, QueryArgs>) => {
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, ModelName] = [lowerlize(refName), capitalize(refName)];
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    initModel: `init${ModelName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();
  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Select
        className={clsx("w-full min-w-[192px]", selectClassName)}
        innerClassName="h-12"
        value={value?.id}
        allowClear
        disabled={disabled}
        onOpen={() => {
          if (!disabled) void storeDo[namesOfSlice.initModel](...((initArgs ?? []) as object[]));
        }}
        onChange={(id) => {
          onChange([...modelMap.values()].find((model) => model.id === id) ?? null);
        }}
      >
        {value && !modelMap.has(value.id) ? (
          <Select.Option key={value.id} value={value.id}>
            {renderOption(value)}
          </Select.Option>
        ) : null}
        {(sortOption ? [...modelMap.values()].sort(sortOption) : [...modelMap.values()]).map((model: Light) => (
          <Select.Option key={model.id} value={model.id}>
            {renderOption(model)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
Field.Parent = Parent;

interface ParentIdProps<T extends string, State, Input, Full, Light, Sort extends SortType, QueryArgs extends any[]> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  nullable?: boolean;
  initArgs?: any[];
  value: string | null;
  onChange: (value: string, model: any) => void;
  sliceName: string;
  sortOption?: (a: Light, b: Light) => number;
  renderOption: (model: Light) => ReactNode;
}
const ParentId = <
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
  QueryArgs extends any[],
>({
  label,
  desc,
  labelClassName,
  className,
  nullable,
  disabled,
  initArgs,
  sliceName,
  value,
  onChange,
  sortOption,
  renderOption,
}: ParentIdProps<T, State, Input, Full, Light, Sort, QueryArgs>) => {
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, ModelName] = [lowerlize(refName), capitalize(refName)];
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    initModel: `init${ModelName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();

  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Select
        className="w-full min-w-[192px]"
        innerClassName="h-12"
        value={value}
        allowClear
        disabled={disabled}
        onOpen={() => {
          if (!disabled) void storeDo[namesOfSlice.initModel](...((initArgs ?? []) as object[]));
        }}
        onChange={(id) => {
          if (id) onChange(id, modelMap.get(id));
        }}
      >
        {(sortOption ? [...modelMap.values()].sort(sortOption) : [...modelMap.values()]).map((model) => (
          <Select.Option key={model.id} value={model.id}>
            {renderOption(model)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
Field.ParentId = ParentId;

interface ChildrenProps<T extends string, State, Input, Full, Light, Sort extends SortType, QueryArgs extends any[]> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  nullable?: boolean;
  initArgs?: any[];
  value: Light[];
  onChange: (value: any[]) => void;
  sliceName: string;
  sortOption?: (a: Light, b: Light) => number;
  renderOption: (model: Light) => ReactNode;
}
const Children = <
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
  QueryArgs extends any[],
>({
  label,
  desc,
  labelClassName,
  className,
  nullable,
  disabled,
  initArgs,
  sliceName,
  value,
  onChange,
  sortOption,
  renderOption,
}: ChildrenProps<T, State, Input, Full, Light, Sort, QueryArgs>) => {
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, ModelName] = [lowerlize(refName), capitalize(refName)];
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    initModel: `init${ModelName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();

  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Select
        mode="multiple"
        className="w-full min-w-[192px]"
        value={value.map((val) => val.id)}
        allowClear
        disabled={disabled}
        onOpen={() => {
          if (!disabled) void storeDo[namesOfSlice.initModel](...((initArgs ?? []) as object[]));
        }}
        onChange={(ids) => {
          const values = ids.map((id) => {
            return modelMap.get(id) ?? value.find((val) => val.id === id);
          });
          onChange(values);
        }}
      >
        {value.map((val: Light | null) =>
          val && !modelMap.has(val.id) ? (
            <Select.Option key={val.id} value={val.id}>
              {renderOption(val)}
            </Select.Option>
          ) : null
        )}
        {(sortOption ? [...modelMap.values()].sort(sortOption) : [...modelMap.values()]).map((model) => (
          <Select.Option key={model.id} value={model.id}>
            {renderOption(model)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
Field.Children = Children;

interface ChildrenIdProps<T extends string, State, Input, Full, Light, Sort extends SortType, QueryArgs extends any[]> {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  nullable?: boolean;
  initArgs?: any[];
  value: string[];
  onChange: (value: string[]) => void;
  sliceName: string;
  sortOption?: (a: Light, b: Light) => number;
  renderOption: (model: Light) => ReactNode;
}
const ChildrenId = <
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
  QueryArgs extends any[],
>({
  label,
  desc,
  labelClassName,
  className,
  nullable,
  disabled,
  initArgs,
  sliceName,
  value,
  onChange,
  sortOption,
  renderOption,
}: ChildrenIdProps<T, State, Input, Full, Light, Sort, QueryArgs>) => {
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, ModelName] = [lowerlize(refName), capitalize(refName)];
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    initModel: `init${ModelName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();

  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <Select
        mode="multiple"
        className="w-full min-w-[192px]"
        innerClassName="h-12"
        value={value}
        allowClear
        disabled={disabled}
        onOpen={() => {
          if (!disabled) void storeDo[namesOfSlice.initModel](...((initArgs ?? []) as object[]));
        }}
        onChange={(ids) => {
          onChange(ids);
        }}
      >
        {(sortOption ? [...modelMap.values()].sort(sortOption) : [...modelMap.values()]).map((model) => (
          <Select.Option key={model.id} value={model.id}>
            {renderOption(model)}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
Field.ChildrenId = ChildrenId;

interface KoreanCityDistrictProps {
  className?: string;
  label?: string;
  desc?: string;
  labelClassName?: string;
  city: string | null;
  onChangeCity: (city?: string) => void;
  district: string | null;
  nullable?: boolean;
  onChangeDistrict: (distirct?: string) => void;
  disabled?: boolean;
}
const KoreanCityDistrict = ({
  className,
  label,
  desc,
  labelClassName,
  city,
  onChangeCity,
  district,
  nullable,
  disabled = false,
  onChangeDistrict,
}: KoreanCityDistrictProps) => {
  const locationMap = {
    서울: [
      "종로",
      "중구",
      "용산",
      "성동",
      "광진",
      "동대문",
      "중랑",
      "성북",
      "강북",
      "도봉",
      "노원",
      "은평",
      "서대문",
      "마포",
      "양천",
      "강서",
      "구로",
      "금천",
      "영등포",
      "동작",
      "관악",
      "서초",
      "강남",
      "송파",
      "강동",
    ],

    부산: [
      "중구",
      "서구",
      "동구",
      "영도",
      "부산진",
      "동래",
      "남구",
      "북구",
      "강서",
      "해운대",
      "사하",
      "금정",
      "연제",
      "수영",
      "사상",
      "기장",
    ],

    인천: ["중구", "동구", "미추홀구", "연수", "남동", "부평", "계양", "서구", "강화", "옹진"],
    대구: ["중구", "동구", "서구", "남구", "북구", "수성", "달서", "달성"],
    광주: ["동구", "서구", "남구", "북구", "광산"],
    대전: ["동구", "중구", "서구", "유성", "대덕"],
    울산: ["중구", "남구", "동구", "북구", "울주"],
    세종: ["전체 구"],

    경기: [
      "가평군",
      "고양시 덕양구",
      "고양시 일산동구",
      "고양시 일산서구",
      "과천시",
      "광명시",
      "광주시",
      "구리시",
      "군포시",
      "김포시",
      "남양주",
      "동두천",
      "부천시",
      "성남시 분당구",
      "성남시 수정구",
      "성남시 중원구",
      "수원시 권선구",
      "수원시 영통구",
      "수원시 장안구",
      "수원시 팔달구",
      "시흥시",
      "안산시 단원구",
      "안산시 상록구",
      "안성시",
      "안양시 동안구",
      "안양시 만안구",
      "양주시",
      "양평군",
      "여주시",
      "연천군",
      "오산시",
      "용인시 기흥구",
      "용인시 수지구",
      "용인시 처인구",
      "의왕시",
      "의정부시",
      "이천시",
      "파주시",
      "평택시",
      "포천시",
      "하남시",
      "화성시",
    ],

    강원: [
      "원주",
      "춘천",
      "강릉",
      "동해",
      "속초",
      "삼척",
      "홍천",
      "태백",
      "철원",
      "횡성",
      "평창",
      "영월",
      "정선",
      "인제",
      "고성",
      "양양",
      "화천",
      "양구",
    ],
    충북: ["청주", "충주", "제천", "보은", "옥천", "영동", "증평", "진천", "괴산", "음성", "단양"],
    충남: [
      "천안",
      "공주",
      "보령",
      "아산",
      "서산",
      "논산",
      "계룡",
      "당진",
      "금산",
      "부여",
      "서천",
      "청양",
      "홍성",
      "예산",
      "태안",
    ],
    경북: [
      "포항",
      "경주",
      "김천",
      "안동",
      "구미",
      "영주",
      "영천",
      "상주",
      "문경",
      "경산",
      "군위",
      "의성",
      "청송",
      "영양",
      "영덕",
      "청도",
      "고령",
      "성주",
      "칠곡",
      "예천",
      "봉화",
      "울진",
      "울릉",
    ],

    경남: [
      "창원",
      "김해",
      "진주",
      "양산",
      "거제",
      "통영",
      "사천",
      "밀양",
      "함안",
      "거창",
      "창녕",
      "고성",
      "하동",
      "합천",
      "남해",
      "함양",
      "산청",
      "의령",
    ],

    전북: [
      "전주",
      "익산",
      "군산",
      "정읍",
      "완주",
      "김제",
      "남원",
      "고창",
      "부안",
      "임실",
      "순창",
      "진안",
      "장수",
      "무주",
    ],
    전남: [
      "여수",
      "순천",
      "목포",
      "광양",
      "나주",
      "무안",
      "해남",
      "고흥",
      "화순",
      "영암",
      "영광",
      "완도",
      "담양",
      "장성",
      "보성",
      "신안",
      "장흥",
      "강진",
      "함평",
      "진도",
      "곡성",
      "구례",
    ],
    제주: ["제주", "서귀포"],
    기타: ["기타"],
  };

  return (
    <div className={clsx("flex flex-col", className)}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className="flex gap-2">
        <Select
          className="w-24"
          disabled={disabled}
          placeholder="시/도"
          value={city}
          onChange={(city) => {
            if (!city) return;
            onChangeCity(city.toString());
          }}
        >
          {Object.keys(locationMap).map((key) => (
            <Select.Option key={key} value={key}>
              {key}
            </Select.Option>
          ))}
        </Select>
        <Select
          className="w-24"
          disabled={disabled}
          placeholder="상세지역"
          value={[district]}
          onChange={(district) => {
            onChangeDistrict(district.toString() === "상세지역" ? undefined : district.toString());
          }}
        >
          {city
            ? (locationMap[city] as string[]).map((value) => (
                <Select.Option key={value} value={value}>
                  {value}
                </Select.Option>
              ))
            : null}
        </Select>
      </div>
    </div>
  );
};
Field.KoreanCityDistrict = KoreanCityDistrict;

interface DateDropdownProps {
  label?: string;
  desc?: string;
  labelClassName?: string;
  className?: string;
  value: Dayjs;
  onChange: (value?: Dayjs) => void;
  yearRange?: { start: number; end: number };
  nullable?: boolean;
  disabled?: boolean;
  dropdownClassName?: string;
  selectorClassName?: string;
  selectedClassName?: string;
}

const DateDropdown = ({
  label,
  desc,
  labelClassName,
  className,
  value,
  onChange,
  yearRange = { start: 1900, end: dayjs().year() },
  nullable,
  disabled,
  dropdownClassName,
  selectorClassName,
  selectedClassName,
}: DateDropdownProps) => {
  const [openDropdown, setOpenDropdown] = useState<"year" | "month" | "day" | null>(null);

  const yearRefs = useRef<(HTMLLIElement | null)[]>([]);
  const monthRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dayRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: yearRange.end - yearRange.start + 1 }, (_, i) => yearRange.start + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: dayjs(value).daysInMonth() }, (_, i) => i + 1);
  useEffect(() => {
    if (openDropdown === "year" && yearRefs.current[value.year() - yearRange.start]) {
      yearRefs.current[value.year() - yearRange.start]?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "instant",
      });
    }
  }, [openDropdown]);

  useEffect(() => {
    if (openDropdown === "month" && monthRefs.current[value.month() - 1]) {
      monthRefs.current[value.month()]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    }
  }, [openDropdown]);

  useEffect(() => {
    if (openDropdown === "day" && dayRefs.current[value.date() - 1]) {
      dayRefs.current[value.date() - 1]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
    }
  }, [openDropdown]);

  const handleYearChange = (year: number | null) => {
    if (year === null) {
      return;
    }
    onChange(value.set("year", year));
    setOpenDropdown(null);
  };

  const handleMonthChange = (month: number | null) => {
    if (month === null) {
      return;
    }
    onChange(value.set("month", month - 1));
    setOpenDropdown(null);
  };

  const handleDayChange = (day: number | null) => {
    if (day === null) {
      return;
    }
    onChange(value.set("date", day));
    setOpenDropdown(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={clsx("flex flex-col", className)} ref={dropdownRef}>
      {label ? <Label className={labelClassName} nullable={nullable} label={label} desc={desc} /> : null}
      <div className="flex space-x-2">
        <div className="relative">
          <button
            className={clsx(
              "input input-bordered w-full min-w-20 focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              dropdownClassName
            )}
            onClick={() => {
              !disabled && setOpenDropdown("year");
            }}
          >
            {value.year() ? value.year() : "Year"}
          </button>
          {openDropdown === "year" && (
            <ul
              className={clsx(
                "bg-base-100 absolute z-10 mt-1 max-h-36 w-full overflow-auto scroll-smooth rounded shadow-lg",
                selectorClassName
              )}
            >
              {years.map((year, index) => (
                <li
                  key={year}
                  className={clsx(
                    year === value.year() && clsx(selectedClassName, "bg-primary "),
                    "m-2 cursor-pointer rounded p-2"
                  )}
                  onClick={() => {
                    handleYearChange(year);
                  }}
                  ref={(el) => (yearRefs.current[index] = el)}
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <button
            className={clsx(
              "input input-bordered w-full focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              dropdownClassName
            )}
            onClick={() => {
              !disabled && setOpenDropdown("month");
            }}
          >
            {value.month() + 1 ? value.month() + 1 : "Month"}
          </button>
          {openDropdown === "month" && (
            <ul
              className={clsx(
                "bg-base-100 absolute z-10 mt-1 max-h-36 w-full overflow-auto scroll-smooth rounded shadow-lg",
                selectorClassName
              )}
            >
              {/* {nullable && (
                <li
                  className="cursor-pointer p-2"
                  onClick={() => {
                    handleMonthChange(null);
                  }}
                >
                  None
                </li>
              )} */}
              {months.map((month, index) => (
                <li
                  key={month}
                  className={clsx(
                    "m-2 cursor-pointer rounded p-2",
                    month === value.month() + 1 && clsx(selectedClassName, " bg-primary ")
                  )}
                  onClick={() => {
                    handleMonthChange(month);
                  }}
                  ref={(el) => (monthRefs.current[index] = el)}
                >
                  {month}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <button
            className={clsx(
              "input input-bordered w-full focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              dropdownClassName
            )}
            onClick={() => {
              !disabled && setOpenDropdown("day");
            }}
          >
            {value.date() ? value.date() : "Day"}
          </button>
          {openDropdown === "day" && (
            <ul
              className={clsx(
                "bg-base-100 absolute z-10 mt-1 max-h-36 w-full overflow-auto scroll-smooth rounded shadow-lg",
                selectorClassName
              )}
            >
              {days.map((day, index) => (
                <li
                  key={day}
                  className={clsx(
                    "m-2 cursor-pointer rounded p-2",
                    day === value.date() && clsx(selectedClassName, "bg-primary ")
                  )}
                  onClick={() => {
                    handleDayChange(day);
                  }}
                  ref={(el) => (dayRefs.current[index] = el)}
                >
                  {day}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

Field.DateDropdown = memo(DateDropdown);
