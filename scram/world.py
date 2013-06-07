
import random
import uuid
from twisted.application.service import Service
from scram.plant import Plant

from game.environment import SimulationTime

TCP_SERVICE_NAME = 'tcp-service-name'
SCRAM_SERVICE_NAME = 'scram-service-name'

#point = record('x y')
class Player(object):
    def __init__(self):
        self.id = str(uuid.uuid4())
        
class World(SimulationTime):
    """
    All-encompassing model object for the state of a scram game.

    @ivar random: An object like L{random.Random}, used for entropic things.

    @ivar observers: A C{list} of objects notified about state changes of this
        object.

    """
    def __init__(self, random=random, granularity=1, platformClock=None):
        SimulationTime.__init__(self, granularity, platformClock)
        self.random = random
        #the plant
        self.plant = Plant()
        #array for the players
        self.players = []
        
    def createPlayer(self):
        player = Player()
        self.players.append(player)
        return player
    
    def removePlayer(self,player):
        self.players.remove(player)
        
    def start(self):
        SimulationTime.start(self)
        # add plant update as an observer to the sim time tick
        self.addObserver(self.plant.update)

class ScramService(Service):
    """
    An L{IService<twisted.application.service.IService>} which starts and stops
    simulation time on a L{World}.

    @ivar world: The L{World} to start and stop.
    """
    def __init__(self, world):
        print "Scram World Initializing"
        self.world = world

    def startService(self):
        """
        Start simulation time on the wrapped world.
        """
        print "Scram World Started"
        self.world.start()

    def stopService(self):
        """
        Stop simulation time on the wrapped world.
        """
        print "Scram World Stopped"
        self.world.stop()