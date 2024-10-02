"use client";
import { ClientEdit, ServerEdit } from "@core/base";
import { CreateOption } from "@core/client";
import { Empty } from "@util/ui";
import { Model } from "../Model";
import { deepObjectify } from "@core/common";
import { useFetch } from "@core/next";
import type { ReactNode } from "react";

interface DefaultProps {
  type?: "modal" | "form" | "empty";
  className?: string;
  modalClassName?: string;
  checkSubmit?: boolean;
  sliceName: string;
  modal?: string;
  children?: ReactNode;
  onSubmit?: string;
  onCancel?: string;
  submitOption?: CreateOption<any>;
  renderSubmit?: boolean;
}

export interface EditProps<T extends string, Full extends { id: string }> extends DefaultProps {
  edit: ClientEdit<T, Full> | Partial<Full> | Promise<Partial<Full>>;
}

interface RenderProps<T extends string, Full extends { id: string }> extends DefaultProps {
  edit: ServerEdit<T, Full> | Partial<Full> | Promise<Partial<Full>>;
}

function Render<T extends string, Full extends { id: string }>({
  className,
  checkSubmit,
  modalClassName,
  type,
  edit,
  modal,
  sliceName,
  children,
  onSubmit,
  onCancel,
  submitOption,
  renderSubmit,
}: RenderProps<T, Full>) {
  const editType: "edit" | "new" =
    (edit as ServerEdit<string, Full>).refName && edit[`${(edit as ServerEdit<string, Full>).refName}Obj`]
      ? "edit"
      : "new";
  const modelId =
    editType === "edit" ? (edit[`${(edit as ServerEdit<string, Full>).refName}Obj`] as Full).id : undefined;
  return (
    <Model.EditModal
      type={type}
      id={modelId}
      checkSubmit={checkSubmit}
      className={className}
      modalClassName={modalClassName}
      sliceName={sliceName}
      edit={editType === "edit" ? edit : deepObjectify(edit, { serializable: true })}
      modal={modal}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitOption={submitOption}
      renderSubmit={renderSubmit}
    >
      {children}
    </Model.EditModal>
  );
}

export default function Edit_Client<T extends string, Full extends { id: string }>({
  className,
  checkSubmit,
  modalClassName,
  type,
  edit,
  modal,
  sliceName,
  children,
  onSubmit,
  onCancel,
  submitOption,
  renderSubmit,
}: EditProps<T, Full>) {
  const props: EditProps<T, Full> = {
    className,
    checkSubmit,
    modalClassName,
    type,
    edit,
    modal,
    sliceName,
    children,
    onSubmit,
    onCancel,
    submitOption,
    renderSubmit,
  };
  const { fulfilled, value: promiseEdit } = useFetch(edit);
  return fulfilled ? promiseEdit ? <Render {...props} edit={promiseEdit} /> : <Empty /> : <Empty />;
}
