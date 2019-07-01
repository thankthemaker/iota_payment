#!/bin/bash
if [ ! -f /tmp/.X0-lock ]; then 
  nohup /etc/X11/xinit/xserverrc &
fi
export DISPLAY=":0"
cd /usr/src/app/src/
sleep 10
/usr/bin/python3 -u iota_tft.py