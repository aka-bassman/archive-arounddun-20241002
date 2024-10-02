import { PageCSR } from "./PageCSR";
import { baseClientEnv } from "@core/base";

interface PageProps<Return> {
  of: (props: any) => JSX.Element | null;
  loader: () => Promise<Return>;
  render: (data: Return) => JSX.Element;
  loading?: () => JSX.Element;
  noCache?: boolean;
}
const Page =
  baseClientEnv.renderMode === "csr"
    ? PageCSR
    : async <Return,>({ loader, render }: PageProps<Return>) => {
        const data = await loader();
        return render(data);
      };

export default Page;
