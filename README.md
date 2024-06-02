## Introduction

This project is inspired by skill tree of various video game, as well as tree data structure in computer science, which is used for fast navigate and search.
My aim is to combine these concepts to help visualizing data in a concise manner and organizing them easily.
Excellent tool to track the progress towards your goal.

Help people figure out what they want to do in the future through other's experiences.
Finding out an unique path to solve a problem that no one has ever solved before.
Help you decide what to learn / do next.

My mission is to decrease the friction of people towards accomplish their goals.
Whether it is solving a problem or become the best version of yourself.

## To Do

Bug Fix

- Might need to worry about old data overwrites new data if in different tabs
- Dark Mode
  - Skill edit number wheel
- Light Mode
  - Need to rethink colors

Core Feature

-

Basic Feature

- Group tree (folders)
- Embeding images
- Trash can
- Landing page

Advanced Feature

- Embedding javascript
- Preview tree when hovering on group tabs
- Backup skills (edit history)
- Choose to have levels for a group or a skill
- Store template
- Export tree
- Find & Share tree
- Zoomer (- 100% +) button on top right corner
- Skill Syncing
  - Suggest syncing skill with the same title

Additional Feature

- Update log

UX

-

UI

- Sidebar toggle animation

Performace

- Optimize skill link updating
  - Update: Optimized, but could be better.

Idea

- Have multiple buttons for skill edit
- Checklist
- Deadline
- Password view

## Done

Core Feature

- Delete group

Basic Feature

- SkillEdit
  - Image upload - (9/5)
  - Rich text editor (DraftEditor.js)
  - 'Title', 'Level', 'Max Level', 'Increase By' inputs
- DraftEditor (Rich text editor)
  - ToolBar (link, bold, italic, underline, strike through) - (9/9)
  - Embedding link to text - (9/9)
  - Text formatting
    - creating list ('1. 'ordered, '- 'unordered) - (9/4)
    - insert soft newline (shift + enter) - (9/4)
    - bold, italic, underline, strike through, code - (9/2)
    - command formatting - (9/2)
    - markdown formatting - (9/2)
  - UX
    - add new block so last block always empty - (9/3)
- SideBar
  - GroupTabs
    - Make groups sortable - (8/26)
- Help button
- Dark mode
- Skill Preview
- Editing group name
- Make skill tree scrollable so every nodes can be seen
- Store active skill and group in state provider and highlights corresponding buttons

Advance Feature

- Add picture to skill node
- Toggle Skill Trees

UX

- Improve node drop behavior; Allow drop to peer

UI

- Shrink title if too long
- Refine level change buttons
- Refine user auth dialog
- Refine skill edit bar
  - Change x position
  - Add delete button

Bug Fix

- Group not active after load / login (8/25)
- Need to update group after deleting current group (8/25)
- Cant add node on load if don't click on group again (8/25)
- Can't edit group name (8/24)
- Skill Link (8/23)
- SkillEdit (8/22)
  - Hover effects for action buttons (close, delete)
  - Prevent close skill edit on mouse up
- Close all popups on mouse down instead of mouse up (8/22)
- Dark mode for inputs (8/22)
- Group tab more button stop propagation (8/22)
- Need to show preview on skill edit (8/22)
- Bug: Overwrites user data on log in
- Skill tree is not scrolling on long skill tree (8/20)
- Re-implement auth dialog
- Update children's parent if a skill is deleted
- Prevent a skill node drop to its decendent
- Drag overlay display

Code

- Convert project to TypeScript
  - (Prerequsite) learn TypeScript
  - Put components into seperated files

## Dependency

- @dnd-kit
  - sortable & draggable skill tree
- typefit
  - better skill title size handling
- draft-js
  - rich text editor
