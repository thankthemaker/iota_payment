#!/bin/bash
nohup /etc/X11/xinit/xserverrc &
sleep 5
export DISPLAY=":0"
cd /usr/src/app/src/
/usr/bin/python3 -u iota_tft.py