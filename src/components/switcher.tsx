import { useState } from "react";

interface Props {
  addClass?: string;
  contents: string[];
  onChange: Function;
  data?: any[];
}

export const Switcher = (props: Props) => {
  const [activeItem, setActiveItem] = useState(props.contents[0]);
  return (
    <>
      <ul className={`c-switcher  ${props.addClass || ""}`}>
        {props.contents.map((item, index) => (
          <li
            key={index}
            className={`c-switcher__item ${
              item == activeItem ? "-active" : ""
            }`}
            onClick={() => (
              setActiveItem(item), props.onChange(props.data![index])
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
};
