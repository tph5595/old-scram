"""
Model code for the substrate the game world inhabits.
"""
from twisted.internet import base, defer
from twisted.internet.task import LoopingCall, Clock

#from game.player import Player
#from game.terrain import Terrain


class SimulationTime(Clock):
    """
    A mechanism for performing updates to simulations such that all
    updates occur at the same instant.

    If a L{SimulationTime.callLater} is performed, when the function
    is called, it is guaranteed that no "time" (according to
    L{SimulationTime.seconds}) will pass until the function returns.

    @ivar platformClock: A provider of
        L{twisted.internet.interfaces.IReactorTime} which will be used
        to update the model time.

    @ivar granularity: The number of times to update the model time
        per second. That is, the number of "instants" per
        second. e.g., specifying 2 would make calls to seconds()
        return 0 for 0.5 seconds, then 0.5 for 0.5 seconds, then 1 for
        0.5 seconds, and so on. This number directly represents the
        B{model} frames per second.

    @ivar terrain: A C{dict} mapping two-tuples of (x, y) model
        coordinates to terrain types.

    @ivar _call: The result of the latest call to C{scheduler}.
    """
    _call = None

    def __init__(self, granularity, platformClock):
        Clock.__init__(self)
        self.granularity = granularity
        self.platformClock = platformClock
        self.observers = []

    def addObserver(self, observer):
        """
        Add the given object to the list of those notified about state changes
        in this world.
        """
        self.observers.append(observer)
    def removeObserver(self,observer):
        self.observers.remove(observer)       
        
    def _update(self, frames):
        """
        Advance the simulation time by one "tick", or one over granularity.
        """
        self.advance(1.0 * frames / self.granularity)
        for f in self.observers:
            f()


    def start(self):
        """
        Start the simulated advancement of time.
        """
        print "Simulation Time Starting"
        self._call = LoopingCall.withCount(self._update)
        self._call.clock = self.platformClock
        self._call.start(1.0 / self.granularity, now=False)


    def stop(self):
        """
        Stop the simulated advancement of time. Clean up all pending calls.
        """
        print "Simulation Time Stopping"
        self._call.stop()



class Environment(SimulationTime):
    """
    The part of The World which is visible to a client.

    @ivar observers: A C{list} of objects notified about state changes of this
        object.

    @ivar initialPlayer: C{None} until an initial player is set, then whatever
        L{Player} it is set to.

    @ivar network: A L{NetworkController} instance connected to the server for
        the world this environment is a view on to.
    """
    initialPlayer = None
    network = None

    def __init__(self, *a, **kw):
        SimulationTime.__init__(self, *a, **kw)
        self.observers = []


    def setInitialPlayer(self, player):
        """
        Set the initial player to the given player.
        """
        self.initialPlayer = player


    def setNetwork(self, network):
        """
        Specify a connected L{NetworkController} instance which can be used to
        communicate with the server.
        """
        self.network = network


    def addObserver(self, observer):
        """
        Add the given object to the list of those notified about state changes
        in this environment.
        """
        self.observers.append(observer)


    def createPlayer(self, position, speed):
        """
        Make a new player with the given parameters.

        @type position: two-tuple of numbers
        @param position: Where the newly created player is.

        @type speed: number
        @param speed: How fast can newly created player go?

        @return: The new L{Player}
        """
        player = None
        for observer in self.observers:
            observer.playerCreated(player)
        return player


    def removePlayer(self, player):
        """
        Broadcast the removal of the given player to all registered observers.
        """
        for observer in self.observers:
            observer.playerRemoved(player)