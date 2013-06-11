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
        WebSocketServerProtocol.connectionMade(self)
        
    def connectionLost(self,reason):
        WebSocketServerProtocol.connectionLost(self, reason)
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            resp = f(msg)
            self.sendMessage(resp)