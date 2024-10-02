"use client";
import { Modal } from "@util/ui";
import { capitalize } from "@core/common";
import { st } from "@shared/client";
import View from "./View";

interface ViewModalProps {
  id: string;
  modal?: string;
  modalClassName?: string;
  viewClassName?: string;
  sliceName: string;
  renderTitle?: (model: any) => JSX.Element | string;
  renderAction?: (model: any) => JSX.Element;
  renderView: (model: any) => JSX.Element | null;
}
export default function ViewModal({
  id,
  modal,
  modalClassName,
  viewClassName,
  sliceName,
  renderTitle,
  renderAction,
  renderView,
}: ViewModalProps) {
  const storeUse = st.use as unknown as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => void };
  if (st.slice[sliceName as "admin"].refName !== sliceName)
    throw new Error(`sliceName ${sliceName} is not equal to refName.`);
  const [modelName, ModelName] = [sliceName, capitalize(sliceName)];
  const names = {
    model: modelName,
    Model: ModelName,
    viewModel: `view${ModelName}`,
    modelLoading: `${modelName}Loading`,
    modelModal: `${modelName}Modal`,
    resetModel: `reset${ModelName}`,
  };
  const model = storeUse[names.model]<{ id: string; [key: string]: any } | null>();
  const modelModal = storeUse[names.modelModal]<string | null>();
  const modelLoading = storeUse[names.modelLoading]<string | boolean>();
  const isModalOpen = modelModal === (modal ?? "view") && (modelLoading === id || model?.id === id);
  const Title = () => {
    if (!model || modelLoading || !renderTitle) return <></>;
    const render = renderTitle(model);
    if (typeof render === "string")
      return <h2 className="flex items-center justify-center text-2xl sm:justify-start">{render}</h2>;
    else return render;
  };
  const Action = () => {
    if (!model || modelLoading || !renderAction) return <></>;
    const render = renderAction(model);
    return render;
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        storeDo[names.resetModel]();
      }}
      className={modalClassName}
      title={<Title />}
      action={<Action />}
    >
      <View className={viewClassName} model={model} modelLoading={modelLoading} render={renderView} />
    </Modal>
  );
}
