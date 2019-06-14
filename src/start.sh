#!/bin/bash
nohup /etc/X11/xinit/xserverrc &
cd /usr/src/app/src/
/usr/bin/python3 -u iota_tft.py