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

- 

Core Feature

-

Basic Feature

- Improve add node mouse click recognition
- Make groups sortable
- Dark mode

Advanced Feature

- Choose to have levels for a group or a skill
- Store template
- Export tree
- Find & Share tree
- Toggle children of a node

UI

- Refine level change buttons
- Refine user auth dialog
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
