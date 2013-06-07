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
    See L{game.ui}.

    @ivar reactor: Something which provides
        L{twisted.internet.interfaces.IReactorTCP} and
        L{twisted.internet.interfaces.IReactorTime}.

    @ivar windowFactory: The factory that should produce things like
        L{game.view.Window}.
    """

    def __init__(self, reactor=reactor):
        self.reactor = reactor
        self.q = Queue()


    def connect(self, (host, port)):
        """
        Connect to the Game server at the given (host, port).

        @param host: The name of the host to connect to.
        @param port: The TCP port number to connect to.
        """
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
        #TODO: need a stop call
        try:
            for event in self.q.get(True,2):
                self._handleEvent(event)
        except KeyboardInterrupt:
            self.stop()
        except Empty:
            pass

            
    def _handleEvent(self,event):
        pass        
    
    def stop(self):
        print"Calling stop"
        self._inputCall.stop()
    
    def go(self):
        """
        this is the loop that keeps the AMP client alive
        """
        print "in go"
        self._inputCall = LoopingCall(self.handleInput)
        finishedDeferred = self._inputCall.start(0.04,now=True)
        return finishedDeferred
    
    def pollPlant(self):
        pass


    def gotHandshake(self, environment):
        """
        Hook up a user-interface controller for the L{Player} and display the
        L{Environment} in a L{Window}.
        """
        environment.start()
        self.go()
        #TODO: need a loop to keep the client running.


    def start(self, (host, port)):
        """
        Let's Go!
        """
        d = self.connect((host, port))
        d.addCallback(self.handshake)
        d.addCallback(self.gotHandshake)
        return d