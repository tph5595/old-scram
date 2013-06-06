from servers.websocket import ScramSocketServer, Echo

class ScramHttpServers(object):
    def __init__(self):
        self.test = Echo()
        
    def start(self):
        self.test.serve_forever()
        
if __name__ == '__main__':
    http_servers = ScramHttpServers()
    http_servers.start()