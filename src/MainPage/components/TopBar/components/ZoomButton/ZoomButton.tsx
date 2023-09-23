import { useStateValue } from "StateProvider";
import "./ZoomButton.css";
import React, { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";

export const ZoomButton = () => {
  const [{activeGroup}, dispatch] = useStateValue();
  const [zoom, setZoom] = useState(activeGroup?.zoom ? activeGroup?.zoom : 1);

  useEffect(()=>{ 
    setZoom(activeGroup?.zoom ? activeGroup?.zoom : 1)
  }, [activeGroup])

  if (!activeGroup) return;
  
  const zoomIn = () => {
    if(zoom >= 5.0) return;
    let zoomInTo = zoom;
    // Adhere to Google Chrome zooming amount
    switch(zoom) {
      case 5.00: zoomInTo = 5.00; break;
      case 4.00: zoomInTo = 5.00; break;
      case 3.00: zoomInTo = 4.00; break;
      case 2.50: zoomInTo = 3.00; break;
      case 2.00: zoomInTo = 2.50; break;
      case 1.75: zoomInTo = 2.00; break;
      case 1.50: zoomInTo = 1.75; break;
      case 1.25: zoomInTo = 1.50; break;
      case 1.10: zoomInTo = 1.25; break;
      case 1.00: zoomInTo = 1.10; break;
      case 0.90: zoomInTo = 1.00; break;
      case 0.80: zoomInTo = 0.90; break;
      case 0.75: zoomInTo = 0.80; break;
      case 0.67: zoomInTo = 0.75; break;
      case 0.50: zoomInTo = 0.67; break;
      case 0.33: zoomInTo = 0.50; break;
      case 0.25: zoomInTo = 0.33; break;
    }
    dispatch({
      type: "SET_GROUP",
      group: {
        ...activeGroup,
        zoom: zoomInTo
      }
    })
    setZoom(zoomInTo);
  }

  const zoomOut = () => {
    if(zoom <= 0.25) return;
    let zoomInTo = zoom;
    // Adhere to Google Chrome zooming amount
    switch(zoom) {
      case 5.00: zoomInTo = 4.00; break;
      case 4.00: zoomInTo = 3.00; break;
      case 3.00: zoomInTo = 2.50; break;
      case 2.50: zoomInTo = 2.00; break;
      case 2.00: zoomInTo = 1.75; break;
      case 1.75: zoomInTo = 1.50; break;
      case 1.50: zoomInTo = 1.25; break;
      case 1.25: zoomInTo = 1.10; break;
      case 1.10: zoomInTo = 1.00; break;
      case 1.00: zoomInTo = 0.90; break;
      case 0.90: zoomInTo = 0.80; break;
      case 0.80: zoomInTo = 0.75; break;
      case 0.75: zoomInTo = 0.67; break;
      case 0.67: zoomInTo = 0.50; break;
      case 0.50: zoomInTo = 0.33; break;
      case 0.33: zoomInTo = 0.25; break;
      case 0.25: zoomInTo = 0.25; break;
    }
    dispatch({
      type: "SET_GROUP",
      group: {
        ...activeGroup,
        zoom: zoomInTo
      }
    })
    setZoom(zoomInTo);
  }

  return (
    <div className="zoom_button">
      <button
        className="increase"
        onClick={(e)=>zoomIn()}
        >
        <HiOutlinePlus />
      </button>
      <div className="percentage">
        {`${Math.round(zoom * 100)}%`}
      </div>
      <button
        className="decrease"
        onClick={(e)=>zoomOut()}
        >
        <HiOutlineMinus />
      </button>
    </div>
  )
}