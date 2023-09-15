import "./ToolBar.css";
import React, { createRef, useState } from "react";
import { MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdStrikethroughS, MdCode } from "react-icons/md";
import { AiOutlineLink } from "react-icons/ai";
import { CgClose } from "react-icons/cg";

export interface Props {
  top: number | string,
  right: number | string,
  open: boolean,
  close: Function,
  toggleSelection: (on: boolean)=>void,
  applyStyle: (style: string)=>void,
  applyLink: (e: React.MouseEvent, url: string)=>void,
}

/* 
 * Reference: 
 * | How to change the button text of <input type="file" />? | https://stackoverflow.com/questions/1944267/how-to-change-the-button-text-of-input-type-file
 */

/**
 * Tool bar with buttons to format text and create text link
 * - Link button
 * - Link input (show if link button clicked)
 * - Text Formatting: Bold, Italic, Underline, Strike through, Code
 */
export const ToolBar = ({
  top, 
  right, 
  open, 
  close, 
  toggleSelection, 
  applyStyle, 
  applyLink}: Props) => 
  {
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const linkInputRef: React.RefObject<HTMLInputElement> = createRef();
  const [linkValue, setLinkValue] = useState('');

  return (
    open ?
    <div
      className="tool_bar" 
      style={{top: top, right: right }}
      onClick={(e)=>e.preventDefault()}
      >
      { !linkInputOpen ? 
        <div onBlur={(e)=>close()}>
          <button 
            className="link_button" 
            style={{borderRadius: "3px 0 0 3px"}}
            onMouseDown={(e)=>e.preventDefault()}
            onClick={(e)=>{ toggleSelection(true); setLinkInputOpen(true); }}
            >
              <AiOutlineLink size={16}/>
              Link
          </button>
          <button onClick={(e)=>applyStyle('BOLD')}><MdFormatBold size={18}/></button>
          <button onClick={(e)=>applyStyle('ITALIC')}><MdFormatItalic size={18}/></button>
          <button onClick={(e)=>applyStyle('UNDERLINE')}><MdFormatUnderlined size={18}/></button>
          <button onClick={(e)=>applyStyle('STRIKETHROUGH')}><MdStrikethroughS size={18}/></button>
          <button onClick={(e)=>applyStyle('CODE')} style={{borderRadius: "0 3px 3px 0"}}><MdCode size={20}/></button>
        </div> :
        <div>
          <button
            onMouseDown={(e)=>e.preventDefault()} 
            onClick={(e)=>{setLinkValue(''); setLinkInputOpen(false); toggleSelection(false);}}><CgClose /></button>
          <input 
            className="link_input"
            ref={linkInputRef}
            type="text"
            autoFocus
            value={linkValue}
            onChange={(e)=>setLinkValue(e.target.value)}
            onMouseDown={(e)=>e.preventDefault()}
            onBlur={(e)=>{setLinkInputOpen(false); toggleSelection(false);}}
            />
          <button onMouseDown={e=>e.preventDefault()} onClick={(e)=>applyLink(e, linkValue)}><AiOutlineLink size={16}/></button>
        </div>
      }
    </div> : null
  )
}