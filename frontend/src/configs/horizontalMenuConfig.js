import React from "react"
import * as Icon from "react-feather"

const horizontalMenuConfig = [
  {
    id: "allAssets",
    title: "allAssets",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/",
  },
  {
    id: "allAssets",
    title: "All assets",
    type: "item",
    icon: <Icon.File size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/allAssets",
  }  
]

export default horizontalMenuConfig
