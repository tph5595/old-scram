from twisted.internet import reactor
from twisted.python import log
from twisted.web.server import Site
from twisted.web.static import File

from autobahn.websocket import WebSocketServerFactory, \
                               WebSocketServerProtocol, \
                               listenWS

"""
    factory = WebSocketServerFactory("ws://localhost:8081",
                                    debug=debug,
                                    debugCodePaths=debug)

    factory.protocol = EchoServerProtocol
    factory.setProtocolOptions(allowHixie76=True)
    listenWS(factory)
"""
class EchoServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        self.sendMessage(msg)
        
class PollServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        print"onMessage"
        for f in self.factory.observers:
            f(self,msg)