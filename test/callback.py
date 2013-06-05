from twisted.internet.task import LoopingCall, Clock
from twisted.internet import reactor
import time

class derpy(Clock):
    def __init__(self,platformClock):
        Clock.__init__(self)
        self.granularity = 100
        self.platformClock = platformClock
        self.observers = []
        
    def registerObserver(self, f):
        self.observers.append(f)
        
    def _update(self, frames):
        print 'update clock'
        self.advance(1.0 * frames / self.granularity)
        for f in self.observers:
            f()
        
    def start(self):
        self._call = LoopingCall.withCount(self._update)
        self._call.clock = self.platformClock
        self._call.start(1.0 / self.granularity, now=False)
        print 'start clock'

    def stop(self):
        print 'stop clock'
        self._call.stop()
                
class caller(object):
    def f(self):
        print 'called back...'    
        
    def main(self):
        r = reactor
        r.run()
        d = derpy(r)
        d.start()
        print 'sleeping...'
        #time.sleep(2)
        print 'woke up....'
        d.registerObserver(self.f)
        #time.sleep(5)
        d.stop()
        #r.run()
        
if __name__ == '__main__':
    c = caller()
    c.main()
    
        