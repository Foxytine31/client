// @flow
import React from 'react'
import type {IconType} from '../../common-adapters/icon'
import type {Props} from './index.render'
import {Confirm, Box, Text, Icon} from '../../common-adapters'
import {globalStyles, globalColors} from '../../styles'

const Render = ({name, type, deviceID, currentDevice, onSubmit, onCancel}: Props) => {
  const icon: IconType = {
    'mobile': 'icon-phone-bw-revoke-64',
    'desktop': 'icon-computer-bw-revoke-64',
    'backup': 'icon-paper-key-revoke-64',
  }[type]

  const header = (
    <Box style={styleIcon}>
      <Icon type={icon} />
      <Text type='BodyBig' style={stylesName}>{name}</Text>
    </Box>
  )

  const body = <Text type='Header' style={{textAlign: 'center'}}>Are you sure you want to revoke {currentDevice ? 'your current device' : name}?</Text>

  return <Confirm theme='public' danger={true} header={header} body={body} submitLabel='Yes, delete it' onSubmit={() => onSubmit({deviceID, name, currentDevice})} onCancel={onCancel} />
}

const styleIcon = {
  ...globalStyles.flexBoxColumn,
  alignItems: 'center',
}

const stylesName = {
  textDecorationLine: 'line-through',
  color: globalColors.red,
  fontStyle: 'italic',
  marginTop: 4,
}

export default Render
