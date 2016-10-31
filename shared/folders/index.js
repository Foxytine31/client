// @flow
import React, {Component} from 'react'
import Render from './render'
import {connect} from 'react-redux'
import {favoriteList} from '../actions/favorite'
import {openInKBFS} from '../actions/kbfs'
import {switchTo, navigateAppend} from '../actions/route-tree'

import type {RouteProps} from '../route-tree/render-route'
import type {TypedState} from '../constants/reducer'
import type {FolderState} from '../constants/favorite'

export type Props = {
  favoriteList: () => void,
  folderState: ?FolderState,
  openInKBFS: (path: string) => void,
  showingPrivate: boolean,
  username: ?string,
  navigateAppend: (path: any) => void,
  switchTab: (showingPrivate: boolean) => void,
  onToggleShowIgnored: () => void,
  showingIgnored: boolean,
}

class Folders extends Component<void, Props, void> {
  componentDidMount () {
    this.props.favoriteList()
  }

  render () {
    return (
      <Render
        {...this.props.folderState}
        onClick={path => this.props.navigateAppend(path)}  //FIXME
        onRekey={path => this.props.navigateAppend(path)}
        onOpen={path => this.props.openInKBFS(path)}
        onSwitchTab={showingPrivate => this.props.switchTab(showingPrivate)}
        showingPrivate={this.props.showingPrivate}
        username={this.props.username}
        onToggleShowIgnored={this.props.onToggleShowIgnored}
        showingIgnored={this.props.showingIgnored}
      />
    )
  }

  static parseRoute () {
    return {
      componentAtTop: {title: 'Folders'},
      // $FlowIssue
      parseNextRoute: Files.parseRoute,
    }
  }
}

type FoldersRouteProps = RouteProps<{}, {showingIgnored: boolean}>
type OwnProps = FoldersRouteProps & {showingPrivate: boolean}

const ConnectedFolders = connect(
  (state: TypedState, {routeState, showingPrivate}: OwnProps) => ({
    username: state.config.username,
    folderState: state.favorite ? state.favorite.folderState : null,
    showingPrivate: !!state.favorite && showingPrivate,
    showingIgnored: !!state.favorite && routeState.showingIgnored,
  }),
  (dispatch: any, {routePath, routeState, setRouteState}: OwnProps) => ({
    favoriteList: () => { dispatch(favoriteList()) },
    navigateAppend: path => { dispatch(navigateAppend({selected: 'files', path})) },
    openInKBFS: path => { dispatch(openInKBFS(path)) },
    switchTab: showingPrivate => { dispatch(switchTo(...routePath.pop().push(showingPrivate ? 'private' : 'public').toArray())) },
    onToggleShowIgnored: () => { setRouteState({showingIgnored: !routeState.showingIgnored}) }
  })
)(Folders)

export function PrivateFolders(props: FoldersRouteProps) {
  return <ConnectedFolders showingPrivate={true} {...props} />
}

export function PublicFolders(props: FoldersRouteProps) {
  return <ConnectedFolders showingPrivate={false} {...props} />
}
