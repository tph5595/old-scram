"""
Plugin hook module for twistd service.
"""

from os.path import join

from zope.interface import implements

from twisted.application.service import IServiceMaker
from twisted.application.internet import TCPServer
from twisted.plugin import IPlugin
from twisted.python.usage import Options, portCoerce

class _ScramPlugin(object):
    """
    Trivial glue class to expose a twistd service.
    """
    implements(IPlugin, IServiceMaker)

    class options(Options):
        """
        scram twistd command line options.
        """
        optParameters = [
            ('port', 'p', 1337, 'TCP port number to listen on.', portCoerce),
            ('log-directory', 'l', None,
             'Directory to which to log protocol traffic.')]

    description = "Scram server"

    tapname = "scram"

    def makeService(self, options):
        """
        Create a service which will run a scram server.

        @param options: mapping of configuration
        """

        from scram.network import ScramFactory        
        from scram.world import (TCP_SERVICE_NAME, SCRAM_SERVICE_NAME, ScramService, World)

        from twisted.internet import reactor
        from twisted.application.service import MultiService
        from twisted.protocols.policies import TrafficLoggingFactory

        world = World(granularity=60, platformClock=reactor)

        service = MultiService()

        factory = ScramFactory(world)
        if options['log-directory'] is not None:
            factory = TrafficLoggingFactory(
                factory, join(options['log-directory'], 'scram'))

        tcp = TCPServer(options['port'], factory, interface='127.0.0.1')
        tcp.setName(TCP_SERVICE_NAME)
        tcp.setServiceParent(service)

        scram = ScramService(world)
        scram.setName(SCRAM_SERVICE_NAME)
        scram.setServiceParent(service)

        return service

scramplugin = _ScramPlugin()