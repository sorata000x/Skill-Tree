# Skill Tree

To Myself:

- Endure, and persevere.
- Respect the craft, make something beautiful.

## Introduction

This project is inspired by skill tree of various video game, as well as tree data structure in computer science.
My aim is to combine these concepts to help visualizing data in a concise manner and organizing them easily.

## What Do I Use Skill Tree For?

- Very nice way to document what I have learned and plan out what I need to learn

## Doing



## To Do

Bug Fix

- Dark Mode
  - Skill edit number wheel
- Light Mode
  - Need to rethink colors

Core Feature

-

Basic Feature

- Help button
- Turn description textarea into rich text
- Trash can
- Make groups sortable

Advanced Feature

- Backup skills (edit history)
- Choose to have levels for a group or a skill
- Store template
- Export tree
- Find & Share tree
- Toggle tree
- Zoomer (- 100% +) button on top right corner

UX

- Improve node drop behavior
- Insert node in corresponding click position instead of just append in the end

UI

- Make title smaller if too much characters for one word
- Sidebar toggle animation
- Fix skill link display when dropping nodes (it doesn't have the transition)

Performace

- Optimize skill link updating
  - Update: Optimized, but could be better.

Idea

- Have multiple buttons
- Checklist
- Deadline
- Password view

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
- Toggle Skill Trees

UX

- Improve add node mouse click recognition

UI

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
