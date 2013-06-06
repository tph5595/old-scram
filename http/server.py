from servers.websocket import Echo, Ping

class ScramHttpServers(object):
    def __init__(self):
        self.echo = Echo()
        self.ping = Ping()
    def start(self):
        self.ping.start()
        self.echo.serve_forever()
        
if __name__ == '__main__':
    http_servers = ScramHttpServers()
    http_servers.start()