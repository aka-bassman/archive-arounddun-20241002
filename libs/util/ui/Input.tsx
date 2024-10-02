"use client";
import { clsx } from "@core/client";
import { isEmail } from "@core/common";
import { usePage } from "@util/client";
import React, {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  RefObject,
  TextareaHTMLAttributes,
  useState,
} from "react";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  inputStyleType?: "bordered" | "borderless" | "underline";
  onPressEnter?: (value: any, event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  value: string;
  nullable?: boolean;
  validate: (value: string) => boolean | string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  iconClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};
export const Input = ({
  className,
  onPressEnter,
  nullable,
  inputRef,
  value,
  onChange,
  validate,
  inputStyleType = "bordered",
  icon,
  iconClassName,
  inputClassName,
  inputWrapperClassName,
  ...rest
}: InputProps) => {
  const { l } = usePage();
  const [firstFocus, setFirstFocus] = useState(true);
  const validateResult = validate(value);
  const status: "error" | "warning" | "success" | null =
    !nullable && !value ? null : !value.length ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const statusClass =
    status === "error"
      ? "input-error"
      : !firstFocus && status === "warning"
        ? "input-warning"
        : status === "success"
          ? "input-success"
          : "";

  const inputType =
    inputStyleType === "bordered"
      ? "input-bordered"
      : inputStyleType === "borderless"
        ? "input"
        : "border-0  border-b rounded-none";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === "Enter") onPressEnter(e.currentTarget.value, e);
  };
  return (
    <div className={clsx("relative", className)}>
      {icon ? (
        <div className={clsx("absolute inset-y-0 left-4 grid place-items-center", iconClassName)}>{icon}</div>
      ) : null}
      <input
        {...rest}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value, e)}
        onFocus={(e) => {
          if (firstFocus && value) setFirstFocus(false);
          rest.onFocus?.(e);
        }}
        onKeyDown={handleKeyDown}
        className={clsx(
          `input input-bordered focus:border-primary text-base-content placeholder:text-base-content/30 outline-none duration-300 focus:outline-none ${
            icon && "pl-12"
          }`,
          inputType,
          statusClass,
          inputClassName
        )}
      />

      <div
        // data-validate={validate}
        className="text-error animate-fadeIn data-[validate=true]:animate-fadeOut absolute -bottom-5 whitespace-nowrap text-xs "
      >
        {invalidMessage}
      </div>
    </div>
  );
};

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "type" | "onChange" | "onPressEnter"
> & {
  onPressEnter?: (value: string, event: KeyboardEvent<HTMLTextAreaElement>) => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
  value: string;
  nullable?: boolean;
  onChange?: (value: string, e: ChangeEvent<HTMLTextAreaElement>) => void;
  validate: (value: string) => boolean | string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};
const TextArea = ({
  className,
  onPressEnter,
  nullable,
  inputRef,
  value,
  onChange,
  validate,
  inputClassName,
  inputWrapperClassName,
  ...rest
}: TextAreaProps) => {
  const { l } = usePage();
  const validateResult = validate(value);
  const [firstFocus, setFirstFocus] = useState(true);
  const status: "error" | "warning" | "success" =
    !nullable && !value.length ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const statusClass =
    status === "error"
      ? "textarea-error"
      : !firstFocus && status === "warning"
        ? "textarea-warning"
        : status === "success"
          ? "textarea-success"
          : "";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onPressEnter && e.key === "Enter") onPressEnter(e.currentTarget.value, e);
  };
  return (
    <div className={clsx("relative", className)}>
      <textarea
        {...rest}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value, e)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          if (firstFocus && value) setFirstFocus(false);
          rest.onFocus?.(e);
        }}
        className={clsx(
          `textarea textarea-bordered focus:border-primary text-base-content placeholder:text-base-content/30 duration-300 focus:outline-none`,
          statusClass,
          inputClassName
        )}
      />
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};
Input.TextArea = TextArea;

export type PasswordProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type" | "onChange"> & {
  onPressEnter?: (value: any, event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  value: string;
  nullable?: boolean;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  validate: (value: string) => boolean | string;
  icon?: React.ReactNode;
  iconClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};
const Password = ({
  className,
  onPressEnter,
  nullable,
  inputRef,
  value,
  onChange,
  validate,
  icon,
  iconClassName,
  inputClassName,
  inputWrapperClassName,
  ...rest
}: PasswordProps) => {
  const { l } = usePage();
  const validateResult = validate(value);
  const [firstFocus, setFirstFocus] = useState(true);
  const status: "error" | "warning" | "success" =
    !nullable && !value.length ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const statusClass =
    status === "error"
      ? "input-error"
      : !firstFocus && status === "warning"
        ? "input-warning"
        : status === "success"
          ? "input-success"
          : "";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === "Enter") onPressEnter(e.currentTarget.value, e);
  };
  return (
    <div className={clsx("relative", className)}>
      <div className={clsx("flex items-center", inputWrapperClassName)}>
        {icon ? (
          <div className={clsx("absolute inset-y-0 left-4 grid place-items-center", iconClassName)}>{icon}</div>
        ) : null}
        <input
          {...rest}
          type="password"
          ref={inputRef}
          value={value}
          onFocus={(e) => {
            if (firstFocus && value) setFirstFocus(false);
            rest.onFocus?.(e);
          }}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange?.(e.target.value, e)}
          className={clsx(
            `input input-bordered focus:border-primary text-base-content placeholder:text-base-content/30 duration-300 focus:outline-none ${
              icon && "pl-12"
            }`,
            statusClass,
            inputClassName
          )}
        />
      </div>
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};

Input.Password = Password;

export type EmailProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type" | "onChange"> & {
  inputStyleType?: "bordered" | "borderless" | "underline";
  onPressEnter?: (value: any, event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  value: string;
  nullable?: boolean;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  validate: (value: string) => boolean | string;
  icon?: React.ReactNode;
  iconClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};
const Email = ({
  inputStyleType,
  className,
  onPressEnter,
  nullable,
  inputRef,
  value,
  onChange,
  validate,
  icon,
  iconClassName,
  inputClassName,
  inputWrapperClassName,
  ...rest
}: EmailProps) => {
  const { l } = usePage();
  const isValidEmail = isEmail(value);
  const [firstFocus, setFirstFocus] = useState(true);
  const validateResult = !isValidEmail ? l("util.emailInvalidError") : validate(value);
  const status: "error" | "warning" | "success" =
    !nullable && !value.length ? "warning" : !isValidEmail ? "error" : validateResult === true ? "success" : "error";
  const invalidMessage =
    !value.length || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const statusClass =
    status === "error"
      ? "input-error"
      : !firstFocus && status === "warning"
        ? "input-warning"
        : status === "success"
          ? "input-success"
          : "";
  const inputType =
    inputStyleType === "bordered"
      ? "input-bordered"
      : inputStyleType === "borderless"
        ? "input"
        : "border-0  border-b rounded-none";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === "Enter") onPressEnter(e.currentTarget.value, e);
  };
  return (
    <div className={clsx("relative", className)}>
      <div className={clsx("flex items-center", inputWrapperClassName)}>
        {icon ? (
          <div className={clsx("absolute inset-y-0 left-4 grid place-items-center", iconClassName)}>{icon}</div>
        ) : null}
        <input
          {...rest}
          type="email"
          ref={inputRef}
          value={value}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            if (firstFocus && value) setFirstFocus(false);
            rest.onFocus?.(e);
          }}
          onChange={(e) => onChange?.(e.target.value, e)}
          className={clsx(
            `input input-bordered focus:border-primary text-base-content placeholder:text-base-content/30 duration-300 focus:outline-none ${
              icon && "pl-12"
            }`,
            inputType,
            statusClass,
            inputClassName
          )}
        />
      </div>
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};

Input.Email = Email;

export type NumberProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "type" | "onChange"> & {
  onPressEnter?: (value: any, event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: RefObject<HTMLInputElement>;
  value: number | null;
  nullable?: boolean;
  validate: (value: number | null) => boolean | string;
  onChange: (value: number, e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  iconClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
};
const Number = ({
  className,
  onPressEnter,
  nullable,
  inputRef,
  value,
  validate,
  onChange,
  icon,
  iconClassName,
  inputClassName,
  inputWrapperClassName,
  ...rest
}: NumberProps) => {
  const { l } = usePage();
  const validateResult = validate(value);
  const [firstFocus, setFirstFocus] = useState(true);
  const status: "error" | "warning" | "success" =
    !nullable && value === null ? "warning" : validateResult === true ? "success" : "error";
  const invalidMessage =
    value === null || validateResult === true
      ? null
      : validateResult === false
        ? l("util.invalidValueError")
        : validateResult;
  const statusClass =
    status === "error"
      ? "input-error"
      : !firstFocus && status === "warning"
        ? "input-warning"
        : status === "success"
          ? "input-success"
          : "";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === "Enter") onPressEnter(e.currentTarget.value, e);
  };
  return (
    <div className={clsx("relative", className)}>
      <div className={clsx("flex items-center", inputWrapperClassName)}>
        {icon ? (
          <div className={clsx("absolute inset-y-0 left-4 grid place-items-center", iconClassName)}>{icon}</div>
        ) : null}
        <input
          {...rest}
          type="number"
          ref={inputRef}
          value={value ?? undefined}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            if (firstFocus && value) setFirstFocus(false);
            rest.onFocus?.(e);
          }}
          onChange={(e) => {
            onChange(e.target.valueAsNumber, e);
          }}
          className={clsx(
            `input input-bordered focus:border-primary text-base-content placeholder:text-base-content/30 duration-300 focus:outline-none ${
              icon && "pl-12"
            }`,
            statusClass,
            inputClassName
          )}
        />
      </div>
      {invalidMessage ? (
        <div className="text-error animate-fadeIn absolute -bottom-4 text-xs">{invalidMessage}</div>
      ) : null}
    </div>
  );
};

Input.Number = Number;

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = ({ checked, onChange, className, ...rest }: CheckboxProps) => {
  return (
    <input
      {...rest}
      type="checkbox"
      checked={checked}
      className={clsx("checkbox", className)}
      onChange={(e) => {
        onChange(e.target.checked, e);
      }}
    />
  );
};
Input.Checkbox = Checkbox;
