import "./ViewOnlyTreePage.css";
import React, { useEffect, useState, createRef } from "react";
import { useStateValue } from "StateProvider";
import { Buttons } from "types";

const skills = [{"id":"d008afee-9779-4011-8b23-d7b402a4e4e0","parent":"root","title":"Computer Science","level":0,"maxLevel":0,"increaseBy":1,"description":"","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"29b90368-c888-4642-b712-3722f20ed89e","parent":"d008afee-9779-4011-8b23-d7b402a4e4e0","title":"Software Development","level":0,"maxLevel":0,"increaseBy":1,"description":"","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"0ec6b397-29fa-43d4-9a43-4a6260aa0907","parent":"29b90368-c888-4642-b712-3722f20ed89e","title":"Web Development","level":0,"maxLevel":0,"increaseBy":1,"description":"","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"d3068395-4503-4f16-a4b5-625fe55a1423","parent":"0ec6b397-29fa-43d4-9a43-4a6260aa0907","title":"JavaScript HTML CSS","level":1,"maxLevel":10,"increaseBy":1,"description":"{\"blocks\":[{\"key\":\"ek21b\",\"text\":\"Fortune Telling Website\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"7fe9fedd-035e-45bb-acdd-25e25ea8b7fc","parent":"d3068395-4503-4f16-a4b5-625fe55a1423","title":"React","level":3,"maxLevel":10,"increaseBy":1,"description":"{\"blocks\":[{\"key\":\"1dpr2\",\"text\":\"Skill Tree Website\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"3gqeh\",\"text\":\"Amazon Clone\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"a87p2\",\"text\":\"Tutorial\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"109f9a67-f11c-41c2-a49a-fbab5786571b","parent":"d3068395-4503-4f16-a4b5-625fe55a1423","title":"TypeScript","level":2,"maxLevel":10,"increaseBy":1,"description":"{\"blocks\":[{\"key\":\"7labk\",\"text\":\"Skill Tree Website\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"c3b249fd-7f49-4ae1-bb0d-43c6c98d84df","parent":"109f9a67-f11c-41c2-a49a-fbab5786571b","title":"Anglar","level":1,"maxLevel":10,"increaseBy":1,"description":"{\"blocks\":[{\"key\":\"e53gq\",\"text\":\"Angular Tutorial for Beginners: Learn Angular & TypeScript\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[{\"offset\":0,\"length\":58,\"key\":0}],\"data\":{}},{\"key\":\"4bt97\",\"text\":\"      Progress\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"3oekr\",\"text\":\"      9/15\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"1bidk\",\"text\":\"      [00:00]\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"elm57\",\"text\":\"      16:52 - \",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"cd3o2\",\"text\":\"      []\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{\"0\":{\"type\":\"LINK\",\"mutability\":\"MUTABLE\",\"data\":{\"url\":\"https://www.youtube.com/watch?v=k5E2AVpwsko&ab_channel=ProgrammingwithMosh\"}}}}","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"d68add13-37a8-4a9b-a07d-fa1fdc89f070","parent":"d008afee-9779-4011-8b23-d7b402a4e4e0","title":"Algorithm","level":0,"maxLevel":0,"increaseBy":1,"description":"","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true},{"id":"91ac5cf6-4bfa-4873-8623-25f63e0f5d52","parent":"d008afee-9779-4011-8b23-d7b402a4e4e0","title":"AI","level":0,"maxLevel":0,"increaseBy":1,"description":"","group":{"id":"4e465dfb-c599-4a4d-8509-a32a7ad8db6e","name":"Group 13"},"treeOpen":true}]

export const ViewOnlyTreePage = () => {
  const [{activeSkill}, dispatch] = useStateValue(); 

  useEffect(() => {
    dispatch({
      type: "SET_THEME",
      theme: 'dark'
    })
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    // Cancel active skill
    dispatch({
      type: "SET_ACTIVE_SKILL",
      activeSkill: null,
    });
  };

  return (
    <div className="view_only_tree_page"> 
      <div className="container" onMouseDown={handleMouseDown}>
      </div>
    </div>
  )
}