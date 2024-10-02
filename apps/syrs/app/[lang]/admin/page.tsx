"use client";
import { Admin, Keyring } from "@shared/client";
import { AiOutlineMonitor } from "react-icons/ai";
import { Data } from "@shared/ui";
import { ImageHosting, Prompt, User, cnst } from "@syrs/client";

export default function Page() {
  return (
    <Admin.Zone.Layout
      password
      // ssoTypes={["google"]}
      logo={<div className="text-white ">syrs</div>}
      pageMenus={[
        {
          key: "data",
          title: "Data",
          menus: [Admin.Menu.Admin, Keyring.Menu.Admin(User.View.General, User.Template.General), User.Menu.Admin],
        },
        {
          key: "prompt",
          title: "Prompt",
          menus: [
            {
              key: "prompt",
              label: "Prompt",
              icon: <AiOutlineMonitor />,
              render: () => (
                <Data.ListContainer
                  sliceName="prompt"
                  renderItem={Prompt.Unit.Card}
                  renderDashboard={Prompt.Util.Stat}
                  renderInsight={Prompt.Util.Insight}
                  renderTemplate={Prompt.Template.General}
                  renderTitle={(prompt) => `Prompt - ${prompt.id ? prompt.id : "New"}`}
                  renderView={(prompt: cnst.Prompt) => <Prompt.View.General prompt={prompt} />}
                  columns={["id", "status", "createdAt", "updatedAt"]}
                  actions={(prompt, idx) => ["remove", "edit", "view"]}
                />
              ),
            },
          ],
        },
        {
          key: "imageHosting",
          title: "imageHosting",
          menus: [
            {
              key: "imageHosting",
              label: "imageHosting",
              icon: <AiOutlineMonitor />,
              render: () => (
                <Data.ListContainer
                  sliceName="imageHosting"
                  renderItem={ImageHosting.Unit.Card}
                  renderDashboard={ImageHosting.Util.Stat}
                  renderTemplate={ImageHosting.Template.General}
                  renderTitle={(image) => `imageHosting - ${image.id ? image.id : "New"}`}
                  renderView={(image: cnst.ImageHosting) => <ImageHosting.View.General imageHosting={image} />}
                  columns={["id", "status", "createdAt", "updatedAt"]}
                  actions={(image, idx) => ["remove", "edit", "view"]}
                />
              ),
            },
          ],
        },
      ]}
    />
  );
}
