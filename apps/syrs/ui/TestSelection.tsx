"use client";

export interface TestSelectionProps {
  onSelect: (value: number) => void;
  question: string;
  answers: string[];
  selected: number | null;
}

export const TestSelection = ({ onSelect, question, answers, selected }: TestSelectionProps) => {
  return (
    <div className="w-full mt-auto">
      <div className=" mx-auto w-max mb-40 text-xl text-center">{question}</div>
      <div className=" flex-reverse grid grid-cols-2 gap-4 w-full px-7">
        {answers
          .slice(0)
          .reverse()
          .map((answer, i) => (
            <div className="flex items-start w-full my-8 form-control" key={i}>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={selected === 4 - i}
                  onChange={() => {
                    onSelect(4 - i);
                  }}
                  className="checkbox checkbox-xs mt-[2px]  [--chkbg:theme(colors.syrs-selected)] [--chkfg:white] opacity-70 rounded-sm mr-2  border-syrs-selected border-sm border-2"
                />
                <span className=" -mt-1 label-text min-h-16 text-base text-syrs-font text-opacity-60">{answer}</span>
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};
