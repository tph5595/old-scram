
import random
import uuid
from twisted.application.service import Service
from scram.plant import Plant
from scram.ircbot import LogBotFactory

from game.environment import SimulationTime

TCP_SERVICE_NAME = 'tcp-service-name'
SCRAM_SERVICE_NAME = 'scram-service-name'

from twisted.internet.protocol import Protocol, Factory

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
        self.plant = Plant(platformClock)
        
        self.bot = LogBotFactory("derpy",platformClock)
        self.bot.observers.append(self.botMsg)
        platformClock.connectTCP("192.168.15.5", 6667, self.bot)
        
        #array for the players
        self.players = []

    def botMsg(self,conn,msg,channel,user): 
        if("start" in msg):
            # add plant update as an observer to the sim time tick
            SimulationTime.start(self)
            self.addObserver(self.plant.update)
            conn.started("I am started.",channel,user) 
        if("stop" in msg):
            self.removeObserver(self.plant.update)
            conn.started("I am stopped.",channel,user) 
        
            
    def createPlayer(self):
        player = Player()
        self.players.append(player)
        return player
    
    def removePlayer(self,player):
        self.players.remove(player)
        
    def start(self):
        #SimulationTime.start(self)
        pass
        

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