#!/bin/bash
nohup /etc/X11/xinit/xserverrc &
cd /usr
/usr/bin/python3 -u iota_tft.py