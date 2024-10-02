"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { cnst, st, usePage } from "@shared/client";

interface BannerEditProps {
  bannerId?: string | null;
}

export const General = ({ bannerId = undefined }: BannerEditProps) => {
  const bannerForm = st.use.bannerForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("banner", "category")}
        desc={l.desc("banner", "category")}
        value={bannerForm.category}
        onChange={st.do.setCategoryOnBanner}
      />
      <Field.Text
        label={l.field("banner", "title")}
        desc={l.desc("banner", "title")}
        value={bannerForm.title}
        onChange={st.do.setTitleOnBanner}
      />
      <Field.Text
        label={l.field("banner", "content")}
        desc={l.desc("banner", "content")}
        value={bannerForm.content}
        onChange={st.do.setContentOnBanner}
      />
      <Field.Img
        label={l.field("banner", "image")}
        desc={l.desc("banner", "image")}
        sliceName="banner"
        value={bannerForm.image}
        onChange={st.do.setImageOnBanner}
      />
      <Field.Text
        label={l.field("banner", "href")}
        desc={l.desc("banner", "href")}
        value={bannerForm.href}
        onChange={st.do.setHrefOnBanner}
      />
      <Field.ToggleSelect
        label={l.field("banner", "target")}
        desc={l.desc("banner", "target")}
        value={bannerForm.target}
        items={cnst.bannerTargets}
        onChange={(target) => {
          st.do.setTargetOnBanner(target);
        }}
      />
      <Field.Date
        label={l.field("banner", "from")}
        desc={l.desc("banner", "from")}
        value={bannerForm.from}
        onChange={st.do.setFromOnBanner}
        showTime
      />
      <Field.Date
        label={l.field("banner", "to")}
        desc={l.desc("banner", "to")}
        value={bannerForm.to}
        onChange={st.do.setToOnBanner}
        showTime
      />
    </Layout.Template>
  );
};
