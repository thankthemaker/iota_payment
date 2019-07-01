#!/bin/bash
if [ ! -f /tmp/.X0-lock ]; then 
  nohup /etc/X11/xinit/xserverrc &
fi
sleep 5
export DISPLAY=":0"
cd /usr/src/app/src/
/usr/bin/python3 -u iota_tft.py