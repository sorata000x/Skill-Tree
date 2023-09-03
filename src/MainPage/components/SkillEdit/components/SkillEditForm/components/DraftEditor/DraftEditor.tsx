/* 
 * Note
 * - Might want to implement later:
 *    - Create list by '- '
 *    - Code block '```'
 *    - Embed image, files, etc.
 */

import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw, SelectionState, Modifier } from 'draft-js';
import React, { createRef, useState } from 'react';
import "./DraftEditor.css"
import { TYPE, getToken } from "./tokenizer";

export interface Props {
  value: string | undefined,
  onChange: (v: string)=>void,
}

/* 
 * Reference
 * React Rocket: Draft-js - Saving data to the server | https://reactrocket.com/post/draft-js-persisting-content/
 * StackOverflow: draftjs how to initiate an editor with content | https://stackoverflow.com/questions/35884112/draftjs-how-to-initiate-an-editor-with-content
 */

export const DraftEditor = ({value, onChange}: Props) => {
  const editor: React.LegacyRef<Editor> = createRef();
  
  // Reference: StackOverflow: How to test if a string is JSON or not? | https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
  const isJson = (str: string | undefined) => {
    if (!str) return false;
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  // Read, Empty, or String
  const [editorState, setEditorState] = 
    useState( value ? EditorState.createWithContent( 
      isJson(value) ? convertFromRaw(JSON.parse(value)) : ContentState.createFromText(value)
      ) : EditorState.createEmpty());
  
  const focusEditor = () => {
    editor.current?.focus();
  }

  const handleChange = (
    editorState: EditorState
  ) => {
    const contentState = editorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
    setEditorState(editorState)
  }

  const handleKeyCommand = (
    command: string, 
    editorState: EditorState, 
    eventTimeStamp: number
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  } 

  const typeToStyle = (type: number): string => {
    switch(type) {
      case TYPE.BOLD: return 'BOLD';
      case TYPE.ITALIC: return 'ITALIC';
      case TYPE.UNDERLINE: return 'UNDERLINE';
      case TYPE.STRIKE_TRHOUGH: return 'STRIKETHROUGH';
      case TYPE.INLINE_CODE: return 'CODE';
      default: return '';
    }
  }

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number,
  ) => {
    if(!['*', '_', '~', '`'].includes(chars)) return 'not-handled';
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const end = selection.getEndOffset();
    const block = content.getBlockForKey(selection.getAnchorKey());
    const word = block.getText();
    let {type, token, start} = getToken(word.slice(0, end) + chars);
    
    if (type === TYPE.NONE) return 'not-handled';
    
    const newSelection = new SelectionState({
      anchorKey: block.getKey(),
      anchorOffset: start,
      focusKey: block.getKey(),
      focusOffset: end,
    })
    const contentReplaced = Modifier.replaceText(
      content,
      newSelection,
      token,
      editorState.getCurrentInlineStyle().add(typeToStyle(type)),
    )
    let editorStateModified = EditorState.push(
      editorState,
      contentReplaced,
      'insert-fragment'
    )
    editorStateModified = EditorState.forceSelection(editorStateModified, new SelectionState({
      anchorKey: block.getKey(),
      anchorOffset: start+token.length,
      focusKey: block.getKey(),
      focusOffset: start+token.length,
    }));
    setEditorState(editorStateModified);
    
    return 'handled';
  } 

  return (
    <div className='draft_editor' onClick={()=>focusEditor()}>
      <Editor 
        ref={editor}
        editorState={editorState}
        spellCheck={true}
        onChange={(es)=>handleChange(es)}
        handleKeyCommand={(cm, es, ets)=>handleKeyCommand(cm, es, ets)}
        handleBeforeInput={(c, es, ets)=>handleBeforeInput(c, es, ets)}
      />
    </div>
  )
}