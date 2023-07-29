import React from "react";
import "./SkillEdit.css";
import CloseIcon from "@mui/icons-material/Close";
import { CgClose } from 'react-icons/cg';
import { FiMoreHorizontal } from 'react-icons/fi';
import { FaRegTrashAlt } from 'react-icons/fa'
import { useStateValue } from "../../StateProvider";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * A panel to edit a skill.
 * @param {Object} activeSkill a skill to be edited
 * @param {Function} operateSkills operation on skills (see App.js)
 * @param {Function} close close this panel
 * @returns
 */
function SkillEdit() {
  const [{ skill, activeSkill, user }, dispatch] = useStateValue();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  const handleChange = async (type, value) => {
    switch (type) {
      case "title": {
        activeSkill.title = value;
        break;
      }
      case "level": {
        // Cap to max level
        activeSkill.level = value <= activeSkill.maxLevel ? value : activeSkill.maxLevel;
        break;
      }
      case "maxLevel": {
        activeSkill.maxLevel = value;
        break;
      }
      case "increaseBy": {
        activeSkill.increaseBy = value;
        break;
      }
      case "image": {
        // value == file
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

  const deleteSkill = (e) => {
    if (activeSkill) {
      dispatch({
        type: "DELETE_SKILL",
        id: activeSkill.id,
      })
    }
    close();
  }

  return (
    <div className="skill_edit_container" onClick={(e) => e.stopPropagation()}>
      <div className="action_container">
        <CgClose className="action_btn" size={16} onClick={close} />
        <FaRegTrashAlt className="action_btn" size={14} onClick={deleteSkill} />
      </div>
      <form className="skill_edit_form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            className="form-control"
            type="text"
            autoComplete="off"
            value={activeSkill.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div className="form-level-group">
          <div className="form-group">
            <label for="level">Level</label>
            <input
              id="level"
              className="form-control level_input level"
              type="number"
              autoComplete="off"
              min={0}
              max={`${activeSkill.maxLevel}`}
              value={activeSkill.level}
              onChange={(e) => handleChange("level", e.target.value)}
            />
          </div>
          <div className="level-divider"> / </div>
          <div className="form-group">
            <label for="max-level"> Max Level </label>
            <input
                id="max-level"
                className="form-control level_input max_level"
                type="number"
                autoComplete="off"
                min={0}
                max={9999999}
                value={activeSkill.maxLevel}
                onChange={(e) => handleChange("maxLevel", e.target.value)}
              />
          </div>
          <div className="form-group increaseBy">
            <label for="increase-by"> Increase by </label>
            <input
              id="increaseBy"
              className="form-control level_input increaseBy"
              type="number"
              autoComplete="off"
              min={0}
              max={9999999}
              value={activeSkill.increaseBy}
              onChange={(e) => handleChange("increaseBy", e.target.value)}
            />
          </div>
        </div>
        {user && (
          <div className="form-group">
            <label for="upload_image">Image</label>
            <input
              id="upload_image"
              type="file"
              onChange={(e) => handleChange("image", e.target.files[0])}
              accept="/image/*"
            />
          </div>
        )}
        <div className="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            className="form-control description"
            rows="3"
            autoComplete="off"
            value={activeSkill.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
        <div className="action">
          <button className="abtn abtn_add" type="submit">
            OK
          </button>
          <button className="abtn abtn_cancel" type="button" onClick={close}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default SkillEdit;
