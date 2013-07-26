#!/usr/bin/python
#Sends packet to beacon machine during earthquake.

from scapy.all import *
import sys

#craft packet
ip=IP(dst="192.168.15.174")
udp=UDP(sport=1024,dport=1010)
payload="Dude, where's my flag? Where's your flag dude? DUDE, Where's my flag!?"
packet=ip/udp/payload
send(packet)

sys.exit(0)
