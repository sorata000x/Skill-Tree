import "./RadialSeparators.css";
import React from "react";
import { Separator } from "./components";

export interface Props {
  count: number;
}

export const RadialSeparators = ({ count }: Props) => {
  return (
    count &&
    [...Array(count).keys()].map((i) => <Separator turns={i / count} />)
  );
};
