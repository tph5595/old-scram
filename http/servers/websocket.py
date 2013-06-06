from geventwebsocket.handler import WebSocketHandler
from gevent.pywsgi import WSGIServer
from flask import Flask, request, render_template

class ScramSocketServer(WSGIServer):
    port = 10001
    def __init__(self):
        self.port = ScramSocketServer.port
        self.app = Flask(__name__)
        self.app.add_url_rule('/', 'index', self.index)
        self.app.add_url_rule('/api', 'api', self.api, methods=['GET','POST',])
        self.app.add_url_rule('/handshake', 'handshake', self.handshake)
        print self.app.url_map
        super(ScramSocketServer, self).__init__(('',self.port), self.app, handler_class=WebSocketHandler)
        
    def index(self):
        try:
            return render_template('client.html') #<- need to place templates in the templates dir
        except Exception as e:
            print str(e)
    
    def handshake(self,message):
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
                print "here"             
                ws.send(message)
        return   
     
if __name__ == '__main__':
    http_server = ScramSocketServer()
    http_server.serve_forever()