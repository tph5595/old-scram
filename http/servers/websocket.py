from geventwebsocket.handler import WebSocketHandler
from gevent.wsgi import WSGIServer
from flask import Flask, request, render_template
from webob import Request
        
class ScramSocketServer(WSGIServer):
    port = 10001
    def __init__(self):
        self.port = ScramSocketServer.port
        self.app = Flask(__name__)
        self.app.add_url_rule('/api', 'api', self.api, methods=['GET','POST',])
        super(ScramSocketServer, self).__init__(('',self.port), self.app, handler_class=WebSocketHandler)
        
    def process(self,message):
        """
        Override this in the subclass
            - your overriding func should convert the http protocol to AMP then call the AMP server for the plant
            - not overriding this func creates a loopback echo server
        """
        print message
        return message 

    def api(self):
        if request.environ.get('wsgi.websocket'):
            ws = request.environ['wsgi.websocket']
            while True:
                #message is in the format of the websocket sub protocol
                message = ws.receive()  
                print message
                result = self.process(message)             
                ws.send(result)
        return
class Echo(ScramSocketServer):   
    ScramSocketServer.port = 10002
    def __init__(self):
        super(Echo,self).__init__()
     
     
     
     
if __name__ == '__main__':
    http_server = ScramSocketServer()
    http_server.serve_forever()