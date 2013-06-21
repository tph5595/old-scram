from __future__ import division
import random

"""
This is the nuke plant class

Simulation time step is 60/second!! 1 step = 1 min

Math Nerd Stuff:

1 torr = 0.0193367747 pounds per square inch
F =(K - 273.15)* 1.8000 + 32.00
1 pound per square inch (psi) equals to 6,894.75729 pascals.
FORMULA: MPa x 145.0377 = psi
FORMULA: psi / 145.0377 = MPa


Boiling point of water from http://en.wikipedia.org/wiki/Clausius-Clapeyron_equation
    ln(Po/P) = DH/R (1/T - 1/To) 
    
    where 
    
    P = 630 torr
    Po = 760 torr (normal atm pressure)
    DH = 40.66 kJ/mol (heat of vaporization of water)
    R = 8.314 J/mol-K (ideal gas constant)
    To = 373 K (normal boiling point of water)
    T = unknown = boiling point of water at 630 torr.


"""
class Plant(object):
    def __init__(self):
        #Timings
        self.elapsedTime = 0 #add to this every cycle
        
        #workers
        #TODO: need to figure out a replenish rate
        self.workers = 80 
        
        #Risk Level
        self.risk = 0 #Increments based on Net MWH; determines earth quakes
        self.earthquakes = 0 #add to this when EQ happens
        
        #pump details
        self.pumpRate = 0.5 #gallons/sec
        self.maxPumps = 4
        
        #reactor
        self.energy = [0,36,144,324,576,900,1296,1600,2116,2700]
        self.rodLevel = 9 #Rods Step 1-10 10=max
        self.rodConst = 200 #generic energy produced by the rods at level 1
        self.energyOutputRate = 1 #between 0-1
        self.reactorPumps = 1 #Reactor pump step 1-4 4=max
        
        #WAGing the TC rate based on http://www.nist.gov/data/PDFfiles/jpcrd493.pdf
        self.rcsTcRate = 0.8 #thermal conductivity rate of water in RCS Loop; between 0-1
        self.reactorTemp = 500 #5000 is max; 200 is scrammed
        self.reactorResidualTemp = 0 #this is what is left over after tc
        self.rcsHotLegTemp = 0
        self.rcsColdLegTemp = 0
        self.rcsPressure = 2200 #2200 - 2300 is normal; above 2400 dangerous; 3000 explosion 
        self.boilingTemp = 655
         
        #steam generator
        self.sgTcRate = 0.8 #thermal conductivity rate of water in RCS Loop; between 0-1
        
        #Aux Feed Water System
        self.afsHotLegTemp = 0
        self.afsColdLegTemp = 0
        self.afsValve = False
        self.afsPumps = 3 #0-3 3 max
        self.afsTankLevel = 10 #TODO: need a max for this.
        
        #generator
        self.generatorMW = 500
        self.generatorMWH = 0 #accumulator for Net MWH  
        self.genTcRate = 0.2                     
        
        #Condenser (heat exchanger)
        self.csHotLegTemp = 0
        self.csColdLegTemp = 0
        self.conTcRate = 0.3 #heat xfer rate between 0 and 1
        self.conPumps = 2 # 0-2 2=max
        
        #tower
        self.towerTcRate = 0.8
        self.towerPumps = 2
        
        #HPI 
        self.hpiValve = False        
        self.hpiPump = 0 #HPI Pump step 0-4 4 max        
        self.hpiWater = 100 #HPI water level        
        self.hpirate = 5 #HPI rate rate gallons per second
        
        #pressurizer
        self.pressurizerWaterLevel = 50
        self.pressurizerSteamLevel = 50
        self.pressurizerQuenchTankLevel = 10
        self.pressuizerValve = False
        #RCS Pressure normal is 2200-2300 max is 3000
        self.rcsPressure = 2200
                  
    def _energyProduction(self):
        #this is energy production of the reactor
        #TODO: not sure if we need to deal w/ prev core temp as a factor
        #self.reactorTemp = (self.rodConst*self.rodLevel)*self.energyOutputRate
        self.reactorTemp = self.energy[self.rodLevel]
        
    def _exchangeRate(self,tcRate,numPumps):
        rate = (numPumps/self.maxPumps)*tcRate
        #rate= numPumps*tcRate
        #print "Rate: %s %s %s" % (str(tcRate),str(numPumps), str(rate))
        return rate
    
    def _xferEnergyToRcsLoop(self):
        rate = self._exchangeRate(self.rcsTcRate, self.reactorPumps)
        
        #newTemp = self.rcsColdLegTemp + self.reactorTemp + self.reactorResidualTemp
        newTemp = self.reactorTemp + self.reactorResidualTemp - (self.rcsColdLegTemp/2)
        
        self.rcsHotLegTemp = (newTemp)*(rate)
        self.reactorResidualTemp = self.reactorTemp - (self.reactorTemp*rate)
        
    def _xferEnergyToAfs(self):
        rate = self._exchangeRate(self.sgTcRate, self.afsPumps)
        self.rcsColdLegTemp =  self.rcsHotLegTemp*rate 
        self.afsHotLegTemp = self.afsColdLegTemp+(self.rcsHotLegTemp - self.rcsColdLegTemp)
    
    def _xferSteamToGen(self):
        #TODO: need some calc based on temp to drive gen efficiency
        if self.afsHotLegTemp > 212:
            self.generatorMW = 200
        else:
            self.generatorMW = 0

        #TODO: need to add the "hour" calc in here   
        self.generatorMWH = self.generatorMWH + self.generatorMW

        #drop the temp in the steam after turbine
        rate = self._exchangeRate(self.genTcRate, self.maxPumps)
        self.afsHotLegTemp = self.afsHotLegTemp*rate

        
    def _xferSteamToCondenser(self):  
        rate = self._exchangeRate(self.conTcRate, self.conPumps)   
        self.afsColdLegTemp = self.afsHotLegTemp*rate
        self.csHotLegTemp = self.csColdLegTemp+(self.afsHotLegTemp - self.afsColdLegTemp)

    
    def _xferToTower(self):
        rate = self._exchangeRate(self.towerTcRate, self.towerPumps)  
        self.csColdLegTemp = self.csHotLegTemp*rate
          
    def _getEarthQuake(self):
        possibility = not(random.getrandbits(1))
        #TODO: need to modify this possiblity based on the risk level
        #        right now this is a coin flip
        #        Also do not want to do this every cycle of the clock
        result = possibility
        return result
    
    def poll(self):
        #self.display()
        #return self.generatorMWH
        return {'mwh':self.generatorMWH,
                'simtime':self.elapsedTime,
                'reactortemp':self.reactorTemp,
                'rcshotlegtemp':self.rcsHotLegTemp,
                'rcscoldlegtemp':self.rcsColdLegTemp,
                'afshotlegtemp':self.afsHotLegTemp,
                'afscoldlegtemp':self.afsColdLegTemp,
                'genmw':self.generatorMW,
                'cshotlegtemp':self.csHotLegTemp,
                'cscoldlegtemp':self.csColdLegTemp,
                'rcspressure':self.rcsPressure,
                'boilingtemp':self.boilingTemp,
                'workers':self.workers,
                'risk':self.risk
                }
        
    def setRod(self,level):
        self.rodLevel = level
        
    def setPump(self,pumpid,level):
        if pumpid == 'rcs':
            self.reactorPumps = level
        if pumpid == 'hpiTank':
            self.hpiPump = level
        if pumpid == 'auxTank':
            self.afsPumps = level
        if pumpid == 'feedwater':
            self.conPumps = level
        if pumpid == 'cs':
            self.towerPumps = level
        return {'rcs':self.reactorPumps,
                'hpiTank':self.hpiPump,
                'auxTank':self.afsPumps,
                'feedwater':self.conPumps,
                'cs':self.towerPumps
                }
        
        
    def display(self):
        print"*****************************" 
        print "Sim Time: %s"%(str(self.elapsedTime))
        print "RCS Reactor Temp: %s"%(str(self.reactorTemp))
        print "RCS Reactor Residual Temp: %s"%(str(self.reactorResidualTemp))
        print "RCS Hot Leg Temp: %s"%(str(self.rcsHotLegTemp)) 
        print "RCS Cold Leg Temp: %s"%(str(self.rcsColdLegTemp))
        print "AFS Hot Leg Temp: %s"%(str(self.afsHotLegTemp))  
        print "Gen MW: %s"%(str(self.generatorMW))
        print "Gen MWH: %s"%(str(self.generatorMWH))
        print "AFS Hot Leg after Gen: %s"%(str(self.afsHotLegTemp))
        print "AFS Cold Leg Temp: %s"%(str(self.afsColdLegTemp))
        print "CS Hot Leg Temp: %s"%(str(self.csHotLegTemp))
        print "CS Cold Leg Temp: %s"%(str(self.csColdLegTemp))  
                
    def update(self):
        self.elapsedTime += 1       
        #make some energy; which is heat and
        self._energyProduction()
        #xfer the heat from the reactor to the RCS water high side
        self._xferEnergyToRcsLoop() 
        #run thru the steam gen and xfer energy to AFS
        self._xferEnergyToAfs()
        #then run the steam thru the generator
        self._xferSteamToGen()
        #then pass the steam to the condenser
        self._xferSteamToCondenser()
        #then on to the tower
        self._xferToTower()
        #self.display()

        
    
    
    
    