"""
Network functionality of Gam3.
"""

from twisted.internet.protocol import ServerFactory
from twisted.internet import reactor
from twisted.protocols.amp import AMP

# from game.terrain import CHUNK_GRANULARITY
from game.network import (Handshake, PollPlant, SetRod, SetPump, Earthquake)

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
        self.update = 0

    def handshake(self):
        print"Got Handshake from client"
        self.player = self.world.createPlayer()
        self.clock.callLater(0, self.sendExistingState)
        return{"granularity": self.world.granularity,
                "identifier": self.player.id}
    Handshake.responder(handshake)
    
    def rod(self, level):
        print "Setting Rod Level to: %s" % str(level)
        self.world.plant.setRod(level)
        return {"response":True}
    SetRod.responder(rod)
    
    def pump(self, pumpid, level):
        print "Setting Rod Level to: %s" % str(level)        
        return self.world.plant.setPump(pumpid, level)
    SetPump.responder(pump)
    
    def pollPlant(self):
        self.update += 1       
        poll = self.world.plant.poll()  
        self.callRemote(PollPlant, updateid=str(self.update),
                mwh=str(poll['mwh']),
                simtime=str(poll['simtime']),
                reactortemp=str(poll['reactortemp']),
                rcshotlegtemp=str(poll['rcshotlegtemp']),
                rcscoldlegtemp=str(poll['rcscoldlegtemp']),
                afshotlegtemp=str(poll['afshotlegtemp']),
                afscoldlegtemp=str(poll['afscoldlegtemp']),
                genmw=str(poll['genmw']),
                cshotlegtemp=str(poll['cshotlegtemp']),
                cscoldlegtemp=str(poll['cscoldlegtemp']),
                rcspressure=str(poll['rcspressure']),
                boilingtemp=str(poll['boilingtemp']),
                workers=str(poll['workers']),
                risk=str(poll['risk']),
                rcs=poll['rcs'],
                hpiTank=poll['hpiTank'],
                auxTank=poll['auxTank'],
                feedwater=poll['feedwater'],
                cs=poll['cs'],
                rods=poll['rods'],
                hpivalve=poll['hpivalve'],
                afsvalve = poll['afsvalve']
                        )
        return{}
        
    def getEarthquake(self):
        eq = self.world.plant.getEarthquake()  
        self.callRemote(Earthquake, quake=str(eq))
        return{}
         
    def sendExistingState(self):
        """
        Add observers (push) to the world.
        """
        self.world.addObserver(self.pollPlant)
        self.world.addObserver(self.getEarthquake)
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
        print "Player %s Connection Lost: %s" % (self.player.id, reason)
        self.world.removePlayer(self.player)
        self.world.removeObserver(self.pollPlant)



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
