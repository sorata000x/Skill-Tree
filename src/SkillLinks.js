import React, {useState, useEffect, createRef} from 'react'

function SkillLinks({skills, buttons, excludes}) {

  const [links, setLinks] = useState({});

  useEffect(() => {
    setLinks({});
    for (const skill in skills) {
      links[skill.id] = <div style={{width: '100px', height: '100px', backgroundColor: 'blue'}} />;
    }
  }, [skills])

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update links
    for(const skill of skills) {
      updateLink(skill);
    }
    // Update every () seconds
    const interval = setInterval(() => setTime(new Date()), 10);
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

    const off_p = getOffset(buttons[skill.parent]);
    const off_n = getOffset(buttons[skill.id]);

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
          opacity: excludes.includes(skill.id) ? 0 : 1
        }}
      />;
    
    links[skill.id] = newLink;
  }

  return (
    Object.values(links)
  )
}

export default SkillLinks
