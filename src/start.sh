#!/bin/bash
nohup /etc/X11/xinit/xserverrc &
/usr/bin/python3 -u iota_tft.py