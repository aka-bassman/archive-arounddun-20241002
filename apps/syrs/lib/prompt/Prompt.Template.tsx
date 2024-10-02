"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@syrs/client";

interface PromptEditProps {
  promptId?: string | null;
}

export const General = ({ promptId = undefined }: PromptEditProps) => {
  const promptForm = st.use.promptForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("prompt", "apiKey")}
        desc={l.desc("prompt", "apiKey")}
        value={promptForm.apiKey}
        onChange={st.do.setApiKeyOnPrompt}
      />
      <Field.Switch
        label={l.field("prompt", "isDefault")}
        desc={l.desc("prompt", "isDefault")}
        value={promptForm.isDefault}
        onChange={st.do.setIsDefaultOnPrompt}
      />
      <Field.Text
        label={l.field("prompt", "assistantName")}
        desc={l.desc("prompt", "assistantName")}
        value={promptForm.assistantName}
        onChange={st.do.setAssistantNameOnPrompt}
      />
      <Field.Text
        label={l.field("prompt", "assistantId")}
        desc={l.desc("prompt", "assistantId")}
        value={promptForm.assistantId}
        onChange={st.do.setAssistantIdOnPrompt}
      />
    </Layout.Template>
  );
};
