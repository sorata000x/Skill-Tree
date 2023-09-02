import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import React, { createRef, useEffect, useState } from 'react';
import "./DraftEditor.css"

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
  const [editorState, setEditorState] = 
    useState( value ? EditorState.createWithContent( 
      isJson(value) ? convertFromRaw(JSON.parse(value)) : ContentState.createFromText(value)
      ) : EditorState.createEmpty());
  const focusEditor = () => {
    editor.current?.focus();
  }
  const handleChange = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
    setEditorState(editorState)
  }
  const handleKeyCommand = (command: string, editorState: EditorState, eventTimeStamp: number) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  } 

  return (
    <div className='draft_editor' onClick={()=>focusEditor()}>
      <Editor 
        ref={editor}
        editorState={editorState}
        onChange={(es)=>handleChange(es)}
        handleKeyCommand={(cm, es, ets)=>handleKeyCommand(cm, es, ets)}
      />
    </div>
  )
}