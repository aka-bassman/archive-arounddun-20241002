"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { clsx } from "@core/client";
import { st, usePage } from "@syrs/client";

interface UserEditProps {
  className?: string;
  userId?: string | null;
}

export const General = ({ className, userId = undefined }: UserEditProps) => {
  const userForm = st.use.userForm();
  const { l } = usePage();
  return (
    <Layout.Template className={clsx(`flex flex-col gap-4`, className)}>
      <div className="w-[150px] flex mt-10 md:mt-0">
        <Field.Img
          label={l.field("user", "image")}
          desc={l.desc("user", "image")}
          sliceName="user"
          value={userForm.image}
          onChange={st.do.setImageOnUser}
        />
      </div>
      <Field.Text
        label={l.field("user", "nickname")}
        desc={l.desc("user", "nickname")}
        value={userForm.nickname}
        onChange={st.do.setNicknameOnUser}
      />
    </Layout.Template>
  );
};
