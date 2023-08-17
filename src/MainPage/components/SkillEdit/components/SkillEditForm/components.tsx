import { useStateValue } from "StateProvider";
import React from "react";
import "./components.css";

export interface InputProps {
  handleChange: (type: string, value: any) => Promise<void>,
}

export interface ActionButtonsProps {
  close: Function,
}

export const TitleInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();
 
  return (
    <div className="title_input">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        autoComplete="off"
        value={activeSkill?.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
    </div>
  )
}

export const LevelInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();

  return (
    <div className="level_input">
      <label htmlFor="level">Level</label>
      <input
        id="level"
        type="number"
        autoComplete="off"
        min={0}
        max={`${activeSkill?.maxLevel}`}
        value={activeSkill?.level}
        onChange={(e) => handleChange("level", e.target.value)}
      />
    </div>
  )
}

export const MaxLevelInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();

  return (
    <div className="max_level_input">
      <label htmlFor="max-level"> Max Level </label>
      <input
        id="max-level"
        type="number"
        autoComplete="off"
        min={0}
        max={9999999}
        value={activeSkill?.maxLevel}
        onChange={(e) => handleChange("maxLevel", e.target.value)}
      />
    </div>
  )
}

export const IncreaseByInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();

  return (
    <div className="increase_by_input">
      <label htmlFor="increase-by"> Increase by </label>
      <input
        id="increase-by"
        type="number"
        autoComplete="off"
        min={0}
        max={9999999}
        value={activeSkill?.increaseBy}
        onChange={(e) => handleChange("increaseBy", e.target.value)}
      />
    </div>
  )
}

export const ImageUpload = ({handleChange}: InputProps) => {
  return (
    <div className="image_upload">
      <label htmlFor="upload_image">Image</label>
      <input
        id="upload_image"
        type="file"
        onChange={(e) => handleChange("image", e.target.files?.[0])}
        accept="/image/*"
      />
    </div>
  )
}

export const DescriptionInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();

  return (
    <div className="description_input">
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        rows={3}
        autoComplete="off"
        value={activeSkill?.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
    </div>
  )
}

export const ActionButtons = ({close}: ActionButtonsProps) => {
  return (
    <div className="action_buttons">
      <button className="ok" type="submit">
        OK
      </button>
      <button className="cancel" type="button" onClick={(e) => close()}>
        Cancel
      </button>
    </div>
  )
}