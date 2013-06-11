"""
Combination of View and Controller (maybe the Model is hiding in there too).

This is the UI middleware between HTTP and AMP
"""

from twisted.internet.protocol import ClientFactory
from twisted.protocols.policies import ProtocolWrapper, WrappingFactory
from twisted.internet.defer import Deferred
from twisted.internet import reactor
from twisted.internet.task import LoopingCall
from twisted.web import server, resource

from Queue import Queue, Empty

from game.network import NetworkController

#front end listeners
from http.servers.websocket2 import EchoServerProtocol

from autobahn.websocket import WebSocketServerFactory, \
                               WebSocketServerProtocol, \
                               listenWS

class ConnectionNotificationWrapper(ProtocolWrapper):
    """
    A protocol wrapper which fires a Deferred when the connection is made.
    """

    def makeConnection(self, transport):
        """
        Fire the Deferred at C{self.factory.connectionNotification} with the
        real protocol.
        """
        ProtocolWrapper.makeConnection(self, transport)
        self.factory.connectionNotification.callback(self.wrappedProtocol)

class ConnectionNotificationFactory(WrappingFactory):
    """
    A factory which uses L{ConnectionNotificationWrapper}.

    @ivar connectionNotification: The Deferred which will be fired with a
    Protocol at some point.
    """
    protocol = ConnectionNotificationWrapper

    def __init__(self, realFactory):
        WrappingFactory.__init__(self, realFactory)
        self.connectionNotification = Deferred()

          
class UI(object):
    """
    This is the user interface 
    """

    def __init__(self, reactor=reactor):
        self.reactor = reactor
        self.q = Queue() #not sure I need this
        self.frontEndListeners={}

    def connect(self, (host, port)):
        clientFactory = ClientFactory()
        clientFactory.protocol = lambda: NetworkController(
            self.reactor)
        factory = ConnectionNotificationFactory(clientFactory)
        self.reactor.connectTCP(host, port, factory)
        return factory.connectionNotification

    def handshake(self, protocol):
        self.protocol = protocol
        return self.protocol.handshake()
    
    def handleInput(self):
        try:
            event = self.q.get(False)
            self._handleCommand(event)
        except Empty:
            pass
            
    def _handleCommand(self,event):
        #TODO: do something with the command by call the protocol method
        print "Event: %s"%event      
    
    def stop(self):
        print"Calling stop"
        self._inputCall.stop()
    
    def go(self):
        """
        this is the loop that keeps the AMP client alive
        """
        self._inputCall = LoopingCall(self.handleInput)
        finishedDeferred = self._inputCall.start(0.04,now=True)
        return finishedDeferred

    def gotHandshake(self, environment):
        print dir(environment)
        environment.start()
        self.reactor.callLater(0,self.setUpListeners)
        self.go()
        
    def echo(self,msg):
        """
        This is the socket hook
        """
        print "Echo in UI got MSG: %s"%msg  
        return "Blargh"
         
    def setUpListeners(self):
        echoFactory = WebSocketServerFactory("ws://localhost:8081",
                                        debug=True,
                                        debugCodePaths=True)
    
        echoFactory.protocol = EchoServerProtocol
        echoFactory.setProtocolOptions(allowHixie76=True)
        #HACK: add an array for observing messages
        echoFactory.observers = []
        echoFactory.observers.append(self.echo)
        self.frontEndListeners['echo'] = echoFactory
        listenWS(self.frontEndListeners['echo'])     
           
    def start(self, (host, port)):
        """
        Let's Go!
        """
        d = self.connect((host, port))
        d.addCallback(self.handshake)
        d.addCallback(self.gotHandshake)
        return d