// @flow
import React, {Component} from 'react'
import openURL from '../util/open-url'
import {Box, Icon, Text, Button, Input, PlatformIcon} from '../common-adapters'
import {ConstantsStatusCode} from '../constants/types/flow-types'
import {globalStyles, globalColors, globalMargins} from '../styles'
import {platformText} from './prove-enter-username.shared'

import type {PlatformsExpandedType} from '../constants/types/more'
import type {Props} from './prove-enter-username'

function UsernameTips ({platform}: {platform: PlatformsExpandedType}) {
  if (platform === 'hackernews') {
    return (
      <Box style={styleInfoBanner}>
        <Text backgroundMode='Information' type='BodySemibold'>
          &bull; You must have karma &ge; 2<br />
          &bull; You must enter your uSeRName with exact case
        </Text>
      </Box>
    )
  }

  return null
}

type State = {
  username: string,
}

function customError (error: string, code: ?number) {
  if (code === ConstantsStatusCode.scprofilenotpublic) {
    return <Box style={{...globalStyles.flexBoxColumn, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styleErrorBannerText} type='BodySemibold'>You haven't set a public "Coinbase URL". You need to do that now.</Text>
      <Box style={{...globalStyles.flexBoxRow, alignItems: 'center'}} onClick={() => openURL('https://www.coinbase.com/settings#payment_page')}>
        <Text style={styleErrorBannerText} type='BodySemibold'>Go to Coinbase</Text>
        <Icon type='iconfont-open-browser' style={{color: globalColors.white_40, marginLeft: 4}} />
      </Box>
    </Box>
  }
  return <Text style={styleErrorBannerText} type='BodySemibold'>{error}</Text>
}

class PrivateEnterUsernameRender extends Component<void, Props, State> {
  state: State;

  constructor (props: Props) {
    super(props)
    this.state = {
      username: '',
    }
  }

  handleUsernameChange (username: string) {
    if (this.props.onUsernameChange) {
      this.props.onUsernameChange(username)
    }
    this.setState({username})
  }

  handleContinue () {
    this.props.onContinue(this.state.username)
  }

  render () {
    const {headerText, floatingLabelText, hintText} = platformText[this.props.platform]
    // FIXME: Input component has extra bottom space when no floating text.
    // This adjusts the sizes to be equal, but we should fix this discrepancy
    // in the component.
    let inputSizeFix = {}
    if (!floatingLabelText) {
      inputSizeFix = {textStyle: {height: 40, marginTop: 29, marginBottom: 11}}
    }

    return (
      <Box style={styleContainer}>
        <Icon style={styleClose} type='iconfont-close' onClick={this.props.onCancel} />
        {this.props.errorText && <Box style={styleErrorBanner}>{customError(this.props.errorText, this.props.errorCode)}</Box>}
        <Text type='Header' style={{marginBottom: globalMargins.medium}}>{headerText}</Text>
        <PlatformIcon platform={this.props.platform} overlay={'icon-proof-unfinished'} overlayColor={globalColors.grey} />
        <Input
          autoFocus={true}
          style={styleInput}
          {...inputSizeFix}
          floatingLabelText={floatingLabelText}
          hintText={hintText}
          value={this.state.username}
          onChangeText={username => this.handleUsernameChange(username)}
          onEnterKeyDown={() => this.handleContinue()} />
        <UsernameTips platform={this.props.platform} />
        <Box style={{...globalStyles.flexBoxRow, marginTop: 32}}>
          <Button type='Secondary' onClick={this.props.onCancel} label='Cancel' />
          <Button type='Primary' disabled={!this.props.canContinue} onClick={() => this.handleContinue()} label='Continue' />
        </Box>
      </Box>
    )
  }
}

const styleErrorBanner = {
  ...globalStyles.flexBoxColumn,
  justifyContent: 'center',
  position: 'absolute',
  alignItems: 'center',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1,
  minHeight: globalMargins.large,
  backgroundColor: globalColors.red,
}

const styleErrorBannerText = {
  color: globalColors.white,
}

const styleContainer = {
  ...globalStyles.flexBoxColumn,
  position: 'relative',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
}

const styleClose = {
  ...globalStyles.clickable,
  position: 'absolute',
  right: 16,
  top: 16,
}

const styleInput = {
  alignSelf: 'center',
  marginTop: globalMargins.small,
  marginBottom: 0,
  width: 460,
}

const styleInfoBanner = {
  ...globalStyles.flexBoxColumn,
  alignSelf: 'stretch',
  alignItems: 'center',
  backgroundColor: globalColors.yellow,
  padding: globalMargins.tiny,
}

export default PrivateEnterUsernameRender
