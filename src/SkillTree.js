import React, { useState, createRef, useEffect } from 'react'
import SkillNodeLayer from './SkillNodeLayer'
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimation,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import './SkillTree.css';
import { useStateValue } from './StateProvider';
import { v4 as uuid } from 'uuid';
import SkillNodeButton from './SkillNodeButton';
import SkillNodeContainer from './SkillNodeContainer';

let INITIAL_SKILLS = [
  {
    id: uuid(),
    title: "Skill 1",
    level: "0",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 2",
    level: "10",
    children: [],
    parent: 'root',
  },
  {
    id: uuid(),
    title: "Skill 3",
    level: "50",
    children: [],
    parent: 'root',
  }
]
let INITIAL_BUTTONS = {}
INITIAL_SKILLS.forEach(skill => {
  INITIAL_BUTTONS[skill.id] = createRef()  
})

function SkillTree() {
  const [skills, setSkills] = useState([]);
  const [buttons, setButtons] = useState({});
  const [links, setLinks] = useState({});
  const [dragginSkillIDs, setDraggingSkillIDs] = useState([]);

  /**
   * Operation to modify the skills.
   * @param {Object} action 
   * @returns 
   */
  const operateSkills = (action) => {
    switch (action.type) {
      case "ADD_SKILL": {
        setSkills([...skills, action.skill]);
        buttons[action.skill.id] = createRef();
        links[action.skill.id] = <div style={{height: 100, width: 100}} />;
        break;
      }
      case "CHANGE_PARENT": {
        let fromIndex = skills.findIndex(skill => ( skill.id === action.from ))
        skills[fromIndex].parent = action.parent
        break;
      }
      default: {
        return;
      }
    }
  }

  /**
   * Find the nearest (positioned) parent id of a skill.
   * @param {String} id skill id
   * @returns nearest parent id
   */
  const getNearestParent = (id) => {
    const getParentDist = (parent, px, py) => {
      if (!parent.current) {
        return Infinity;
      }
      const rect = parent.current.getBoundingClientRect();
      let cx = rect.left + window.pageXOffset + rect.width / 2
      let cy = rect.top + window.pageYOffset + rect.height / 2
      let dx = px - cx;
      let dy = py - cy;
      return dy >= 0 ? Math.sqrt(dx * dx, dy * dy) : Infinity;
    }

    const rect = buttons[id].current.getBoundingClientRect();
    let [target, minDist] = [null, Infinity];
    // Calculate the distance of each parent skills and find the nearest one
    skills.forEach(skill => {
      let dist = getParentDist(buttons[skill.id], rect.left+rect.width/2, rect.top+rect.height/2);
      if (dist < minDist && skill.id !== id) {
        target = skill.id;
        minDist = dist;
      }
    });

    return target
  }

  /* Dnd-kit Sortable */

  const [activeSkill, setActiveSkill] = useState({});
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const dropAnimation = {
    ...defaultDropAnimation,
  }

  const getSkillByID = (id) => {
    let target = {};
    skills.forEach(skill => {
      if (skill.id === id)
        target = skill;
    })
    return target;
  }

  const handleDragStart = ({active, over}) => {
    setActiveSkill(getSkillByID(active.id));
    setDragOverlay(active.id);
  }

  const handleDragOver = ({active, over}) => {
    setActiveSkill(getSkillByID(active.id));
  }

  const handleDragEnd = ({active, over}) => {
    const parent = getNearestParent(active.id);
    operateSkills({
      type: "CHANGE_PARENT", 
      from: active.id, 
      parent: parent ? parent : 'root',
    })
    setActiveSkill(null);
    setDragOverlay(null);
  }

  const [dragOverlaySkills, setDragOverlaySkills] = useState([]);
  const [dragOverlayButtons, setDragOverlayButtons] = useState({});
  const [dragOverlayLinks, setDragOverlayLinks] = useState({});
 
  /**
   * Copy over skills (with different IDs) starting from the target id for DragOverlay.
   * @param {String} id starting target skill id 
   * @returns an array of copied skills
   */
  const copySkills = (id) => {
    let newSkills = [JSON.parse(JSON.stringify(getSkillByID(id)))];
    for (const d of newSkills) {
      for (const s of skills) {
        if (s.parent === d.id) {
          newSkills = [...newSkills, JSON.parse(JSON.stringify(s))];
        }
      }
    }
    const changeIDs = (targets) => {
      for (const p of targets) {
        let n = uuid();
        for (const c of targets) {
          if (p.id === c.parent)  // replace children's parent id
            c.parent = n;
        }
        p.id = n;                 // replace parent's id
      }
    }
    newSkills[0].parent = 'root';
    changeIDs(newSkills);
    return newSkills;
  }

  /**
   * Create buttons for target skills
   * @param {Array} targets an array of skills
   */
  const createButtons = (targets) => {
    console.log('create')
    let cb = {};
    for (const t of targets) {
      cb[t.id] = createRef();
    }
    return cb;
  }

  /**
   * Create links for target skills
   * @param {Array} targets an array of skills
   */
  const createLinks = (targets) => {
    let cl = {};
    for (const t of targets) {
      cl[t.id] = <div style={{width: '100px', height: '100px', backgroundColor: 'blue'}} />;
    }
    return cl;
  }

  const setDragOverlay = (id) => {
    if (!id) {
      setDragOverlaySkills([]);
      setDragOverlayButtons({});
      setDragOverlayLinks({});
      setDraggingSkillIDs([]);
    }
    const newDragOverlaySkills = copySkills(id)
    setDragOverlaySkills(newDragOverlaySkills);
    setDragOverlayButtons(createButtons(newDragOverlaySkills));
    setDragOverlayLinks(createLinks(newDragOverlaySkills));
    let newDraggingSkillIDs = [id]
    for (const d of newDraggingSkillIDs) {
      for (const s of skills) {
        if (s.parent === d) {
          newDraggingSkillIDs = [...newDraggingSkillIDs, s.id];
        }
      }
    }
    console.log(`231:newDraggingSkillIDs:${newDraggingSkillIDs}`)
    setDraggingSkillIDs(newDraggingSkillIDs)
  }

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    for(const skill of skills.concat(dragOverlaySkills)) {
      console.log(`updating: ${skill.id}`)
      updateLink(skill);
    }

    // Update every () seconds
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  /**
   * Update the positon of the links between the nodes
   * @param {Object} skill target skills that is linked to its parent
   * @returns 
   */
  const updateLink = (skill) => {
    if(skill.parent === 'root')
      return;

    /**
     * Get offsets of given element (for updateChildEdge).
     * Reference: How to Draw a Line Between Two divs with JavaScript? | https://thewebdev.info/2021/09/12/how-to-draw-a-line-between-two-divs-with-javascript/
     */
    const getOffset = (el) => {
      const rect = el.current.getBoundingClientRect();
      return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight
      };
    }

    const off_p = getOffset(buttons[skill.parent] ? buttons[skill.parent] : dragOverlayButtons[skill.parent]);
    const off_n = getOffset(buttons[skill.id] ? buttons[skill.id] : dragOverlayButtons[skill.id]);

    const length = Math.sqrt((off_p.left-off_n.left)*(off_p.left-off_n.left) +
                              (off_p.top-off_n.top)*(off_p.top-off_n.top))
    const angle = Math.atan2((off_p.top - off_n.top), (off_p.left - off_n.left)) * (180 / Math.PI);
    const top = off_p.top + off_p.height/2 + 120
    const left = off_n.left + off_n.width/2
    
    let newLink = 
      <div 
        className='link' 
        style={{ 
          width: length, 
          left: left, 
          top: top,
          transform: `rotate(${angle}deg)`, 
          transformOrigin: 'top left',
          opacity: dragginSkillIDs.includes(skill.id) ? 0 : 1
        }}
      />;

    console.log(`skill.id in dragginSkillIDs: ${skill.id in dragginSkillIDs}`)
    
    if (links[skill.id]) {
      links[skill.id] = newLink;
    } else {
      dragOverlayLinks[skill.id] = newLink;
    }
  }

  return (
    <div className='skill_tree_container'>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        >
        <SkillNodeLayer id='root' skills={skills} operateSkills={operateSkills} buttons={buttons} />
        <DragOverlay dropAnimation={dropAnimation} style={{height: '100%'}}>
            {activeSkill ? 
              <SkillNodeContainer 
                key={dragOverlaySkills[0] ? dragOverlaySkills[0].id : null} 
                id={dragOverlaySkills[0] ? dragOverlaySkills[0].id : null} 
                title={dragOverlaySkills[0] ? dragOverlaySkills[0].title : null} 
                parent={dragOverlaySkills[0] ? dragOverlaySkills[0].parent : null} 
                skills={dragOverlaySkills}
                buttons={dragOverlayButtons}
                isDragOverlay={true}
              />
              : null}
          </DragOverlay>
      </DndContext>
      {
        Object.values(links).concat(Object.values(dragOverlayLinks))
      }
    </div>
  )
}

export default SkillTree
