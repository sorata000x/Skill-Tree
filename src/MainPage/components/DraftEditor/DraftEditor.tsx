/*  Note
 * - To Do
 *    - Tab indent to match list
 *    - `--` to dash line
 *    - Code block '```'
 *    - Embed image, files, etc.
 * - Bug
 *    - SELECT style persist if reload when inputting link
 *       - Might somehow not saving SELECT style to storage
 */

import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  SelectionState,
  Modifier,
  ContentBlock,
  genKey,
  getDefaultKeyBinding,
  CompositeDecorator,
} from "draft-js";
import { List } from "immutable";
import React, { createRef, useEffect, useState } from "react";
import "./DraftEditor.css";
import { TYPE, getToken } from "./tokenizer";
import { ToolBar } from "./components";

export interface Props {
  value: string | undefined;
  style?: Object;
  readOnly?: boolean;
  onChange?: (v: string) => void;
}

/*
 * Reference
 * | CodeSandbox: Draft-js example | https://codesandbox.io/s/draftjs-ytf7q?file=/src/components/Editor/DraftEditor.js
 * | React Rocket: Draft-js - Saving data to the server | https://reactrocket.com/post/draft-js-persisting-content/
 * | StackOverflow: draftjs how to initiate an editor with content | https://stackoverflow.com/questions/35884112/draftjs-how-to-initiate-an-editor-with-content
 * | StackOverflow: handleBeforeInput example | https://stackoverflow.com/questions/38241444/draft-js-replace-text-using-handlebeforeinput-doesnt-change-the-editorstate
 * | DEV: Draft.js introduction: Custom styles (highlighted text!) and have formatting buttons show whether they are “on” or “off” | https://dev.to/
 * | CodeSandbox: Draft-js link example | https://codesandbox.io/s/draftjs-link-example-nz8fj?file=/src/index.js
 */

/**
 * Rich text editor utilizing draft-js library
 * - Editor
 * - ToolBar
 */
export const DraftEditor = ({ value, style, readOnly, onChange }: Props) => {
  const ref: React.RefObject<HTMLDivElement> = createRef();
  const editorRef: React.RefObject<Editor> = createRef();
  const [openToolBar, setToolBarOpen]: [boolean, Function] = useState(false);

  // decorator strategy for text link
  const findLinkEntities = (
    block: ContentBlock,
    callback: (start: number, end: number) => any,
    contentState: ContentState
  ) => {
    block.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  };

  // decorator component for text link
  const Link = (props: any) => {
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    // Reference: GitHub | Clickable link | https://github.com/facebookarchive/draft-js/issues/768#issuecomment-719953954
    return (
      <a href={url} onClick={(e) => window.open(url, "_blank")}>
        {props.children}
      </a>
    );
  };

  const decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  // Check if a string can be convert into JSON object
  const isJson = (str: string | undefined) => {
    // Reference: StackOverflow: How to test if a string is JSON or not? | https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
    if (!str) return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  // Read data as raw value, convert from text if not JSON string, create empty if no value
  const [editorState, setEditorState] = useState(EditorState.createEmpty(decorator));

  useEffect(() => {
    setEditorState(
      value
      ? EditorState.createWithContent(
          isJson(value)
            ? convertFromRaw(JSON.parse(value))
            : ContentState.createFromText(value),
          decorator
        )
      : EditorState.createEmpty(decorator)
    )
  }, [value])

  const styleMap = {
    // Set selecting text background color to sustain selection when inputting link
    // because selection is removed when focusing on input component
    SELECT: {
      backgroundColor: "#355269",
    },
  };

  const keyBindingFn = (e: React.KeyboardEvent<{}>) => {
    if (e.key === "Enter" && e.shiftKey) return "insert-soft-newline";
    return getDefaultKeyBinding(e);
  };

  const handleChange = (editorState: EditorState) => {
    // Open tool bar if text selected
    const selection = editorState.getSelection();
    setToolBarOpen(!selection.isCollapsed());
    if (!onChange) return;
    // Save content to storage every time editor state changed
    const contentState = editorState.getCurrentContent();
    onChange(JSON.stringify(convertToRaw(contentState)));
    // Update editor state
    setEditorState(editorState);
  };

  // Convert tokenizer type to style string
  const typeToStyle = (type: number): string => {
    switch (type) {
      case TYPE.BOLD:
        return "BOLD";
      case TYPE.ITALIC:
        return "ITALIC";
      case TYPE.UNDERLINE:
        return "UNDERLINE";
      case TYPE.STRIKE_TRHOUGH:
        return "STRIKETHROUGH";
      case TYPE.INLINE_CODE:
        return "CODE";
      default:
        return "";
    }
  };

  const handleBeforeInput = (
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number
  ) => {
    // Markdown text formatting with tokenizer
    if (["*", "_", "~", "`"].includes(chars)) {
      // 1. Gets current block and cursor position
      const content = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const end = selection.getEndOffset();
      const block = content.getBlockForKey(selection.getAnchorKey());
      const word = block.getText();
      // 2. Tokenize inputted string
      let { type, token, start } = getToken(word.slice(0, end) + chars);
      if (type === TYPE.NONE) return "not-handled";
      // 3. Replace with formatted text
      const newSelection = new SelectionState({
        anchorKey: block.getKey(),
        anchorOffset: start,
        focusKey: block.getKey(),
        focusOffset: end,
      });
      const contentReplaced = Modifier.replaceText(
        content,
        newSelection,
        token,
        editorState.getCurrentInlineStyle().add(typeToStyle(type))
      );
      let editorStateModified = EditorState.push(
        editorState,
        contentReplaced,
        "insert-fragment"
      );
      // 4. Put cursor to original position
      //    Reference: How to stop DraftJS cursor jumping to beginning of text? | https://stackoverflow.com/questions/43868815/how-to-stop-draftjs-cursor-jumping-to-beginning-of-text
      editorStateModified = EditorState.forceSelection(
        editorStateModified,
        new SelectionState({
          anchorKey: block.getKey(),
          anchorOffset: start + token.length,
          focusKey: block.getKey(),
          focusOffset: start + token.length,
        })
      );
      // 5. Update editor state
      setEditorState(editorStateModified);
      return "handled";
    }
    // Creating list
    if ([" "].includes(chars)) {
      // 1. Get current block and word
      const content = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const block = content.getBlockForKey(selection.getAnchorKey());
      const word = block.getText();
      // 2. Set list style
      let style = "unstyled";
      switch (word) {
        case "-":
          style = "unordered-list-item";
          break;
        case "1.":
          style = "ordered-list-item";
          break;
      }
      if (style === "unstyled") return "not-handled";
      // 3. Remove existing characters
      const contentReplaced = Modifier.removeRange(
        content,
        new SelectionState({
          anchorKey: block.getKey(),
          anchorOffset: 0,
          focusKey: block.getKey(),
          focusOffset: block.getText().length,
        }),
        "backward"
      );
      let editorStateModified = EditorState.push(
        editorState,
        contentReplaced,
        "remove-range"
      );
      // 4. Move cursor to the end
      editorStateModified = EditorState.forceSelection(
        editorStateModified,
        new SelectionState({
          anchorKey: block.getKey(),
          anchorOffset: block.getText().length,
          focusKey: block.getKey(),
          focusOffset: block.getText().length,
        })
      );
      // 5. Update editor state
      setEditorState(RichUtils.toggleBlockType(editorStateModified, style));
      return "handled";
    }
    return "not-handled";
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState,
    eventTimeStamp: number
  ) => {
    let newEditorState: EditorState | null | undefined = editorState;
    if (command === "insert-soft-newline") {
      newEditorState = RichUtils.insertSoftNewline(newEditorState);
    } else {
      // See the list of key commands handle by RichUtils | https://github.com/facebookarchive/draft-js/blob/main/src/model/modifier/RichTextEditorUtil.js#L81
      newEditorState = RichUtils.handleKeyCommand(newEditorState, command);
      if (!newEditorState) return "not-handled";
    }
    setEditorState(newEditorState);
    return "handled";
  };

  // Get selected text position for tool bar position
  const getSelectionPos = () => {
    const selection = window.getSelection();
    if (
      !selection?.rangeCount ||
      selection.anchorOffset === selection.focusOffset
    )
      return;
    // Get rect of selected text
    // Reference: Get bounding rectangle of selected text javascript | https://stackoverflow.com/questions/49887563/get-bounding-rectangle-of-selected-text-javascript
    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    return {
      top: rect?.top - 35,
      right: window.innerWidth - rect?.left - 150,
    };
  };

  // Store selection when focusing on other component (link input)
  const [selection, setSelection]: [SelectionState | null, Function] =
    useState(null);

  const toggleSelection = (on: boolean) => {
    let newEditorState = editorState;
    if (on) {
      // remember current selection and SELECT those text
      if (!newEditorState.getCurrentInlineStyle().has("SELECT"))
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, "SELECT");
      setSelection(newEditorState.getSelection());
    } else {
      // select remembered selection and reset selection
      const newSelection = newEditorState.getSelection();
      if (selection)
        newEditorState = EditorState.forceSelection(newEditorState, selection);
      if (newEditorState.getCurrentInlineStyle().has("SELECT"))
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, "SELECT");
      newEditorState = EditorState.forceSelection(newEditorState, newSelection);
      setSelection(null);
    }
    setEditorState(newEditorState);
  };

  const applyStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const applyLink = (e: React.MouseEvent, url: string) => {
    if (!selection) return;
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    // Apply entity
    let nextEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    // Apply selection
    nextEditorState = RichUtils.toggleLink(
      nextEditorState,
      selection,
      entityKey
    );
    setEditorState(nextEditorState);
  };

  const handleNewBlockListenerClick = () => {
    // Create new block if last block is not empty (reference to Notion note)
    // Reference
    // | (Alternative) StackOverflow | Draft js add new block on return key | https://stackoverflow.com/questions/58989732/draft-js-add-new-block-on-return-key
    // 1. Check if last block is empty
    const contentState = editorState.getCurrentContent();
    const lastBlock = contentState.getLastBlock();
    if (lastBlock.getText().length === 0) return;
    // 2. Create an empty block
    const newBlock = new ContentBlock({
      key: genKey(),
      type: "unstyled",
      text: "",
      characterList: List(),
    });
    // 3. Add the empty block to the end
    const newBlockMap = contentState
      .getBlockMap()
      .set(newBlock.getKey(), newBlock);
    const newContentState = ContentState.createFromBlockArray(
      newBlockMap.toArray()
    );
    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      "split-block"
    );
    // 4. Place cursor to the start of the new block
    newEditorState = EditorState.forceSelection(
      newEditorState,
      new SelectionState({
        anchorKey: newBlock.getKey(),
        anchorOffset: 0,
        focusKey: newBlock.getKey(),
        focusOffset: 0,
      })
    );
    // 5. Update editor state
    setEditorState(newEditorState);
  };

  return (
    <div className="draft_editor" ref={ref} style={style}>
      <Editor
        ref={editorRef}
        editorState={editorState}
        customStyleMap={styleMap}
        keyBindingFn={keyBindingFn}
        spellCheck={true}
        readOnly={readOnly}
        onFocus={(e) => e.preventDefault()}
        onChange={(es) => handleChange(es)}
        handleBeforeInput={(c, es, ets) => handleBeforeInput(c, es, ets)}
        handleKeyCommand={(cm, es, ets) => handleKeyCommand(cm, es, ets)}
      />
      <ToolBar
        top={`${getSelectionPos()?.top}px`}
        right={`${getSelectionPos()?.right}px`}
        open={openToolBar}
        close={() => setToolBarOpen(false)}
        toggleSelection={toggleSelection}
        applyStyle={(style) => applyStyle(style)}
        applyLink={applyLink}
      />
      <div
        className="new_block_listener"
        onClick={(e) => handleNewBlockListenerClick()}
      />
    </div>
  );
};
