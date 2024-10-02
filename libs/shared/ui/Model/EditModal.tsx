"use client";
import { AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import { Button, Modal } from "@util/ui";
import { ClientEdit, ServerEdit } from "@core/base";
import { CreateOption, type Submit, clsx, router } from "@core/client";
import { capitalize, deepObjectify, lowerlize } from "@core/common";
import { fetch, st, usePage } from "@shared/client";
import { useDebounce } from "@core/next";
import React, { type ReactNode, type Usable, use, useCallback, useEffect, useMemo } from "react";

interface EditModelProps<Full> {
  type?: "modal" | "form" | "empty";
  sliceName: string;
  className?: string;
  checkSubmit?: boolean;
  edit?: ClientEdit<string, Full> | Partial<Full>;
  modal?: string;
  children: any;
  loadingWrapper?: boolean | ((props: { children?: any; className?: string }) => JSX.Element);
}
const EditModel = <Full,>({
  type = "modal",
  sliceName,
  className,
  checkSubmit = true,
  edit,
  modal,
  children,
  loadingWrapper,
}: EditModelProps<Full>) => {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as { [key: string]: (...args) => void };
  const [modelName, ModelName] = useMemo(
    () => [lowerlize(st.slice[sliceName as "admin"].refName), capitalize(st.slice[sliceName as "admin"].refName)],
    []
  );
  const names = useMemo(
    () => ({
      model: modelName,
      Model: ModelName,
      modelForm: `${modelName}Form`,
      modelFormLoading: `${modelName}FormLoading`,
      modelModal: `${modelName}Modal`,
      checkModelSubmitable: `check${ModelName}Submitable`,
    }),
    []
  );
  const modelModal = storeUse[names.modelModal]<string | null>();
  const modelForm = storeUse[names.modelForm]<{ id: string | null; [key: string]: any }>();

  const checkSubmitable = useDebounce(() => {
    storeDo[names.checkModelSubmitable]();
  });

  useEffect(() => {
    if (checkSubmit) checkSubmitable();
  }, [modelModal, modelForm]);

  const LoadingWrapper = useMemo(() => {
    return loadingWrapper === false
      ? ({ children, className }) => children as ReactNode
      : typeof loadingWrapper === "function"
        ? loadingWrapper
        : ({ children, className }: { children?: any; className?: string }) => {
            const modelFormLoading = storeUse[names.modelFormLoading]();
            return (
              <div className={clsx("", className)}>
                {children}
                {modelFormLoading ? <div className="bg-base-100/50 absolute inset-0 animate-pulse" /> : null}
              </div>
            );
          };
  }, []);

  // if (type === "empty") return null;
  return <LoadingWrapper className={clsx("grid w-full place-items-center", className)}>{children}</LoadingWrapper>;
};

interface EditModalProps<Full extends { id: string }> extends EditModelProps<Full> {
  id?: string;
  disabled?: boolean;
  checkSubmit?: boolean;
  modalClassName?: string;
  renderTitle?: (model: Full) => string | JSX.Element;
  submitOption?: CreateOption<Full>;
  renderSubmit?: boolean | ((any) => JSX.Element);
  onSubmit?: string | ((model: Full) => void);
  onCancel?: string | ((form?: any) => any);
}

export default function EditModal<Full extends { id: string }>({
  type = "modal",
  sliceName,
  id,
  className,
  disabled,
  checkSubmit = true,
  modalClassName,
  edit,
  modal,
  renderTitle,
  children,
  submitOption,
  renderSubmit,
  loadingWrapper,
  onSubmit,
  onCancel,
}: EditModalProps<Full>) {
  const { l } = usePage();
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeSel = st.sel as <State, Ret>(selector: (state: State) => Ret) => Ret;
  const modelEdit = ((edit as Promise<any> | { then?: any } | undefined)?.then ? use(edit as Usable<any>) : edit) as
    | ServerEdit<string, Full>
    | Full
    | undefined;

  const [modelName, ModelName] = useMemo(
    () => [lowerlize(st.slice[sliceName as "admin"].refName), capitalize(st.slice[sliceName as "admin"].refName)],
    []
  );
  const names = useMemo(
    () => ({
      model: modelName,
      modelForm: `${modelName}Form`,
      modelFormLoading: `${modelName}FormLoading`,
      modelModal: `${modelName}Modal`,
      modelSubmit: `${modelName}Submit`,
      submitModel: `submit${ModelName}`,
      resetModel: `reset${ModelName}`,
      setModelModal: `set${ModelName}Modal`,
      modelLoading: `${modelName}Loading`,
      modelViewAt: `${modelName}ViewAt`,
      newModel: `new${ModelName}`,
      crystalizeModel: `crystalize${ModelName}`,
      modelObj: `${modelName}Obj`,
    }),
    []
  );
  const modelModal = storeUse[names.modelModal]<string | null>();
  const modelFormId = storeSel<{ [key: string]: { id: string | null } }, string | null>(
    (state) => state[names.modelForm].id
  );
  const isModalOpen = modelModal === (modal ?? "edit") && ((!modelFormId && !id) || id === modelFormId);

  useEffect(() => {
    if (!modelEdit) return;
    const refName = (modelEdit as ServerEdit<string, Full>).refName;
    const editType: "edit" | "new" = refName && modelEdit[names.modelObj] ? "edit" : "new";
    const crystalizeModel = fetch[names.crystalizeModel] as (model: Full) => Full;
    if (editType === "edit") {
      const crystal = crystalizeModel(modelEdit[names.modelObj] as Full);
      st.set({
        [names.model]: crystal,
        [names.modelLoading]: false,
        [names.modelForm]: deepObjectify(crystal),
        [names.modelFormLoading]: false,
        [names.modelModal]: modal ?? "edit",
        [names.modelViewAt]: modelEdit[names.modelViewAt] as Date,
      });
    } else {
      // new
      const crystal = crystalizeModel(modelEdit as Full);
      void storeDo[names.newModel](deepObjectify(crystal), { modal, setDefault: true, sliceName });
    }
    return () => {
      // st.do[names.resetModel]();
    };
  }, [modelEdit]);

  const handleCancel = useCallback(() => {
    const modelForm = st.get()[names.modelForm] as Full;
    const form = deepObjectify({ ...modelForm });
    // await st.do[names.resetModel]();
    void storeDo[names.setModelModal](null);
    if (typeof onCancel === "function") onCancel(form);
    else if (onCancel === "back") router.back();
    else if (typeof onCancel === "string") router.replace(onCancel);
  }, []);

  const Title: () => JSX.Element = () => {
    const modelFormLoading = storeUse[names.modelFormLoading]<string | boolean>();
    const modelForm = storeUse[names.modelForm]<Full>();
    return modelFormLoading ? <></> : renderTitle ? <>{renderTitle(modelForm)}</> : <></>;
  };
  const Submit: () => JSX.Element = useMemo(
    () =>
      renderSubmit === false
        ? () => <></>
        : typeof renderSubmit === "function"
          ? () => renderSubmit(storeUse[names.modelForm]<Full>())
          : () => {
              const modelSubmit = storeUse[names.modelSubmit]<Submit>();
              const handleSubmit = useCallback(async ({ onError }: { onError?: (e: string) => void } = {}) => {
                await storeDo[names.submitModel]({
                  ...submitOption,
                  sliceName,
                  onError,
                  onSuccess: typeof onSubmit === "function" ? onSubmit : undefined,
                });
                if (onSubmit === "back") router.back();
                else if (typeof onSubmit === "string") router.replace(onSubmit);
              }, []);
              return (
                <Button
                  className="btn btn-primary w-full gap-2 rounded-2xl"
                  disabled={modelSubmit.disabled || !!disabled}
                  onClick={async (e, { onError }) => {
                    await handleSubmit({ onError });
                  }}
                  onSuccess={() => {
                    //
                  }}
                >
                  {modelFormId ? <AiOutlineSave /> : <AiOutlinePlus />}
                  {l(modelFormId ? "shared.updateModel" : "shared.createModel", {
                    model: l.field(names.model as any, "modelName"),
                  })}
                </Button>
              );
            },
    [disabled, modelFormId]
  );
  if (type === "modal")
    return (
      <Modal
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
        }}
        className={modalClassName}
        title={<Title />}
        action={<Submit />}
      >
        {isModalOpen ? (
          <EditModel
            type={type}
            sliceName={sliceName}
            className={className}
            checkSubmit={checkSubmit}
            edit={edit}
            modal={modal}
            loadingWrapper={loadingWrapper}
          >
            {children}
          </EditModel>
        ) : null}
      </Modal>
    );
  else if (isModalOpen)
    return (
      <EditModel
        type={type}
        sliceName={sliceName}
        className={className}
        checkSubmit={checkSubmit}
        edit={edit}
        modal={modal}
        loadingWrapper={loadingWrapper}
      >
        <Title />
        {children}
        {type === "form" ? (
          <div className="mt-4">
            <Submit />
          </div>
        ) : null}
      </EditModel>
    );
}
