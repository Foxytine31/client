// @flow
import * as devicesActions from '../../actions/devices'
import React, {Component} from 'react'
import RemoveDevice from '../device-revoke'
import Render from './index.render'
import moment from 'moment'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {navigateAppend, navigateUp} from '../../actions/route-tree'

class DevicePage extends Component {
  _buildTimeline (device) {
    const added = moment(device.created)
    const timeline = []
    if (device.revokedAt) {
      const revoked = moment(device.revokedAt)
      timeline.push({
        type: 'Revoked',
        desc: 'Revoked ' + revoked.format('MMM D, YYYY'),
        subDesc: device.revokedBy ? device.revokedBy.name : '',
      })
    } else if (device.lastUsed) {
      const lastUsed = moment(device.lastUsed)
      timeline.push({
        type: 'LastUsed',
        desc: 'Last used ' + lastUsed.format('MMM D, YYYY'),
        subDesc: lastUsed.fromNow(),
      })
    }
    timeline.push({
      type: 'Added',
      desc: 'Added ' + added.format('MMM D, YYYY'),
      subDesc: device.provisioner ? device.provisioner.name : '',
    })
    return timeline
  }

  render () {
    const {device} = this.props
    const timeline = this._buildTimeline(device)

    return <Render
      onBack={this.props.onBack}
      name={device.name}
      type={device.type}
      deviceID={device.deviceID}
      timeline={timeline}
      revokedAt={device.revokedAt}
      currentDevice={device.currentDevice}
      showRemoveDevicePage={this.props.showRemoveDevicePage}
      device={device}
    />
  }
}

export default connect(
  (state: any, ownProps) => {
    const devices = state.devices.devices.find(d => d.name === ownProps.routeProps.device.name)
    return ({
      ...devices,
      ...ownProps.routeProps,
    })
  },
  (dispatch: any, {routePath}) => {
    return {
      ...bindActionCreators(devicesActions, dispatch),
      showRemoveDevicePage: device => dispatch(navigateAppend({selected: 'removeDevice', device})),
      onBack: () => dispatch(navigateUp()),
    }
  }
)(DevicePage)
