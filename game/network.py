"""
Network support for Game.
"""

import numpy
from struct import pack, unpack

from twisted.protocols.amp import (
    AMP, Command, Integer, Float, Argument, Boolean, String)

from game.environment import Environment
#from game.vector import Vector

"""
rjweiss - define AMP protocol for the game here! The network controller (client) can be defined below. 
            The server code is located in scram/network.py. 
"""

class SetValve(Command):
    """
    This will either turn a valve on or off
    """
    arguments = [('valveId',Integer()),
                 ('state',Boolean())]
    response = [('response',Boolean())]
    
class SetPump(Command):
    """
    This will increase or decrease pump flow
    """
    arguments = [('pumpId',Integer()),
                 ('level', Integer())]
    response = [('response',Boolean())]
    
class SetRod(Command):
    """
    This will raise or lower the rods
    """
    arguments = [('level',Integer())]
    response = [('response',Boolean())]
    
class ReportEnergy(Command):
    """
    This will report the energy produced
    """
    arguments = [('produced',Integer())]
    response = [('response',Boolean())]
    
class EarthQuake(Command):
    """
    This is the earth quake!!!
    """
    arguments = [('length',Integer())]
    response = [('response',Boolean())]
    
class AddUser(Command):
    """
    This is the user coming into the game
    """
    arguments = [('userId',String()),('password',String())]
    response = [('response',String())]
    
class GetUser(Command):
    """
    Get existing user
    """
    arguments = [('userId',String()),('password',String())]
    response = [('response',String())]
    
class Handshake(Command):
    """
    Initial sync up w/ server
    """
    response = [('identifier',String()),('granularity',Integer())]
    
class PollPlant(Command):
    """
    Get the run time data from the plant
    """
    arguments = [('id',String()),('mwh',String())] 
    #response = [('updateid',String()),('mwh',String())]

class NetworkController(AMP):
    """
    A controller which responds to AMP commands to make state changes to local
    model objects. This is used by the client.

    @ivar modelObjects: A C{dict} mapping identifiers to model objects.

    @ivar clock: A provider of L{IReactorTime} which will be used to
        update the model time.
    """

    environment = None

    def __init__(self, clock):
        self.modelObjects = {}
        self.clock = clock

    def addModelObject(self, identifier, modelObject):
        """
        Associate a network identifier with a model object.
        """
        self.modelObjects[identifier] = modelObject
        modelObject.addObserver(self)
        
    def storeHandshakeResponse(self,identifier, modelObject):
        print dir(modelObject)
        print "Got Identifier %s"%(identifier)
        #self.addModelObject(identifier, modelObject)
        
    def handshake(self):
        d = self.callRemote(Handshake)
        def cbHs(box):
            granularity = box['granularity']
            self.environment = Environment(granularity,self.clock)
            self.environment.setNetwork(self)
            self.storeHandshakeResponse(box['identifier'],granularity)
            return self.environment
        d.addCallback(cbHs)
        return d
    
    def pollPlant(self,id,mwh):
        print "Poll Plant Got update: %s %s"%(id,mwh)
        return {}
    PollPlant.responder(pollPlant)
        

    def objectByIdentifier(self, identifier):
        """
        Look up a pre-existing model object by its network identifier.

        @type identifier: C{int}

        @raise KeyError: If no existing model object has the given identifier.
        """
        return self.modelObjects[identifier]


    def identifierByObject(self, modelObject):
        """
        Look up the network identifier for a given model object.

        @raise ValueError: If no network identifier is associated with the
            given model object.

        @rtype: L{int}
        """
        for identifier, object in self.modelObjects.iteritems():
            if object is modelObject:
                return identifier
        raise ValueError("identifierByObject passed unknown model objects")


#     def setDirectionOf(self, identifier, direction, x, y, z, orientation):
#         """
#         Set the direction of a local model object.
# 
#         @type identifier: L{int}
#         @type direction: One of the L{game.direction} direction constants
# 
#         @see: L{SetDirectionOf}
#         """
#         player = self.objectByIdentifier(identifier)
#         player.setDirection(direction)
#         player.setPosition(Vector(x, y, z))
#         player.orientation.y = orientation
#         return {}
#     SetDirectionOf.responder(setDirectionOf)
