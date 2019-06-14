#!/bin/bash
export DISPLAY=":0"
cd /usr/src/app/src/
nohup /etc/X11/xinit/xserverrc & ; /usr/bin/python3 -u iota_tft.py