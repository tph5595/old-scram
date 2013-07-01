from autobahn.websocket import WebSocketServerProtocol

"""
    factory = WebSocketServerFactory("ws://localhost:8081",
                                    debug=debug,
                                    debugCodePaths=debug)

    factory.protocol = EchoServerProtocol
    factory.setProtocolOptions(allowHixie76=True)
    listenWS(factory)
"""
class EchoServerProtocol(WebSocketServerProtocol):
    
    def onConnect(self, connectionRequest):
        #this is where cookies should be available.
        return None
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        self.sendMessage(msg)
        
class PollServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Poll Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Poll Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg)
            
class ValveServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Valve Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Valve Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg)  

class PumpServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Pump Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Pump Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg)           

class RodServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Rod Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Rod Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg) 
            
class UserServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "User Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "User Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg)  
            
class EarthquakeServerProtocol(WebSocketServerProtocol):
       
    def connectionMade(self):
        WebSocketServerProtocol.connectionMade(self)#always before your code
        print "Earthquake Connection Made"
        self.factory.connections.append(self)
        
    def connectionLost(self,reason):
        print "Earthquake Connection Lost"
        self.factory.connections.remove(self)
        WebSocketServerProtocol.connectionLost(self, reason)#always after your code
        
    def onMessage(self, msg, binary):
        for f in self.factory.observers:
            f(self,msg)            