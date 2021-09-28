import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "allAssets",
    title: "Media",
    type: "item",
    icon: <Icon.Home size={20} />,
    permissions: ["admin", "editor"],
    navLink: "/"
  }
]

export default navigationConfig
