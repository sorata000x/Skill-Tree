import { useMain, useUser } from "StateProvider";
import "./ImageEdit.css";
import React, { useState, useEffect, createRef } from "react";
import { IoMdImage } from "react-icons/io";
import { Skill } from "types";

export interface Props {
  skill: Skill;
  icon: {
    name: string;
    url: string;
    scale: number;
  };
}

/**
 * Image edit popup to edit the size of an image
 */
export const ImageEdit = ({ skill, icon }: Props) => {
  const [{}, dispatchMain] = useMain();
  const [{}, dispatchUser] = useUser();
  
  const imgRef: React.RefObject<HTMLImageElement> = createRef();
  const [imgScale, setImgScale] = useState(1);
  const [{ imgWidth, imgHeight }, setImgDimension] = useState({
    imgWidth: 0,
    imgHeight: 0,
  });

  useEffect(() => {
    // Calculate image size
    // Reference: StackOverflow | How to resize images proportionally / keeping the aspect ratio? | https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
    const [MAX_WIDTH, MAX_HEIGHT] = [300, 300];
    const [srcWidth, srcHeight] = [
      imgRef.current?.naturalWidth,
      imgRef.current?.naturalHeight,
    ];
    if (srcWidth && srcHeight) {
      const ratio = Math.max(MAX_WIDTH / srcWidth, MAX_HEIGHT / srcHeight);
      setImgDimension({
        imgWidth: srcWidth * ratio * imgScale,
        imgHeight: srcHeight * ratio * imgScale,
      });
    }
  }, [imgRef.current, imgScale]);

  const onRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgScale((parseInt(e.target.value) * 2) / 100);
  };

  const close = () => {
    dispatchMain({
      type: "CLOSE_POP_UP",
    });
  };

  const handleApply = (e: React.MouseEvent) => {
    skill.icon = {
      ...icon,
      scale: imgScale,
    };
    dispatchUser({
      type: "SET_SKILL",
      id: skill.id,
      skill: skill,
    });
    close();
  };

  return (
    <div
      className="overlay"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={(e) => close()}
    >
      <div className="image_edit" onClick={(e) => e.stopPropagation()}>
        <div className="title">EditImage</div>
        <div className="crop_container">
          <div className="back_image_container">
            <img
              alt={icon.name}
              src={icon.url}
              style={(imgWidth && imgHeight) ? { width: imgWidth, height: imgHeight } : {}}
            />
          </div>
          <div className="filter" />
          <div className="center_image_container">
            <div className="crop_circle">
              <img
                ref={imgRef}
                alt={icon.name}
                src={icon.url}
                style={(imgWidth && imgHeight) ? { width: imgWidth, height: imgHeight } : {}}
              />
            </div>
          </div>
        </div>
        <div className="slider_container">
          <IoMdImage size={30} />
          <input
            className="slider"
            type="range"
            min="1"
            max="100"
            value={imgScale * 50}
            onChange={(e) => onRangeChange(e)}
          />
          <IoMdImage size={40} />
        </div>
        <div className="action_buttons">
          <button className="skip_button">Skip</button>
          <button className="cancel_button">Cancel</button>
          <button className="apply_button" onClick={(e) => handleApply(e)}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
