import { useStateValue } from "StateProvider";
import "./ImageEdit.css";
import React, {useState, useEffect, createRef} from "react";
import {IoMdImage} from "react-icons/io";

export interface Props {
  open: boolean,
  close: Function,
}

export const ImageEdit = ({open, close}: Props) => {
  const [{activeSkill, popUp}, dispatch] = useStateValue();  
  const [{imgWidth, imgHeight}, setImgDimension] = useState({imgWidth: 0, imgHeight: 0});
  const imgRef: React.RefObject<HTMLImageElement> = createRef();
  const [imgScale, setImgScale] = useState(1);

  useEffect(() => {
    // Calculate image size
    // Reference: StackOverflow | How to resize images proportionally / keeping the aspect ratio? | https://stackoverflow.com/questions/3971841/how-to-resize-images-proportionally-keeping-the-aspect-ratio
    const [MAX_WIDTH, MAX_HEIGHT] = [300, 300];
    const [srcWidth, srcHeight] = [imgRef.current?.naturalWidth, imgRef.current?.naturalHeight];
    if (srcWidth && srcHeight) {
      const ratio = Math.max(MAX_WIDTH / srcWidth, MAX_HEIGHT / srcHeight);
      setImgDimension({ imgWidth: srcWidth*ratio*imgScale, imgHeight: srcHeight*ratio*imgScale });
    }
  }, [imgScale])

  if(!open || !popUp?.icon || !activeSkill) return;

  const onRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgScale(parseInt(e.target.value)*2/100)
  }

  const handleApply = (e: React.MouseEvent) => {
    if(!popUp.icon) return;
    activeSkill.icon = {
      ...popUp.icon,
      scale: imgScale,
    };
    dispatch({
      type: "SET_SKILL",
      id: activeSkill.id,
      skill: activeSkill,
    });
    close();
  }

  return (
    <div className="image_edit">
      <div className="title">EditImage</div>
      <div className="crop_container">
        <div className="back_image_container" >
          <img 
            alt={popUp.icon.name} 
            src={popUp.icon.url}
            style={{width: imgWidth, height: imgHeight}}
            />
        </div>
        <div className="filter" />
        <div className="center_image_container">
          <div className="crop_circle">
            <img 
              ref={imgRef}
              alt={popUp.icon.name} 
              src={popUp.icon.url} 
              style={{width: imgWidth, height: imgHeight}}
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
          value={imgScale*50}
          onChange={(e)=>onRangeChange(e)}
          />
        <IoMdImage size={40} />
      </div>
      <div className="action_buttons">
        <button className="skip_button">Skip</button>
        <button className="cancel_button">Cancel</button>
        <button 
          className="apply_button"
          onClick={(e)=>handleApply(e)}
          >
          Apply
        </button>
      </div>
    </div>
  )
}