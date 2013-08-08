# Copyright (c) Twisted Matrix Laboratories.
# See LICENSE for details.


"""
An example IRC log bot - logs a channel's events to a file.

If someone says the bot's name in the channel followed by a ':',
e.g.

    <foo> logbot: hello!

the bot will reply:

    <logbot> foo: I am a log bot

Run this script with two arguments, the channel name the bot should
connect to, and file to log to, e.g.:

    $ python ircLogBot.py test test.log

will log channel #test to the file 'test.log'.

To run the script:

    $ python ircLogBot.py <channel> <file>
"""


# twisted imports
from twisted.words.protocols import irc
from twisted.internet import reactor, protocol
from twisted.python import log

# system imports
import time, sys, string, random


class LogBot(irc.IRCClient):
    """A logging IRC bot."""
    
    nickname = "scramMaster"
    
    def id_generator(self, size=6, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for x in range(size))
    
    def connectionMade(self):
        irc.IRCClient.connectionMade(self)
        print "connection made"
        
    def nickChanged(self, nick):
        """
        Called when my nick has been changed.
        """
        irc.IRCClient.nickChanged(self,nick)
        print"[New Nick %s]"%nick

    def connectionLost(self, reason):
        irc.IRCClient.connectionLost(self, reason)
        print "connection lost"

    # callbacks for events

    def signedOn(self):
        """Called when bot has succesfully signed on to server."""
        self.join(self.factory.channel)

    def joined(self, channel):
        """This will get called when the bot joins the channel."""
        print("[I have joined %s]" % channel)

    def privmsg(self, user, channel, msg):
        """This will get called when the bot receives a message."""
        origMsg = msg
        user = user.split('!', 1)[0]
        
        # Check to see if they're sending me a private message
        if channel == self.nickname:
            msg = "It isn't nice to whisper!  Play nice with the group."
            self.msg(user, msg)
            return
        
        if msg.startswith("all:"):
            for f in self.factory.observers:
                f(self,origMsg,channel,user)
            
        # Otherwise check to see if it is a message directed at me
        if msg.startswith(self.nickname + ":"):
            #self.msg(channel, msg)
            for f in self.factory.observers:
                f(self,origMsg,channel,user)
                
            if("change nick" in msg):
                self.newNick()
                self.msg(channel, "I changed my Nick.")
                
    def newNick(self):
        nick = self.id_generator()
        self.setNick(nick)
        self.nickChanged(nick)
                        
    def started(self,msg,channel,user):
        self.msg(channel,"%s: %s"%(user,msg))
        
    def action(self, user, channel, msg):
        """This will get called when the bot sees someone do an action."""
        user = user.split('!', 1)[0]


    # irc callbacks

    def irc_NICK(self, prefix, params):
        """Called when an IRC user changes their nickname."""
        old_nick = prefix.split('!')[0]
        new_nick = params[0]


    # For fun, override the method that determines how a nickname is changed on
    # collisions. The default method appends an underscore.
    def alterCollidedNick(self, nickname):
        """
        Generate an altered version of a nickname that caused a collision in an
        effort to create an unused related name for subsequent registration.
        """
        return nickname + '^'



class LogBotFactory(protocol.ClientFactory):
    """A factory for LogBots.

    A new protocol instance will be created each time we connect to the server.
    """

    def __init__(self, channel):
        self.channel = channel
        self.observers = []
    
    def buildProtocol(self, addr):
        p = LogBot()
        p.factory = self
        return p

    def clientConnectionLost(self, connector, reason):
        """If we get disconnected, reconnect to server."""
        connector.connect()

    def clientConnectionFailed(self, connector, reason):
        print "connection failed:", reason


if __name__ == '__main__':
    # initialize logging
    def myFunc(conn,msg,channel,user):
        if("start" in msg):
            conn.started(msg,channel,user)
        print "Callback: %s"%msg
        
    log.startLogging(sys.stdout)
    
    # create factory protocol and application
    f = LogBotFactory("derpy")
    f.observers.append(myFunc)
    
    # connect factory to this host and port
    reactor.connectTCP("192.168.15.5", 6667, f)

    # run bot
    reactor.run()