from geventwebsocket.handler import WebSocketHandler
from gevent.wsgi import WSGIServer
from flask import Flask, request, render_template
from webob import Request
        
class ScramSocketServer(WSGIServer):
    def __init__(self):
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
                result = self.process(message)             
                ws.send(result)
        return
    
class Echo(WSGIServer):   

    def __init__(self):
        self.app = Flask("Echo")
        self.app.add_url_rule('/api', 'api', self.api, methods=['GET','POST',])
        super(Echo, self).__init__(('',10002), self.app, handler_class=WebSocketHandler)
        
    def process(self,message):
        """
        Override this in the subclass
            - your overriding func should convert the http protocol to AMP then call the AMP server for the plant
            - not overriding this func creates a loopback echo server
        """
        return message 

    def api(self):
        if request.environ.get('wsgi.websocket'):
            ws = request.environ['wsgi.websocket']
            while True:
                #message is in the format of the websocket sub protocol
                message = ws.receive()  
                result = self.process(message)             
                ws.send(result)
        return
        
class Ping(WSGIServer):   
    def __init__(self):
        self.app = Flask("Ping")
        self.app.add_url_rule('/api', 'api', self.api, methods=['GET','POST',])
        super(Ping, self).__init__(('',10001), self.app, handler_class=WebSocketHandler)
        
    def process(self,message):
        """
        Override this in the subclass
            - your overriding func should convert the http protocol to AMP then call the AMP server for the plant
            - not overriding this func creates a loopback echo server
        """
        return "pong" 

    def api(self):
        if request.environ.get('wsgi.websocket'):
            ws = request.environ['wsgi.websocket']
            while True:
                #message is in the format of the websocket sub protocol
                message = ws.receive()  
                result = self.process(message)             
                ws.send(result)
        return
     
     
     
     
if __name__ == '__main__':
    http_server = ScramSocketServer()
    http_server.serve_forever()