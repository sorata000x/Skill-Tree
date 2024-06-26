import "./NodeIcon.css";
import React, { createRef, useEffect, useState } from "react";

export interface Props {
  open: boolean;
  src: string | undefined;
  scale: number | undefined;
}

/**
 * Skill's icon
 */
export const NodeIcon = ({
  open,
  src,
  scale = 1,
}: Props) => {
  const ref: React.RefObject<HTMLImageElement> = createRef();
  const [MAX_WIDTH, MAX_HEIGHT] = [96, 96];
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Maintain original img size and scale to custom size
    const [srcWidth, srcHeight] = [
      ref.current?.naturalWidth,
      ref.current?.naturalHeight,
    ];
    if (srcWidth && srcHeight) {
      const ratio = Math.max(MAX_WIDTH / srcWidth, MAX_HEIGHT / srcHeight);
      setSize({
        width: srcWidth * ratio * scale,
        height: srcHeight * ratio * scale,
      });
    }
  }, [scale, ref.current]);

  return open ? (
    <div className="node_icon">
      <img
        ref={ref}
        alt="skill icon"
        src={src}
        style={{ width: size.width, height: size.height }}
      />
    </div>
  ) : null;
};
