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

class Simple(resource.Resource):
    """
    This is a simple server that allows commands to be passed to the client
    """
    isLeaf = True
    def __init__(self,parent):
        self.parent = parent
        self.children = {}
        
    def render_GET(self,request):
        """
        This server responds to a get request and put it on the UI Queue
        """
        print "Cmd: %s"%request.args['cmd']
        self.parent.q.put(request.args['cmd'])
        return ""
            
class UI(object):
    """
    This is the user interface 
    """

    def __init__(self, reactor=reactor):
        self.reactor = reactor
        self.q = Queue()

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
        #TODO: do something with the command
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
        environment.start()
        self.reactor.callLater(0,self.pipeServer)
        self.go()

    def pipeServer(self):
        print"server starting"
        site = server.Site(Simple(self))
        self.reactor.listenTCP(8099,site)
        
    def start(self, (host, port)):
        """
        Let's Go!
        """
        d = self.connect((host, port))
        d.addCallback(self.handshake)
        d.addCallback(self.gotHandshake)
        return d