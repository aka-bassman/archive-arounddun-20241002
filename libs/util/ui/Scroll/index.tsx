import { Navigator } from "./Navigator";
import { Provider, ProviderProps } from "./Provider";
import { Render } from "./Render";
import { Slide } from "./Slide";

export const Scroll = (props: ProviderProps) => {
  return <Provider {...props} />;
};
Scroll.Navigator = Navigator;
Scroll.Render = Render;
Scroll.Slide = Slide;
