"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { cnst, st, usePage } from "@syrs/client";

interface ImageHostingEditProps {
  imageHostingId?: string | null;
}

export const General = ({ imageHostingId = undefined }: ImageHostingEditProps) => {
  const imageHostingForm = st.use.imageHostingForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("imageHosting", "id")}
        desc={l.desc("imageHosting", "id")}
        value={imageHostingForm.id}
        onChange={st.do.setIdOnImageHosting}
      />
      <Field.Text
        label={l.field("imageHosting", "name")}
        desc={l.desc("imageHosting", "name")}
        value={imageHostingForm.name}
        onChange={st.do.setNameOnImageHosting}
      />
      <Field.Img
        label="ImageHosting"
        sliceName="imageHosting"
        value={imageHostingForm.image}
        onChange={st.do.setImageOnImageHosting}
      />
    </Layout.Template>
  );
};
