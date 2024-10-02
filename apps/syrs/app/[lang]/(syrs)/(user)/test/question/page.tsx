/* eslint-disable @nx/workspace/noImportExternalLibrary */
/* eslint-disable @nx/workspace/nonScalarPropsRestricted */
/* eslint-disable @nx/workspace/noImportClientFunctions */
"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Loading, TestSelection } from "@syrs/ui";
import { animated, easings, useSpring } from "react-spring";
import { router } from "@core/client";
import { st, usePage } from "@syrs/client";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

type Entry = [string, number | null];
type Entries = Entry[];
export default function Page() {
  const { l, lang } = usePage();
  const testForm = st.use.testForm();
  const [targetProgress, setTargetProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isNextFocused, setIsNextFocused] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorComponent, setErrorComponent] = useState<string | null>(null);
  const self = st.use.self();
  const questionProgress: {
    title: "Q1" | "Q2" | "Q3" | "Q4" | "Q5";
    type: "typeA" | "typeB" | "typeC" | "typeD" | "typeE";
    question: string;
    answers: string[];
  }[] = [
    {
      title: "Q1",
      type: "typeA",
      question: l("test.typeAQuestion"),
      answers: [l("test.typeAAnswer1"), l("test.typeAAnswer2"), l("test.typeAAnswer3"), l("test.typeAAnswer4")],
    },
    {
      title: "Q2",
      type: "typeB",
      question: l("test.typeBQuestion"),
      answers: [l("test.typeBAnswer1"), l("test.typeBAnswer2"), l("test.typeBAnswer3"), l("test.typeBAnswer4")],
    },
    {
      title: "Q3",
      type: "typeC",
      question: l("test.typeCQuestion"),
      answers: [l("test.typeCAnswer1"), l("test.typeCAnswer2"), l("test.typeCAnswer3"), l("test.typeCAnswer4")],
    },
    {
      title: "Q4",
      type: "typeD",
      question: l("test.typeDQuestion"),
      answers: [l("test.typeDAnswer1"), l("test.typeDAnswer2"), l("test.typeDAnswer3"), l("test.typeDAnswer4")],
    },
    {
      title: "Q5",
      type: "typeE",
      question: l("test.typeEQuestion"),
      answers: [l("test.typeEAnswer1"), l("test.typeEAnswer2"), l("test.typeEAnswer3"), l("test.typeEAnswer4")],
    },
  ];
  useEffect(() => {
    void st.do.setPromptDefault();
  }, []);
  const prompt = st.use.prompt();

  const customReduce = useCallback((entries: Entries = [], index = 0, acc = 0) => {
    if (!entries.length) {
      return acc;
    }
    if (index >= entries.length) {
      return acc;
    }
    const [key, value] = entries[index];
    if (!value) {
      return acc;
    }
    return customReduce(entries, index + 1, acc + 1);
  }, []);

  useEffect(() => {
    const newTargetProgress = (customReduce(Object.entries(testForm.answers) as Entries) * 100) / 5;
    setTargetProgress(newTargetProgress);
  }, [testForm.answers, customReduce]);

  const props = useSpring({ value: targetProgress, config: { duration: 1000, easing: easings.easeOutExpo } });
  return (
    <div className="w-full flex flex-col items-center">
      <Loading
        className={isAnalyzing ? "" : " hidden"}
        bottomRender={() => <div className="text-lg text-center text-syrs-loading">{l("result.analyzingBottom")}</div>}
        topRender={() => (
          <div className=" text-xl font-semibold text-syrs-font">
            {l("result.analyzingTopHead") + testForm.name + l("result.analyzingTop")}
          </div>
        )}
        setClose={() => {
          setIsAnalyzing(false);
        }}
      />
      {/* <div className=" fixed flex flex-col">
        <button
          onClick={() => {
            (document.getElementById("ErrModal") as HTMLDialogElement).showModal();
          }}
        >
          error test button :: need to remove on production
        </button>
        <button
          onClick={() => {
            setIsAnalyzing(true);
          }}
        >
          loading test button :: need to remove on production
        </button>
      </div> */}
      <dialog id="ErrModal" className="modal">
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <div className="modal-box flex flex-col items-center bg-syrs-bg min-w-[530px] px-8">
          <div className=" text-3xl w-full text-center text-syrs-font font-medium mt-12">Consultation Error</div>
          <div className="text-center py-8 text-opacity-70 text-syrs-font">{l("result.errorMsg")}</div>
          <div className="text-center text-syrs-font text-opacity-70 text-2xl">Error Message:</div>
          <div className=" px-12 text-sm">
            <br />
            {errorComponent}{" "}
            {" testError  \nasdfas dfasdfasd fasas dfasdf asdfa sdfasa sdfas df asd  fasd fasa  d fa sdf asdfa sdf a sasd f   asdf  asdfa  sd fasa sdfas  dfas  d  fasd fasa    sdfa s d  fasdf  asd fas a  sdf  asdfa sd fas d fa s asdfasd  fasd fasd fasas  dfasdfasdfa  sd f asas dfasdf  asdfa sdfa s\n" +
              ":: need to remove on production"}
          </div>
          <div
            className="btn mt-8 border-syrs-logo text-syrs-logo text-lg border-opacity-40 text-opacity-40 hover:border-none hover:bg-syrs-selected hover:text-white font-semibold px-6 py-0 rounded-md"
            onClick={() => {
              router.push("/test");
            }}
          >
            {l("test.returnToBeginning")}
          </div>
        </div>
      </dialog>
      <div className="text-syrs-selected text-opacity-70 mt-24 text-lg  px-auto">
        {currentQuestion >= 5 ? l("test.checkSubmission") : questionProgress[currentQuestion].title}
      </div>
      <div className=" w-full px-20">
        <animated.progress
          className="progress w-full bg-white progress-secondary mb-28 mt-12 "
          value={props.value}
          max="100"
        />
      </div>
      {currentQuestion < 5 && (
        <TestSelection
          question={questionProgress[currentQuestion].question}
          answers={questionProgress[currentQuestion].answers}
          selected={testForm.answers[questionProgress[currentQuestion].type]}
          onSelect={(point) => {
            setIsNextFocused(true);
            st.do.setAnswersOnTest({ ...testForm.answers, [questionProgress[currentQuestion].type]: point });
          }}
        />
      )}

      {currentQuestion < 5 && (
        <div className="flex w-full justify-center mt-auto absolute bottom-12 px-8 ">
          {currentQuestion > 0 && (
            <button
              className="btn btn-ghost text-xl border-opacity-40 border-none  text-syrs-selected text-opacity-50 font-semibold px-6 py-0 "
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1);
              }}
            >
              <span>
                <FaChevronLeft />
              </span>
              {l("test.prev")}
            </button>
          )}
          {currentQuestion < 5 && (
            <button
              className={
                isNextFocused
                  ? "btn btn-ghost border-syrs-logo text-xl border-opacity-40 border-none text-opacity-50 text-syrs-brown font-semibold px-6 py-0 ml-auto"
                  : "btn btn-ghost text-xl border-opacity-40 border-none  text-syrs-selected text-opacity-50 font-semibold px-6 py-0 ml-auto"
              }
              // "btn btn-ghost hover:border-syrs-logo text-xl border-opacity-40 border-none  text-syrs-selected text-opacity-50 hover:text-syrs-brown font-semibold px-6 py-0 ml-auto"
              onClick={() => {
                setCurrentQuestion(currentQuestion + 1);
                setIsNextFocused(false);
              }}
            >
              {l("test.next")}
              <span>
                <FaChevronRight />
              </span>
            </button>
          )}
        </div>
      )}
      {currentQuestion >= 5 && (
        <div className="w-full flex flex-col items-center px-16">
          <div className=" text-lg">{l("test.completeTest")}</div>
          <div className="mt-20 text-center text-syrs-loading text-lg">
            {l("test.submitAndCheck1")}
            {testForm.name ? testForm.name : l("test.고객")}
            {l("test.submitAndCheck2")}
            <br />
            <br />
            {l("test.flowDesc1")} {testForm.name ? testForm.name : l("test.고객")}
            {l("test.flowDesc2")}
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className=" text-base">{l("test.flowDesc3")}</div>
          </div>
          <button
            className="btn btn-ghost hover:border-syrs-logo text-xl border-opacity-40 border-none hover:bg-syrs-selected text-syrs-logo text-opacity-60 hover:text-syrs-brown font-semibold py-0 mt-auto absolute bottom-12 right-8"
            onClick={async () => {
              setIsAnalyzing(true);
              if (testForm.id) {
                await st.do.calculateResult(
                  testForm.id,
                  self.id,
                  (result) => {
                    router.push("/result/" + result.id);
                    setIsAnalyzing(false);
                  },
                  (e) => {
                    setErrorComponent(e.message);
                    (document.getElementById("ErrModal") as HTMLDialogElement).showModal();
                    setIsAnalyzing(false);
                  }
                );
                return;
              }
              await st.do.submitTest({
                onSuccess: async (testSubmission) => {
                  st.do.setTestForm(testSubmission);
                  st.do.setDateOfBirthOnTest(dayjs(testSubmission.dateOfBirth));
                  await st.do.calculateResult(
                    testSubmission.id,
                    self.id,
                    (result) => {
                      router.push("/result/" + result.id);
                      setIsAnalyzing(false);
                    },
                    (e) => {
                      setErrorComponent(e.message);
                      (document.getElementById("ErrModal") as HTMLDialogElement).showModal();
                      setIsAnalyzing(false);
                    }
                  );
                  setIsAnalyzing(false);
                },
                onError: (e) => {
                  setErrorComponent(e);
                  (document.getElementById("ErrModal") as HTMLDialogElement).showModal();
                  setIsAnalyzing(false);
                },
              });
            }}
          >
            {l("test.submit")}
            <span>
              <FaChevronRight />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
