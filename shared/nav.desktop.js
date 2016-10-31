// @flow
import {remote, ipcRenderer} from 'electron'

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {globalStyles} from './styles'
import {Box} from './common-adapters'
import GlobalError from './global-errors/container'

import {folderTab} from './constants/tabs'
import {switchTo} from './actions/route-tree'
import TabBar from './tab-bar/index.render'

import type {Tabs} from './constants/tabs'

type Props = {
  menuBadge: boolean,
  switchTab: (tab: Tabs) => void,
  provisioned: boolean,
  username: string,
  navigateBack: () => void,
  navigateUp: () => void,
  folderBadge: number,
}

function Nav (props) {
  return (
    <Box style={stylesTabsContainer}>
      <TabBar
        onTabClick={t => props.switchTab(t)}
        selectedTab={props.routeSelected}
        username={props.username}
        badgeNumbers={{[folderTab]: props.folderBadge}}
      />
      <GlobalError />
      <Box style={{...globalStyles.flexBoxColumn, flex: 1}}>
        {props.children}
      </Box>
    </Box>
  )
}

const stylesTabsContainer = {
  ...globalStyles.flexBoxRow,
  flex: 1,
}

export default connect(
  ({
    config: {extendedConfig, username},
    favorite: {publicBadge = 0, privateBadge = 0},
    notifications: {menuBadge}
  }) => ({
    provisioned: extendedConfig && !!extendedConfig.defaultDeviceID,
    username,
    menuBadge,
    folderBadge: publicBadge + privateBadge,
  }),
  (dispatch: any) => ({
    switchTab: tab => dispatch(switchTo(tab)),
  })
)(Nav)
