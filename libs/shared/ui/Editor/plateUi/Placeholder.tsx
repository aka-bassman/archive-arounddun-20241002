import { Children, type ReactNode, cloneElement } from "react";
import { ELEMENT_H1 } from "@udecode/plate-heading";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { PlaceholderProps, createNodeHOC, createNodesHOC, usePlaceholderState } from "@udecode/plate-common";
import { cn } from "@udecode/cn";

export const Placeholder = (props: PlaceholderProps) => {
  const children = props.children as ReactNode;
  const { placeholder, nodeProps } = props;

  const { enabled } = usePlaceholderState(props);

  return Children.map(children, (child: JSX.Element) => {
    return cloneElement(child, {
      className: (child.props as { className?: string }).className,
      nodeProps: {
        ...nodeProps,
        className: cn(
          enabled && "before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]"
        ),
        placeholder,
      },
    });
  });
};

export const withPlaceholder = createNodeHOC(Placeholder);
export const withPlaceholdersPrimitive = createNodesHOC(Placeholder);

export const withPlaceholders = (components: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  withPlaceholdersPrimitive(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: "Type a paragraph",
      hideOnBlur: true,
      query: {
        maxLevel: 1,
      },
    },
    {
      key: ELEMENT_H1,
      placeholder: "Untitled",
      hideOnBlur: false,
    },
  ]);
