import React from "react";
import { useStateValue } from "StateProvider";
import { storage } from "firebase.ts";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./SkillEditForm.css";
import { InputGroup, ActionButtons, DraftEditor } from "./components";

export const SkillEditForm = () => {
  const [{ activeSkill, user }, dispatch] = useStateValue();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const handleChange = async (id: string, value: any) => {
    if (!activeSkill) return;
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
      case "image": {
        if (user) {
          // Reference: How to upload image and Preview it using ReactJS ? | https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/
          // Reference: Firebase Storage | https://modularfirebase.web.app/common-use-cases/storage/
          if(!value) return;
          const storageRef = ref(storage, `/images/${user.uid}/${value}`);
          const uploadTask = uploadBytesResumable(storageRef, value);
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {},
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                activeSkill.image = url;
                dispatch({
                  type: "SET_SKILL",
                  id: activeSkill.id,
                  skill: activeSkill,
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
        console.log('default')
        return;
      }
    }

    dispatch({
      type: "SET_SKILL",
      id: activeSkill.id,
      skill: activeSkill,
    });
  };

  const close = () => {
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <form className="skill_edit_form" onSubmit={handleSubmit}>
      <InputGroup 
        className="title_input"
        id="title"
        type="text"
        label="Title"
        value={activeSkill?.title}
        handleChange={(v)=>handleChange('title', v)}/>
      <div className="form-level-group">
        <InputGroup 
          className="level_input"
          id="level"
          type="number"
          label="Level"
          value={activeSkill?.level}
          handleChange={(v)=>handleChange('level', v)}
          min={0}
          max={activeSkill?.maxLevel}/>
        <InputGroup 
          className="max_level_input"
          id="max_level"
          type="number"
          label="Max Level"
          value={activeSkill?.maxLevel}
          handleChange={(v)=>handleChange('max_level', v)}
          min={0}
          max={9999999}/>
        <InputGroup 
          className="increase_by_input"
          id="increase_by"
          type="number"
          label="Increase By"
          value={activeSkill?.increaseBy}
          handleChange={(v)=>handleChange('increase_by', v)}
          min={0}
          max={9999999}/>
      </div>
      {user && 
      <InputGroup 
        className="image_upload"
        id="image"
        type="file"
        label="Image"
        handleChange={(v)=>handleChange('image', v)}
        accept="/image/*"/>}
      <hr className="solid" />
      <DraftEditor
        value={activeSkill?.description}
        onChange={(v)=>handleChange("description", v)}/>
    </form>
  );
};
