import React, { useState } from "react";
import { GroupTab } from "./components";
import { useStateValue } from "StateProvider";
import { Group } from "types";
import "./GroupTabs.css";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export const GroupTabs = () => {
  const [{groups}, dispatch] = useStateValue();
  const sensors = useSensors(
    // Delay for onClick event of group tab
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [draggingGroup, setDraggingGroup]: [Group | null, Function] = useState(null);
  
  const handleDragStart = ({ active }: DragStartEvent) => {
    let target = groups.find(group => group.id === active.id.toString());
    if (target) setDraggingGroup(target);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    dispatch({
      type: "DROP_GROUP",
      active: active,
      over: over,
    });
    setTimeout(()=>setDraggingGroup(null), 100);
  };

  return (
    <div className="group_tabs">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={groups}
          strategy={verticalListSortingStrategy}
        >
          {groups?.map((group: Group) => (
            <GroupTab key={group.id} group={group} />
          ))}
        </SortableContext>
        <DragOverlay>
          {draggingGroup ? <GroupTab key="dragging-tab" group={draggingGroup}/> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
