#!/usr/bin/env bash

set -e -u -o pipefail # Fail on error

gopath=${GOPATH:-}
rn_dir="$gopath/src/github.com/keybase/client/react-native"
ios_dir="$gopath/src/github.com/keybase/client/react-native/ios"
client_dir="$gopath/src/github.com/keybase/client"
cache_npm=${CACHE_NPM:-}
cache_go_lib=${CACHE_GO_LIB:-}
client_commit=${CLIENT_COMMIT:-}

"$client_dir/packaging/check_status_and_pull.sh" "$client_dir"

# Reset branch on error
client_branch=`cd "$client_dir" && git rev-parse --abbrev-ref HEAD`
function reset {
  (cd "$client_dir" && git checkout $client_branch)
}
trap reset EXIT

if [ -n "$client_commit" ]; then
  cd "$client_dir"
  echo "Checking out $client_commit on client (will reset to $client_branch)"
  git checkout "$client_commit"
  git pull
fi

cd "$rn_dir"

if [ ! "$cache_npm" = "1" ]; then
  ../packaging/npm_mess.sh
  npm install -g react-native-cli
fi


if [ ! "$cache_go_lib" = "1" ]; then
  echo "Building Go library"
  npm run gobuild-ios
fi

# Build and publish the apk
cd "$ios_dir"

cleanup() {
  cd "$client_dir"
  git co .
  echo "Killing packager $rn_packager_pid"
  pkill -P $rn_packager_pid || true
}

trap 'cleanup' ERR

RN_DIR="$rn_dir" "$client_dir/packaging/manage_react_native_packager.sh" &
rn_packager_pid=$!
echo "Packager running with PID $rn_packager_pid"

fastlane ios beta
cleanup

"$client_dir/packaging/slack/send.sh" "Finished releasing ios"
