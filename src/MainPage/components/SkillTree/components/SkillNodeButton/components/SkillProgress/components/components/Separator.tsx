import "./Separator.css"
import React from "react"

export interface Props {
  turns: number
}

export const Separator = ({turns}: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100%",
        transform: `rotate(${turns}turn)`
      }}
    >
      <div style={{
        background: "#212121",
        width: "2.5px",
        // This needs to be equal to props.strokeWidth
        height: `${10}%`
      }} />
    </div>
  )
}