import "./RichTextEditor.css";
import React, { createRef, useEffect, useState } from "react";
import { TYPE, getToken } from "./tokenizer/tokenizer";
import { useStateValue } from "StateProvider";
import HTMLReactParser from 'html-react-parser';

export interface Props {
  id: string,
  width: number | string,
  height: number | string,
  value: string | undefined,
  handleChange: Function,
}

export const RichTextEditor = ({
  id,
  width,
  height,
  value, 
  handleChange,
}: Props) => {
  const [{activeSkill}, dispatch] = useStateValue();
  const [prevValue, setPrevValue] = useState(value);
  const ref: React.LegacyRef<HTMLDivElement> = createRef();
  const [test, setTest] = useState('');

  const handleValueChange = (e: React.FormEvent<HTMLDivElement>) => {
    let value = ref.current?.innerHTML;
    
    if (!activeSkill) return;

    // 
    if (prevValue && activeSkill.description.length < prevValue.length) {
      setPrevValue(activeSkill.description);
      return;
    };
    setPrevValue(activeSkill.description);
    
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    let value = ref.current?.innerHTML;
    if (!value || !activeSkill) return;
    console.log(`set value: ${value}`)
    setTest(value);
    return;
    /*
    activeSkill.description = value;
    dispatch({
      type: "SET_SKILL",
      id: activeSkill.id,
      skill: activeSkill,
    });*/
  }

  const formatText = () => {
    if(!activeSkill) return;
    let value = ref.current?.innerHTML;   // current text
    if(!value) return;
    // get inputting index
    let offset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      offset = range.startOffset;
    }
    if (offset === 0) return;
    let end = offset;
    let target = value.substring(0, end);
    let {type, token, start} = getToken(target);
    console.log(`type: ${type}, token: ${token}`)
    let format = '';
    switch(type) {
      case TYPE.BOLD:           
        format = `<b>${token}</b>`;
        break;
      case TYPE.UNDERLINE:      
        format = `<u>${token}</u>`;
        break;
      case TYPE.ITALIC:         
        format = `<i>${token}</i>`;
        break;
      case TYPE.STRIKE_TRHOUGH: 
        format = `<s>${token}</s>`;
        break;
      case TYPE.INLINE_CODE:    
        format = `<code>${token}</code>`;
        break;
    }
    // Reference: StackOverflow | How do I replace a character at a particular index in JavaScript? | https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
    const newValue = value.substring(0, start) + format + value.substring(end, value.length);
    console.log(`newValue: ${newValue}`)
    activeSkill.description = newValue;
    dispatch({
      type: "SET_SKILL",
      id: activeSkill.id,
      skill: activeSkill,
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (['*', '_', '~', '`'].includes(e.key)) {
      formatText();
    }
  }
  
  return (
    <div
      ref={ref}
      className="rich_text_editor"
      contentEditable
      onInput={e=>handleInput(e)}
      >
      { test }
    </div>
  )
}