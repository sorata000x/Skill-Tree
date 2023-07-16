import React, { useState, createRef, useEffect } from 'react'
import SkillNodeButton from './SkillNodeButton'
import './SkillNodeContainer.css'
import { useSortable } from '@dnd-kit/sortable';
import {CSS, add} from '@dnd-kit/utilities';
import SkillNodeLayer from './SkillNodeLayer';
import {v4 as uuid} from 'uuid';
import { useStateValue } from './StateProvider';

function SkillNodeContainer({id, title, parent, skills, operateSkills, buttons}) {
  const [link, setLink] =  useState(<div/>);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    node,
    over,
    active,
  } = useSortable( {
    id: id,
    transition: {duration: 300, easing: 'ease'}
  } );
  const [time, setTime] = useState(new Date());

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  useEffect(() => {
    //window.addEventListener('transitionend', () => handleTransition())
    return
    updateLink();
    const interval = setInterval(() => { setTime(new Date());}, 10); 
    return () => clearInterval(interval);
  }, [])



  const addSkill = () => {
    const skillID = uuid()
    operateSkills({
      type: "ADD_SKILL",
      skill: {
        id: skillID,
        title: `${skills.length}`,
        level: 0,
        children: [],
        parent: parent,
      }
    })
  }

  const handleClick = (event) => {
    // Prevent event bubbling
    // Reference: https://www.freecodecamp.org/news/event-propagation-event-bubbling-event-catching-beginners-guide/#what-is-event-delegation
    console.log(64)
    event.stopPropagation();
    addSkill();
    updateLink();
  }

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

  const updateLink = () => {
    if(parent === 'root')
      return;
    const off_p = getOffset(buttons[parent]);
    const off_n = getOffset(buttons[id]);
    const length = Math.sqrt((off_p.left-off_n.left)*(off_p.left-off_n.left) +
                              (off_p.top-off_n.top)*(off_p.top-off_n.top))
    const angle = Math.atan2((off_p.top - off_n.top), (off_p.left - off_n.left)) * (180 / Math.PI);
    
    //const off3 = getOffset(childDivRef);
    //const cx = off_n.left-off3.left+(off_n.width/2);
    const cx = off_n.left+(off_n.width/2);
    const top = off_p.top + off_p.height/2 + 120
    const left = off_n.left + off_n.width/2
    
    let newLink = <div className='link' style={{ width: length, left: left, top: top,
                                                  transform: `rotate(${angle}deg)`, transformOrigin: 'top left' }}/>;
    setLink(newLink)
  }

  return (
    <div style={style} ref={setNodeRef} onClick={handleClick} {...attributes} {...listeners}>
      <div className='skill_node_container' onClick={handleClick} >
        <SkillNodeButton id={id} title={title} />
        <SkillNodeLayer id={id} skills={skills} operateSkills={operateSkills} buttons={buttons} />
      </div>
      {link}
    </div>
  )
}

export default SkillNodeContainer
