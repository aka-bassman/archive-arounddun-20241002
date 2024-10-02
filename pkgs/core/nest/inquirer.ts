import {
  checkbox as inquirerCheckbox,
  confirm as inquirerConfirm,
  editor as inquirerEditor,
  expand as inquirerExpand,
  input as inquirerInput,
  number as inquirerNumber,
  password as inquirerPassword,
  rawlist as inquirerRawlist,
  select as inquirerSelect,
} from "@inquirer/prompts";
import Chalk from "chalk";

interface ChoiceType {
  color?: string;
  name: string;
  value: string;
}

interface NumberChoiceType {
  color?: string;
  name: string;
  value: string;
}

export const input = async (message: string) => {
  return await inquirerInput({ message });
};

export const select = async (message: string, choices: ChoiceType[]) => {
  return await inquirerSelect({
    message,
    choices: choices.map((choice) => {
      return {
        name: choice.color ? Chalk.bgHex(choice.color).white(choice.name) : choice.name,
        value: choice.value,
      };
    }),
  });
};

export const confirm = async (message: string) => {
  return await inquirerConfirm({ message });
};

export const checkbox = async (message: string, choices: ChoiceType[]) => {
  return await inquirerCheckbox({
    message,
    choices: choices.map((choice) => {
      return {
        name: choice.color ? Chalk.bgHex(choice.color).white(choice.name) : choice.name,
        value: choice.value,
      };
    }),
  });
};

export const editor = async (message: string) => {
  return await inquirerEditor({ message });
};

export const number = async (message: string) => {
  return await inquirerNumber({ message });
};

export const rawlist = async (message: string, choices: NumberChoiceType[]) => {
  return await inquirerRawlist({
    message,
    choices: choices.map((choice) => {
      return {
        name: choice.color ? Chalk.bgHex(choice.color).white(choice.name) : choice.name,
        value: choice.value,
      };
    }),
  });
};

export const password = async (message: string) => {
  return await inquirerPassword({ message });
};

export const expand = async (message: string, choices: ChoiceType[]) => {
  return await inquirerExpand({
    message,
    choices: choices.map((choice) => {
      return {
        key: choice.value as "a",
        name: choice.color ? Chalk.bgHex(choice.color).white(choice.name) : choice.name,
        value: choice.value,
      };
    }),
  });
};
