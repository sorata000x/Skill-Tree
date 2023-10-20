import "./Contents.css";
import React from "react";
import { TreeContent, ActionContent } from "./components";
import { TreeProvider } from "StateProvider";

export interface Props {
  type?: string,
}

export const Contents = ({type}: Props) => {
  if (type === "action") return <ActionContent />
  return (
    <TreeProvider> 
      <TreeContent /> 
    </TreeProvider>
  )
}