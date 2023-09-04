/* 
 * Note
 * - Might want to implement later:
 *    - Create list by '- '
 *    - Code block '```'
 *    - Embed image, files, etc.
 */

import { Editor, EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw, SelectionState, Modifier, ContentBlock, genKey } from 'draft-js';
import { List } from 'immutable';
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
 * StackOverflow: handleBeforeInput example | https://stackoverflow.com/questions/38241444/draft-js-replace-text-using-handlebeforeinput-doesnt-change-the-editorstate
 */

export const DraftEditor = ({value, onChange}: Props) => {
  const editor: React.LegacyRef<Editor> = createRef();
  const isJson = (str: string | undefined) => {
    // Reference: StackOverflow: How to test if a string is JSON or not? | https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
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

  const handleChange = (
    editorState: EditorState
  ) => {
    // Save data to storage
    const contentState = editorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
    // Update editor state
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

  // Convert tokenizer type to style string
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
    // Markdown text formatting with tokenizer
    if(!['*', '_', '~', '`'].includes(chars)) return 'not-handled';
    // 1. Gets current block and cursor position
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const end = selection.getEndOffset();
    const block = content.getBlockForKey(selection.getAnchorKey());
    const word = block.getText();
    // 2. Tokenize inputted string
    let {type, token, start} = getToken(word.slice(0, end) + chars);
    if (type === TYPE.NONE) return 'not-handled';
    // 3. Replace with formatted text
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
    // 4. Put cursor to original position
    //    Reference: How to stop DraftJS cursor jumping to beginning of text? | https://stackoverflow.com/questions/43868815/how-to-stop-draftjs-cursor-jumping-to-beginning-of-text
    editorStateModified = EditorState.forceSelection(editorStateModified, new SelectionState({
      anchorKey: block.getKey(),
      anchorOffset: start+token.length,
      focusKey: block.getKey(),
      focusOffset: start+token.length,
    }));
    // 5. Update editor state
    setEditorState(editorStateModified);
    return 'handled';
  } 

  const handleNewBlockListenerClick = () => {
    // Create new block if last block is not empty (reference to Notion note)
    // 1. Check if last block is empty
    const contentState = editorState.getCurrentContent();
    const lastBlock = contentState.getLastBlock();
    if (lastBlock.getText().length === 0) return;
    // 2. Create an empty block
    const newBlock = new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List(),
    })
    // 3. Add the empty block to the end
    const newBlockMap = contentState.getBlockMap().set(newBlock.getKey(), newBlock);
    const newContentState = ContentState.createFromBlockArray(newBlockMap.toArray());
    let newEditorState = EditorState.push(editorState, newContentState, 'split-block');
    // 4. Place cursor to the start of the new block
    newEditorState = EditorState.forceSelection(newEditorState, new SelectionState({
      anchorKey: newBlock.getKey(),
      anchorOffset: 0,
      focusKey: newBlock.getKey(),
      focusOffset: 0,
    }));
    // 5. Update editor state
    setEditorState(newEditorState)
  }

  return (
    <div className='draft_editor' >
      <Editor 
        ref={editor}
        editorState={editorState}
        spellCheck={true}
        onChange={(es)=>handleChange(es)}
        handleKeyCommand={(cm, es, ets)=>handleKeyCommand(cm, es, ets)}
        handleBeforeInput={(c, es, ets)=>handleBeforeInput(c, es, ets)}
      />
      <div 
        className='newblock_listener' 
        onClick={(e)=>handleNewBlockListenerClick()} />
    </div>
  )
}