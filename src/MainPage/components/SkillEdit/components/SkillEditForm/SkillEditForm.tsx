import React from "react";
import { 
  TitleInput, 
  LevelInput, 
  MaxLevelInput, 
  IncreaseByInput, 
  ImageUpload,
  DescriptionInput,
  ActionButtons, 
} from "./components";
import { useStateValue } from "StateProvider";
import { storage } from "firebase.ts";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const SkillEditForm = () => {
  const [{activeSkill, user}, dispatch] = useStateValue();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const handleChange = async (type: string, value: any) => {
    if (!activeSkill)
      return;
    switch (type) {
      case "title": {
        if(typeof value !== 'string') return;
        activeSkill.title = value;
        break;
      }
      case "level": {
        if(typeof value !== 'number') return;
        // Cap to max level
        if (value <= activeSkill.maxLevel) {
          activeSkill.level = value
        } else {
          activeSkill.level = activeSkill.maxLevel;
        }
        break;
      }
      case "maxLevel": {
        if(typeof value !== 'number') return;
        activeSkill.maxLevel = value;
        break;
      }
      case "increaseBy": {
        if(typeof value !== 'number') return;
        activeSkill.increaseBy = value;
        break;
      }
      case "image": {
        if(value instanceof Blob || 
           value instanceof Uint8Array ||
           value instanceof ArrayBuffer) 
         return;
        if (user) {
          // Reference: How to upload image and Preview it using ReactJS ? | https://www.geeksforgeeks.org/how-to-upload-image-and-preview-it-using-reactjs/
          // Reference: Firebase Storage | https://modularfirebase.web.app/common-use-cases/storage/
          const storageRef = ref(storage, `/images/${user.uid}/${value.name}`);
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
        <TitleInput handleChange={handleChange} />
        <div className="form-level-group">
          <LevelInput handleChange={handleChange} />
          <div className="level-divider"> / </div>
          <MaxLevelInput handleChange={handleChange} />
          <IncreaseByInput handleChange={handleChange} />
        </div>
        {user && <ImageUpload handleChange={handleChange} />}
        <DescriptionInput handleChange={handleChange} />
        <ActionButtons close={close} />
      </form>
  )
}