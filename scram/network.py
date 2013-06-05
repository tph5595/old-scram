"""
Network functionality of Gam3.
"""

from twisted.internet.protocol import ServerFactory
from twisted.internet import reactor
from twisted.protocols.amp import AMP

#from game.terrain import CHUNK_GRANULARITY
from game.network import (Handshake)

import uuid


class ScramServer(AMP):
    """
    Translate AMP requests from clients into model
    operations and vice versa

    @ivar world: The L{World}.
    @ivar players: A mapping from L{Player} identifiers to L{Player}s.
    @ivar clock: An L{IReactorTime} provider.
    @ivar player: The L{Player} of the client that this protocol
        instance is communicating to.
    """

    def __init__(self, world, clock=reactor):
        self.world = world
        self.clock = clock
        self.players = {}
        self.player = None

    def handshake(self):
        identifier = str(uuid.uuid4())
        self.clock.callLater(0, self.sendExistingState)
        return{"granularity": self.world.granularity,
                "identifier": identifier}
    Handshake.responder(handshake)
    
    def sendExistingState(self):
        """
        Send information about connected players.
        """
        #TODO: implement me!!
        pass


    def sendExistingPlayers(self):
        """
        Send L{NewPlayer} commands to this client for each existing L{Player} in
        the L{World}.
        """
        for player in self.world.getPlayers():
            if player is not self.player:
                self.notifyPlayerCreated(player)
                player.addObserver(self)
        self.world.addObserver(self)

    def identifierForPlayer(self, player):
        """
        Return an identifier for the given L{Player}. If the given
        L{Player} has not been given before, invent a new identifier.
        """
        self.players[id(player)] = player
        return id(player)


    def playerForIdentifier(self, identifier):
        """
        Return a L{Player} object for the given C{identifier}. The
        C{identifier} must be one of the identifiers returned from
        L{identifierForPlayer}.
        """
        return self.players[identifier]


    def connectionLost(self, reason):
        """
        Remove this connection's L{Player} from the L{World}.
        """
        self.world.removePlayer(self.player)



class ScramFactory(ServerFactory):
    """
    Server factory for scram.

    @ivar world: The L{World} which will be served by protocols created by this
    factory.
    """
    def __init__(self, world):
        self.world = world


    def buildProtocol(self, ignored):
        """
        Instantiate a L{Gam3Server} with a L{World}.
        """
        return ScramServer(self.world)