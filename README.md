# Skill Tree

To Myself:

- Endure, and persevere.
- Respect the craft, make something beautiful.

## Introduction

This project is inspired by skill tree of various video game, as well as tree data structure in computer science.
My aim is to combine these concepts to help visualizing data in a concise manner and organizing them easily.

## Doing

## To Do

Bug Fix

- Bug: Overwrites user data on log in
- Need to show preview on skill edit on
- Skill tree is not scrolling on long skill tree
- Close all popups on mouse down instead of mouse up
- SkillEdit
  - Hover effects for action buttons (close, delete)
  - Prevent close skill edit on mouse up
- Dark Mode
  - Group tab edit input
  - Skill edit number wheel
  - Password input (UserAuthDialog)
- Light Mode
  - Need to rethink colors
- Center skill node on active

Core Feature

-

Basic Feature

- Make groups sortable
- Improve add node mouse click recognition

Advanced Feature

- Backup skills (edit history)
- Choose to have levels for a group or a skill
- Store template
- Export tree
- Find & Share tree
- Toggle children of a node

UI

- Sidebar toggle animation
- Fix skill link display when dropping nodes (it doesn't have the transition)

Performace

- Optimize skill link updating (could use React.useMemo?)

## Done

Core Feature

- Delete group

Basic Feature

- Dark mode
- Skill Preview
- Editing group name
- Make skill tree scrollable so every nodes can be seen
- Store active skill and group in state provider and highlights corresponding buttons

Advance Feature

- Add picture to skill node

UI

- Refine level change buttons
- Refine user auth dialog
- Refine skill edit bar
  - Change x position
  - Add delete button

Bug Fix

- Re-implement auth dialog
- Update children's parent if a skill is deleted
- Prevent a skill node drop to its decendent
- Drag overlay display

Code

- Convert project to TypeScript
  - (Prerequsite) learn TypeScript
  - Put components into seperated files
