"use client";
import { AiOutlineEdit } from "react-icons/ai";
import { Loading } from "@util/ui";
import { Model } from "@shared/ui";
import { ModelsProps } from "@core/client";
import { Setting, st, usePage } from "@syrs/client";
import { cnst } from "../cnst";
import { msg } from "../dict";
import { useEffect } from "react";

export const Admin = ({ sliceName = "setting" }: ModelsProps<cnst.Setting>) => {
  const { l } = usePage();
  const setting = st.use.setting();
  const settingModal = st.use.settingModal();
  useEffect(() => {
    void st.do.getActiveSetting();
  }, []);
  if (!setting) return <Loading active />;

  return (
    <div>
      <div className="text-3xl my-2 flex items-center gap-4">
        {l("setting.modelName")}
        {settingModal ? null : (
          <button className="btn btn-sm" onClick={() => st.do.editSetting(setting.id)}>
            <AiOutlineEdit /> edit
          </button>
        )}
      </div>
      {settingModal === "edit" ? (
        <Model.EditModal
          sliceName="setting"
          type="form"
          onSubmit={() => {
            msg.success("setting.updateSuccessMsg");
          }}
          onCancel={() => {
            st.do.resetSetting(setting);
          }}
        >
          <Setting.Template.General />
        </Model.EditModal>
      ) : (
        <Setting.View.General setting={setting} />
      )}
    </div>
  );
};
