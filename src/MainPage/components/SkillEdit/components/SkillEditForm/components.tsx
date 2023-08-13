import { useStateValue } from "StateProvider";
import React from "react";

export interface InputProps {
  handleChange: (type: string, value: any) => Promise<void>,
}

export interface ActionButtonsProps {
  close: Function,
}

export const TitleInput = ({handleChange}: InputProps) => {
  const [{activeSkill}, ] = useStateValue();
 
  return (
    <div className="form-group">
      <label htmlFor="title">Title</label>
      <input
        id="title"
        className="form-control"
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
    <div className="form-group">
      <label htmlFor="level">Level</label>
      <input
        id="level"
        className="form-control level"
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
    <div className="form-group">
    <label htmlFor="max-level"> Max Level </label>
    <input
      id="max-level"
      className="form-control max_level"
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
    <div className="form-group increaseBy">
      <label htmlFor="increaseBy"> Increase by </label>
      <input
        id="increaseBy"
        className="form-control level_input increaseBy"
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
    <div className="form-group">
      <label htmlFor="upload_image">Image</label>
      <input
        id="upload_image"
        className="form-control upload_image"
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
    <div className="form-group">
      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        className="form-control description"
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
    <div className="action">
      <button className="abtn abtn_add" type="submit">
        OK
      </button>
      <button className="abtn abtn_cancel" type="button" onClick={(e) => close()}>
        Cancel
      </button>
    </div>
  )
}