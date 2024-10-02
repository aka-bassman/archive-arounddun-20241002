/* eslint-disable @nx/workspace/useClientByFile */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";
import { AiFillCloseCircle, AiOutlineCheck, AiOutlineClose, AiOutlineDown, AiOutlineLoading } from "react-icons/ai";
import { Children, type MouseEvent, createContext, useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { clsx } from "@core/client";

interface SelectContextType {
  handleOptionClick: (value: any) => void;
  isOpen: boolean;
  selectedValues: any[];
  isMultiple: boolean;
}

const SelectContext = createContext<SelectContextType>({
  handleOptionClick: (value: any) => {
    //
  },
  isOpen: false,
  selectedValues: [""],
  isMultiple: false,
});

interface SelectProps<T> {
  children: React.ReactNode;
  value?: T;
  onChange?: (value: T) => void;
  mode?: "multiple" | "single";
  style?: React.CSSProperties;
  allowClear?: boolean;
  className?: string;
  innerClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
  onClear?: () => void;
  onOpen?: () => void;
  defaultValue?: T;
  clearTrigger?: any;
}

export const Select = <T,>({
  children,
  value,
  onChange,
  mode,
  allowClear,
  className = "",
  innerClassName = "",
  disabled,
  placeholder,
  loading,
  onClear,
  onOpen,
  defaultValue,
  style = {},
  clearTrigger,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<T[]>(Array.isArray(value) ? [...value] : [value]);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) setSelectedValues(Array.isArray(value) ? [...value] : [value]);
  }, [value]);

  //* defulatValue가 있을 경우 초기화
  useEffect(() => {
    if (defaultValue) setSelectedValues(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  }, [defaultValue]);

  //* 옵션 열림/닫힘 애니메이션
  const optionsProps = useSpring({
    opacity: isOpen ? 1 : 0,
    scaleY: isOpen ? 1 : 0,
    from: { opacity: 0, scaleY: 0 },
    config: { mass: 1, tension: 500, friction: 50, duration: 140 },
  });

  //* 배경 클릭시 옵션 닫힘
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, []);

  useEffect(() => {
    if (isOpen) onOpen?.();
  }, [isOpen]);

  const handleClearClick = (e?: React.MouseEvent) => {
    e && e.stopPropagation();
    setSelectedValues([]);
    onChange?.([] as unknown as T);
    onClear?.();
  };

  //* clearTrigger가 변경될 때마다 handleClearClick 함수를 실행
  useEffect(() => {
    if (!clearTrigger) return;
    handleClearClick();
  }, [clearTrigger]);

  //* 옵션 클릭
  const handleOptionClick = (checkedValue: T) => {
    if (mode === "multiple") {
      let newSelectedValues: T[] = [];
      if (selectedValues.includes(checkedValue)) {
        newSelectedValues = selectedValues.filter((cur) => cur !== checkedValue);
      } else {
        newSelectedValues = [...selectedValues, checkedValue];
      }
      onChange?.(newSelectedValues as unknown as T);
      setSelectedValues(newSelectedValues);
    } else {
      onChange?.(checkedValue);
      setSelectedValues([checkedValue]);
      setIsOpen(false);
    }
  };

  //* value 값으로 label 찾기
  const findLabelByValue = (children, value) => {
    let result;
    Children.forEach(children, (child) => {
      if (child?.props?.value === value) {
        result = child?.props?.children;
      }
    });
    return result;
  };

  const disabledClassName = disabled ? "bg-base-200 cursor-not-allowed text-base-content/40" : "";
  const isOpenClassName = isOpen ? "ring-2 ring-primary/20 border-primary" : "";
  return (
    <SelectContext.Provider value={{ handleOptionClick, isOpen, selectedValues, isMultiple: mode === "multiple" }}>
      <div className={clsx("relative inline-block min-w-[100px]", className)} ref={selectRef} style={style}>
        <div
          className={clsx(
            `bg-base-100 border-base-content/30 duration-400 flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border px-2 py-1 transition-all focus:outline-none`,
            isOpenClassName,
            disabledClassName,
            innerClassName
          )}
          onClick={() => {
            if (disabled) return;
            setIsOpen(!isOpen);
          }}
        >
          {!selectedValues.length ||
            (selectedValues[0] === "" && placeholder && (
              <div className="text-base-content/30 whitespace-nowrap">{placeholder}</div>
            ))}
          {mode === "multiple" ? (
            <>
              <div className={`duration-400 min-h-[18px]  min-w-[10px] transition-all ${isOpen && "opacity-40"}`}>
                <div className="flex flex-wrap gap-1 ">
                  {selectedValues
                    .filter((value) => value !== "")
                    .map((value, idx) => (
                      <div key={idx} className="bg-base-100/20 inline-block rounded-md border px-1">
                        <div className="flex items-center gap-1">
                          {findLabelByValue(children, value)}
                          <AiOutlineClose
                            className="text-base-content/40 hover:text-base-content/60 duration-400 text-sm transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOptionClick(value);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {allowClear && !!selectedValues.length && (
                <AiFillCloseCircle className="text-base-content/30" onClick={handleClearClick} />
              )}
            </>
          ) : (
            <div
              className={`duration-400  flex min-h-[18px] w-full min-w-[10px] items-center justify-between overflow-hidden transition-all ${
                isOpen && "opacity-40"
              }`}
            >
              <div>{findLabelByValue(children, selectedValues[0])}</div>
              {loading ? (
                <AiOutlineLoading className="animate-spin opacity-40" />
              ) : allowClear && selectedValues[0] !== "" ? (
                <AiFillCloseCircle className="text-base-content/30" onClick={handleClearClick} />
              ) : (
                <AiOutlineDown className="opacity-40" />
              )}
            </div>
          )}
        </div>
        {/* isOpen이 true일 때만 옵션 렌더링 */}
        <animated.div
          className="scrollbar-thin  scrollbar-thumb-primary/40 scrollbar-track-primary/10 bg-base-100 absolute z-50 max-h-[240px] w-full origin-top overflow-y-auto rounded-md p-1 shadow-lg"
          style={{ transformOrigin: "top", ...optionsProps }}
        >
          {children}
        </animated.div>
      </div>
    </SelectContext.Provider>
  );
};

interface OptionProps {
  className?: string;
  value: string | number | undefined | null;
  children: React.ReactNode;
}

const Option = ({ className, value, children }: OptionProps) => {
  const { handleOptionClick, selectedValues, isMultiple } = useContext(SelectContext);
  return (
    <div
      className={clsx(
        `hover:bg-base-content/10 duration-400 mb-1 flex cursor-pointer justify-between truncate rounded-md px-2 py-1 transition-all ${
          selectedValues.some((cur) => cur === value) ? "bg-primary/20 hover:bg-primary/20 font-bold" : ""
        }`,
        className
      )}
      onClick={() => {
        handleOptionClick(value);
      }}
    >
      {children}
      {isMultiple && selectedValues.some((cur) => cur === value) && <AiOutlineCheck className="text-primary" />}
    </div>
  );
};

Select.Option = Option;
