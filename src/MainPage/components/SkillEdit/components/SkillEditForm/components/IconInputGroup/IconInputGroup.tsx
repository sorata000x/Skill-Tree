import { useStateValue } from "StateProvider";
import "./IconInputGroup.css";
import React, { createRef } from "react";
import { BiImageAdd } from "react-icons/bi"

export interface Props {
  addIcon: (v: any)=>void,
}

export const IconInputGroup = ({addIcon}: Props) => {
  const [{activeSkill}, ] = useStateValue();
  const iconInputRef: React.LegacyRef<HTMLInputElement> = createRef();

  const handleUploadButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    iconInputRef.current?.click();
  }

  return (
    <div className="icon_input_group">
      <label htmlFor="icon">Icon</label>
      <input 
        id="icon" 
        type="file" 
        accept="/images/*"
        ref={iconInputRef}
        onChange={(e)=>addIcon(e.target.files?.[0])}
        />
      { activeSkill?.icon ? 
        <img 
          className="icon_button" 
          alt={activeSkill.icon.name}
          src={activeSkill.icon.url}
          onClick={(e)=>handleUploadButtonClick(e)}
        /> :
        <button 
          className="upload_icon_button" 
          onClick={(e)=>handleUploadButtonClick(e)}
        >
          <BiImageAdd className="icon" size={30}/>
        </button>
      }
    </div>
  )
}