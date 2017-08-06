#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

npm install -g npm
if [[ "$(uname)" == "Darwin" ]]; then
  echo $CERTIFICATE_OSX_P12 | base64 --decode > /tmp/certificate.p12
  ls -alhs /tmp/certificate.p12
  security create-keychain -p mysecretpassword build.keychain
  security default-keychain -s build.keychain
  security unlock-keychain -p mysecretpassword build.keychain
  security import /tmp/certificate.p12 -P "" -k build.keychain -T /usr/bin/codesign
  security find-identity -v
else
  sudo dpkg --add-architecture i386
  sudo apt-get update
  sudo apt-get install -y --force-yes software-properties-common python-software-properties curl apt-transport-https libstdc++6
  curl -LO https://dl.winehq.org/wine-builds/Release.key
  sudo apt-key add Release.key
  sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/
  sudo apt-get update
  sudo apt-get install -y wine-stable
  sudo ln -s /opt/wine-stable/bin/wine /usr/bin/wine
fi
node "$ROOT/run/ci-build-app.js"
