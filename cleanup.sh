#!/bin/sh

rm *.snap
rm *.tgz

snapcraft clean

multipass delete --all
multipass purge

rm -rf ~/.config/snapcraft
rm -rf ~/.cache/snapcraft
rm -rf ~/.local/share/snapcraft

snapcraft clean
