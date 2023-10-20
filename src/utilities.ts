export interface Offset {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Get offsets of given element (for updateChildEdge).
// Reference: How to Draw a Line Between Two divs with JavaScript? | https://thewebdev.info/2021/09/12/how-to-draw-a-line-between-two-divs-with-javascript/
export const getOffset = (el: React.RefObject<any>) => {
  const rect = el?.current?.getBoundingClientRect();
  if (!rect) return;
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width,
    height: rect.height,
  };
};
