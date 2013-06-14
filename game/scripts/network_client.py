"""
A basic script which connects a dumb client to a dumb server.
"""

import sys

from epsilon.structlike import record

from twisted.internet import reactor
from twisted.python import log

from game.ui import UI

NetworkClientBase = record('log reactor uiFactory',
                           log=log, reactor=reactor, uiFactory=UI)

class NetworkClient(NetworkClientBase):
    """
    An object which starts the Game client and connects it to a remote
    Game server.
    """

    def run(self, host='127.0.0.1', port=1337):
        self.log.startLogging(sys.stdout)
        d = self.uiFactory().start((host, int(port)))
        d.addErrback(self.log.err, "Problem running UI")
        self.reactor.run()
        
    def main(self):
        self.run()
        
if __name__ == '__main__':
    client = NetworkClient()
    client.main()
    