import React from "react";
import { useMain, useUser } from "StateProvider";
import { storage } from "_firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./SkillEditForm.css";
import { InputGroup, IconInputGroup, ImageEdit } from "./components";
import { DraftEditor } from "MainPage/components/DraftEditor";

/**
 * Inputs to edit the current (active) skill including:
 * - InputGroup     | title input, level input, max level input, increase by input group
 * - IconInputGroup | icon image upload group
 * - DraftEditor    | description input (rich text)
 */
export const SkillEditForm = () => {
  const [{ activeSkill }, dispatchMain] = useMain();
  const [{ user }, dispatchUser] = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Close on submit
    dispatchMain({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const handleChange = async (id: string, value: any) => {
    if (!activeSkill) return;
    // Set input data to storage
    switch (id) {
      case "title": {
        activeSkill.title = value;
        break;
      }
      case "level": {
        const newLevel = parseInt(value);
        // Cap to max level
        if (newLevel <= activeSkill.maxLevel) {
          activeSkill.level = newLevel;
        } else {
          activeSkill.level = activeSkill.maxLevel;
        }
        break;
      }
      case "max_level": {
        activeSkill.maxLevel = parseInt(value);
        break;
      }
      case "increase_by": {
        activeSkill.increaseBy = parseInt(value);
        break;
      }
      case "icon": {
        if (user) {
          // Reference: How to upload image and Preview it using ReactJS ? | https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/
          // Reference: Firebase Storage | https://modularfirebase.web.app/common-use-cases/storage/
          if (!value) return;
          const storageRef = ref(storage, `/images/${user.uid}/${value.name}`);
          const uploadTask = uploadBytesResumable(storageRef, value);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {},
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                const newIcon = {
                  name: value.name,
                  url: url,
                  scale: 1,
                };
                dispatchMain({
                  type: "SET_POP_UP",
                  popUp: <ImageEdit skill={activeSkill} icon={newIcon} />,
                });
              });
            }
          );
        }
        // No image uploading for guest
        break;
      }
      case "description": {
        activeSkill.description = value;
        break;
      }
      default: {
        return;
      }
    }
    dispatchUser({
      type: "SET_SKILL",
      id: activeSkill.id,
      skill: activeSkill,
    });
  };

  return (
    <form className="skill_edit_form" onSubmit={handleSubmit}>
      <InputGroup
        className="title_input"
        id="title"
        type="text"
        label="Title"
        placeHolder="Untitled"
        value={activeSkill?.title}
        handleChange={(v) => handleChange("title", v)}
      />
      <div className="form-level-group">
        <InputGroup
          className="level_input"
          id="level"
          type="number"
          label="Level"
          value={activeSkill?.level}
          handleChange={(v) => handleChange("level", v)}
          min={0}
          max={activeSkill?.maxLevel}
        />
        <InputGroup
          className="max_level_input"
          id="max_level"
          type="number"
          label="Max Level"
          value={activeSkill?.maxLevel}
          handleChange={(v) => handleChange("max_level", v)}
          min={0}
          max={9999999}
        />
        <InputGroup
          className="increase_by_input"
          id="increase_by"
          type="number"
          label="Increase By"
          value={activeSkill?.increaseBy}
          handleChange={(v) => handleChange("increase_by", v)}
          min={0}
          max={9999999}
        />
      </div>
      {user && <IconInputGroup setIcon={(v) => handleChange("icon", v)} />}
      <hr className="solid" />
      <DraftEditor
        style={{ width: "90%", height: "400px" }}
        value={activeSkill?.description}
        onChange={(v) => handleChange("description", v)}
      />
    </form>
  );
};