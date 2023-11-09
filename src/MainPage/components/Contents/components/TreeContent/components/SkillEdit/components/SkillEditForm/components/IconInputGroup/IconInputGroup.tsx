import { useMain } from "StateProvider";
import "./IconInputGroup.css";
import React, { createRef, useEffect, useState } from "react";
import { BiImageAdd } from "react-icons/bi";

export interface Props {
  setIcon: (v: any) => void;
}

/**
 * Icon upload label and button that shows current icon if exist
 */
export const IconInputGroup = ({ setIcon }: Props) => {
  const [{ activeSkill }] = useMain();
  const iconInputRef: React.LegacyRef<HTMLInputElement> = createRef();
  const imgRef: React.RefObject<HTMLImageElement> = createRef();
  const [{ imgWidth, imgHeight }, setImgDimension] = useState({
    imgWidth: 70,
    imgHeight: 70,
  });

  useEffect(() => {
    if (!activeSkill || !activeSkill.icon) return;
    // Calculate image size
    // Reference: StackOverflow | How to resize images proportionally / keeping the aspect ratio? | https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
    const [MAX_WIDTH, MAX_HEIGHT] = [70, 70];
    const [srcWidth, srcHeight] = [
      imgRef.current?.naturalWidth,
      imgRef.current?.naturalHeight,
    ];
    if (srcWidth && srcHeight) {
      const ratio = Math.max(MAX_WIDTH / srcWidth, MAX_HEIGHT / srcHeight);
      setImgDimension({
        imgWidth: srcWidth * ratio * activeSkill.icon.scale,
        imgHeight: srcHeight * ratio * activeSkill.icon.scale,
      });
    }
  }, [activeSkill, imgRef]);

  const handleUploadButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    iconInputRef.current?.click();
  };

  return (
    <div className="d-flex flex-column gap-1">
      <label htmlFor="icon">Icon</label>
      <input
        id="icon"
        style={{display: "none"}}
        type="file"
        accept="/images/*"
        ref={iconInputRef}
        onChange={(e) => setIcon(e.target.files?.[0])}
      />
      <button
        className="upload_icon_button"
        onClick={(e) => handleUploadButtonClick(e)}
      >
        {activeSkill?.icon ? (
          <img
            className="icon_button"
            alt={activeSkill.icon.name}
            src={activeSkill.icon.url}
            onClick={(e)=>{handleUploadButtonClick(e); e.stopPropagation()}}  // stop propagation to prevent button onclick from firing
            style={{ width: imgWidth, height: imgHeight }}
            ref={imgRef}
          />
        ) : (
          <BiImageAdd className="icon" size={30} />
        )}
      </button>
    </div>
  );
};
