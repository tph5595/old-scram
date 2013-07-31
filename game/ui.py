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
import socket
import ConfigParser

#front end listeners
from http.servers.websocket2 import PollServerProtocol, \
                                    ValveServerProtocol, \
                                    PumpServerProtocol, \
                                    RodServerProtocol, \
                                    UserServerProtocol, \
                                    EarthquakeServerProtocol

from autobahn.websocket import WebSocketServerFactory, \
                               listenWS
from autobahn.websocket import WebSocketClientFactory, connectWS, WebSocketClientProtocol
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
        self._initFlags()
        self.config = ConfigParser.RawConfigParser() # Config file parser
        self.config.read('game/config.ini')   # Config file

    def connect(self, (host, port)):
        clientFactory = ClientFactory()
        #HACK: provide the front end listeners to the AMP client protocol
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
        self.reactor.callLater(0,self.connectToScoreboard)
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
    
    def _handlePoll(self,conn,msg): 
        if(self._handleStash("poll", conn, msg, True)):return
            
    def _handleValve(self,conn,msg):
        if(self._handleStash("valve", conn, msg)):return
        jsonmsg = json.loads(msg)
        if(jsonmsg == {"GHI":"getflag"}):
            j={"Flag":"FLAGDATA"}
            conn.sendMessage(json.dumps(j))
            return
        try:
            self.protocol.valve(msg)
        except:
            i={"Try":"Again"}
            conn.sendMessage(json.dumps(i))
            return
    
    def _handlePump(self,conn,msg):
        if(self._handleStash("pump", conn, msg)):return
        deferred = self.protocol.pump(msg)
        def cb(resp): 
            print "Pump UI Resp: %s sending to %s connections"%(resp, str(len(self.frontEndListeners['pump'].connections)))          
            if len(self.frontEndListeners['pump'].connections) > 0:
                for con in self.frontEndListeners['pump'].connections:
                    con.sendMessage(json.dumps(resp))
        deferred.addCallback(cb)
    
    def _handleRod(self, conn, msg):
        if(self._handleStash("rod", conn, msg)):return
        jsonmsg = json.loads(msg)
        if(jsonmsg == {"DEF":"getflag"}):
            j={"Flag":"FLAGDATA"}
            conn.sendMessage(json.dumps(j))
            return
        try:
            self.protocol.rod(msg)
        except:
            i={"Try":"Again"}
            conn.sendMessage(json.dumps(i))
            return
        
    def _handleUser(self,conn,msg):
        if(self._handleStash("user", conn, msg)):return
        jsonmsg = json.loads(msg)
        if(jsonmsg == {"ABC":"getflag"}):
            j={"Flag":"FLAGDATA"}
            conn.sendMessage(json.dumps(j))
            return
        
        #TODO: add user to array
        
    def _handleEarthquake(self,conn,msg):
        print "EarthQuake Repair",msg
        if(self._handleStash("earthquake", conn, msg, True)):return
        jsonmsg = json.loads(msg)
        if(jsonmsg == {"JKL":"getflag"}):
            j={"Flag":"FLAGDATA"}
            conn.sendMessage(json.dumps(j))
            return
        try:
            self.protocol.repairDamage(msg)
        except:
            i={"Try":"Again"}
            conn.sendMessage(json.dumps(i))
            return
        
    
    def _initFlags(self):
        self.flags = {}
        self.flags['poll'] = None
        self.flags['valve'] = None
        self.flags['pump'] = None
        self.flags['rod'] = None
        self.flags['user'] = None
        self.flags['earthquake'] = None
        
    def _handleStash(self,service,conn,msg,termConn=False): 
        if(conn.http_request_path == "/stash"):
            #get the old flag            
            prevFlag = self.flags[service] if self.flags[service]!=None else 'none'
            z = json.loads(msg)            
            #stash the new flag
            self.flags[service]  = z['flag']
            #return a response object
            j = {"oldflag":prevFlag}
            conn.sendMessage(json.dumps(j))
            
            if(termConn):
                #forcibly drop the connection
                conn.dropConnection()   
                
            print "%s Sent Flag Response: %s"%(service,j)
            return True 
        else:
            return False  
        
    def connectToScoreboard(self):

        #NOTE: Not sure if this is the best way to do this (try/except when reading value)
        try:
            # Load values from config file
            scoreboardIP = self.config.get('ui', 'scoreboardIP')
            scoreboardPort = int(self.config.get('ui', 'scoreboardPort'))
            
        except:
            # Default values if there is an issue with config file
            print("Failed to load config file, loading defaults")
            scoreboardIP = 'localhost'
            scoreboardPort = int('6007')
            
              
        self.scoreClient = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        self.scoreClient.connect((scoreboardIP,scoreboardPort)) 
        self._scoreClientLoop = LoopingCall(self._sendScore)
        finishedDeferred = self._scoreClientLoop.start(2,now=True)
        
    def _sendScore(self): 
        
        #NOTE: Not sure if this is the best way to do this (try/except when reading value)
        try:
            # Load values from config file
            teamName = self.config.get('ui', 'teamName')
        
        except:
            # Default values if there is an issue with config file
            print("Failed to load config file, loading defaults")
            teamName = "Local"
            
        try:
            x = self.protocol.getLastPoll()
            j = {}
            j['simtime'] = x['simtime']
            j['mwh'] = x['mwh']
            j['team'] = teamName
            resp = {}
            resp['cmd'] = "poll"
            resp['data'] = j
            self.scoreClient.send(json.dumps(resp))
        except KeyError:
            pass
        
    def setUpListeners(self):
        self._setUpListener("poll", 8081, PollServerProtocol, self._handlePoll)
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