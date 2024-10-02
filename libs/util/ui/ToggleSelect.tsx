import { clsx } from "@core/client";
import { usePage } from "@util/client";

interface ToggleSelectProps {
  className?: string;
  btnClassName?: string;
  items: string[] | { label: string; value: string }[];
  value: string | null;
  nullable: boolean;
  validate: (value: string) => boolean | string;
  onChange: (value: string, idx: number) => void;
  disabled?: boolean;
}
export const ToggleSelect = ({
  className,
  btnClassName,
  items,
  nullable,
  validate,
  value,
  onChange,
  disabled,
}: ToggleSelectProps) => {
  const { l } = usePage();
  const validateResult = validate(value ?? "");
  const status: "error" | "warning" | "success" =
    !nullable && !value?.length ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value?.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const options = items.map(
    (item) => (typeof item === "string" ? { label: item, value: item } : item) as { label: string; value: string }
  );
  return (
    <div className={clsx("relative flex w-full flex-wrap items-center gap-1", className)}>
      {options.map((option: { label: string; value: string }, idx: number) => {
        const isSelected = value === option.value;
        return (
          <button
            key={idx}
            disabled={disabled}
            className={clsx(
              "btn btn-sm",
              { "btn-primary": isSelected, "btn-outline": !isSelected },
              {
                "btn-error": status === "error",
                "btn-warning": status === "warning",
                "btn-success": status === "success",
              },
              btnClassName
            )}
            onClick={() => {
              onChange(option.value, idx);
            }}
          >
            {option.label}
          </button>
        );
      })}
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};

interface MultiProps {
  className?: string;
  btnClassName?: string;
  items: string[] | { label: string; value: string }[];
  value: string[];
  nullable: boolean;
  validate: (value: string[]) => boolean | string;
  onChange: (value: string[]) => void;
  disabled?: boolean;
}
const Multi = ({ className, btnClassName, items, nullable, validate, value, onChange, disabled }: MultiProps) => {
  const { l } = usePage();
  const validateResult = validate(value);
  const status: "error" | "warning" | "success" =
    !nullable && !value.length ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const options = items.map(
    (item) => (typeof item === "string" ? { label: item, value: item } : item) as { label: string; value: string }
  );
  return (
    <div className={clsx("relative flex w-full flex-wrap items-center gap-1", className)}>
      {options.map((option, idx) => {
        const isSelected = value.includes(option.value);
        return (
          <button
            key={idx}
            disabled={disabled}
            className={clsx(
              "btn btn-sm",
              {
                "btn-primary": isSelected,
                "btn-outline": !isSelected,
              },
              {
                "btn-error": status === "error",
                "btn-warning": status === "warning",
                "btn-success": status === "success",
              },
              btnClassName
            )}
            onClick={() => {
              onChange(
                isSelected
                  ? value.filter((i) => i !== option.value)
                  : [...value, option.value].sort(
                      (a, b) =>
                        options.findIndex((o) => o.value === a) -
                        items.findIndex((o) => (o as { label: string; value: string }).value === b)
                    )
              );
            }}
          >
            {option.label}
          </button>
        );
      })}
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};
ToggleSelect.Multi = Multi;
