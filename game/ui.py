"""
Combination of View and Controller (maybe the Model is hiding in there too).

This is the UI middleware between HTTP and AMP
"""

from twisted.internet.protocol import ClientFactory
from twisted.protocols.policies import ProtocolWrapper, WrappingFactory
from twisted.internet.defer import Deferred
from twisted.internet import reactor
from twisted.internet.task import LoopingCall

from Queue import Queue, Empty

from game.network import NetworkController

#front end listeners
from http.servers.websocket2 import PollServerProtocol, \
                                    ValveServerProtocol, \
                                    PumpServerProtocol, \
                                    RodServerProtocol, \
                                    UserServerProtocol, \
                                    EarthquakeServerProtocol

from autobahn.websocket import WebSocketServerFactory, \
                               listenWS
import json

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
        #HACK: provide the front end listeners to the client protocol
        clientFactory.frontEndListeners = self.frontEndListeners        
        clientFactory.protocol = lambda: NetworkController(self.reactor)
        factory = ConnectionNotificationFactory(clientFactory)              
        self.reactor.connectTCP(host, port,factory)
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
        print "Event from UI queue: %s"%event      
    
    def stop(self):
        print"Calling stop"
        self._inputCall.stop()
    
    def go(self):
        """
        this is the loop that keeps the AMP client alive; deosn't really do anything
        """
        self._inputCall = LoopingCall(self.handleInput)
        finishedDeferred = self._inputCall.start(0.04,now=True)
        return finishedDeferred

    def gotHandshake(self, environment):
        environment.start()
        self.reactor.callLater(0,self.setUpListeners)
        self.go()
         
    def _setUpListener(self, serviceName, port, protocol, handler=None):
        url = "ws://localhost:%d"%(port)       
        factory = WebSocketServerFactory(url, debug=False, debugCodePaths=False)    
        factory.protocol = protocol
        factory.setProtocolOptions(allowHixie76=True)
        
        #HACK: add an array for observing messages
        factory.observers = [] #called for every message; for the ui to listen
        
        if handler !=None:
            factory.observers.append(handler)
        
        factory.connections = [] #all connections that are active; for the protocol to send data
        self.frontEndListeners[serviceName] = factory
        listenWS(self.frontEndListeners[serviceName]) 
        
    def _handleValve(self):
        pass
    
    def _handlePump(self,conn,msg):
        deferred = self.protocol.pump(msg)
        def cb(resp): 
            print "Pump UI Resp: %s sending to %s connections"%(resp, str(len(self.frontEndListeners['pump'].connections)))          
            if len(self.frontEndListeners['pump'].connections) > 0:
                for con in self.frontEndListeners['pump'].connections:
                    con.sendMessage(json.dumps(resp))
        deferred.addCallback(cb)
    
    def _handleRod(self, conn, msg):
        self.protocol.rod(msg)
        
    def _handleUser(self):
        pass
    def _handleEarthquake(self):
        pass
    
    def setUpListeners(self):
        self._setUpListener("poll", 8081, PollServerProtocol)
        self._setUpListener("valve", 8082, ValveServerProtocol,self._handleValve)
        self._setUpListener("pump", 8083, PumpServerProtocol,self._handlePump)
        self._setUpListener("rod", 8084, RodServerProtocol,self._handleRod)
        self._setUpListener("user", 8085, UserServerProtocol,self._handleUser)
        self._setUpListener("earthquake", 8086, EarthquakeServerProtocol,self._handleEarthquake)
                   
    def start(self, (host, port)):
        """
        Let's Go!
        """
        d = self.connect((host, port))
        d.addCallback(self.handshake)
        d.addCallback(self.gotHandshake)
        return d