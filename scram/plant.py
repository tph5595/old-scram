from __future__ import division
import random

"""
This is the nuke plant class

Simulation time step is 1/second!! 1 step = 1 min


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
        self.reactorPumps = 4 #Reactor pump step 1-4 4=max
        
        #WAGing the TC rate based on http://www.nist.gov/data/PDFfiles/jpcrd493.pdf
        self.rcsTcRate = 0.8 #thermal conductivity rate of water in RCS Loop; between 0-1
        self.reactorTemp = 750#5000 is max; 200 is scrammed
        self.reactorResidualTemp = 600 #this is what is left over after tc
        self.rcsHotLegTemp = 550
        self.rcsColdLegTemp = 400
        self.rcsPressure = 2200 #2200 - 2300 is normal; above 2400 dangerous; 3000 explosion 
        self.boilingTemp = 655
        
        #Temperatures from previous run
        self.oldRcsHotLegTemp = 0
        self.oldRcsColdLegTemp = 0
        self.oldReactorTemp = 0
         
        #steam generator
        self.sgTcRate = 0.8 #thermal conductivity rate of water in RCS Loop; between 0-1
        
        #Aux Feed Water System
        self.afsHotLegTemp = 0
        self.afsColdLegTemp = 0
        self.afsValve = False
        self.afsPumps = 3 #0-3 3 max
        self.afsTankLevel = 10 #TODO: need a max for this.
        
        #generator
        self.generatorMW = 0
        self.generatorMWH = 0 #accumulator for Net MWH  
        self.genTcRate = 0.2 
        self.generatorRunningMW = 0                    
        
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
        
        #initial value for temperature multipliers based upon pumps open
        self.hotMultiplier = [.1, .073, .053, .033, .01, .008, .007, .0058, .004]
        self.coldMultiplier = .27
        
        
        
        
    #Relationship between reactor temp and cold leg
    def _energyProduction(self):
        #temp increase from rod energy and number of pumps open
        self.reactorTemp = self.reactorTemp + (self.energy[self.rodLevel] * self.hotMultiplier[self.reactorPumps])
        #temp decrease from coldLegTemp.
        self.reactorTemp = self.reactorTemp - ((self.reactorTemp - self.rcsColdLegTemp) * self.coldMultiplier)
        
    #TODO:delete this method later
    def _exchangeRate(self,tcRate,numPumps):
        rate = (numPumps/self.maxPumps)*tcRate
        #rate= numPumps*tcRate
        #print "Rate: %s %s %s" % (str(tcRate),str(numPumps), str(rate))
        return rate
    
    
    #Relationship between reactor temp and hot leg
    def _xferEnergyToRcsLoop(self):
        #made up numbers
        thermalCon = .58
        heatCapacity = 4.19 #Joules/grams Kelvin
        waterMass = [100, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000] #gallons of water being pumped through the pressure chamber based on pumps on
        #heat produced
        reactorHeat = (self.reactorTemp - self.rcsColdLegTemp ) / thermalCon
        
        #if statement determines if hot leg is increasing or decreasing in temp
        if (self.reactorTemp > self.oldReactorTemp):
            self.rcsHotLegTemp = self.rcsHotLegTemp + ((reactorHeat / (waterMass[self.reactorPumps] * heatCapacity)) * 200)
        else:
            self.rcsHotLegTemp = self.rcsHotLegTemp - ((reactorHeat / (waterMass[self.reactorPumps] * heatCapacity)) * 200)
            
        """
        proof of calculations
       initial cold leg = 562
        initial reactor temp = 655
       initial hot leg = 604
        
        reactortemp Hotter = 655 + (2700 * .01) = 682
        reactortemp Colder = 682 - ((682 - 562) * .27)
        FinalReactorTemp = 649.6
        
        reactor temp got colder. Use 2nd part of if condition
        reactorHeat = (649.6 - 559) / .58 = 156.21
        rcsHotTemp = 655 - ((156.21 / (4000 * 4.19))*10) = .009   too small. gonna multiply my shit by 200 so I can see more an increase / decrease in temperatures.
        """
    
    def _xferEnergyToAfs(self):
        rate = self._exchangeRate(self.sgTcRate, self.afsPumps)
        self.rcsColdLegTemp =  self.rcsHotLegTemp*rate
        self.afsHotLegTemp = self.afsColdLegTemp+(self.rcsHotLegTemp - self.rcsColdLegTemp)
    
    #Going to call this first after each new game tick.  It will store the previous temps for later calculations.
    def _previousTemp(self):
        self.oldRcsHotLegTemp = self.rcsHotLegTemp
        self.oldRcsColdLegTemp = self.rcsColdLegTemp
        self.oldReactorTemp = self.reactorTemp
    
    def _xferSteamToGen(self):
        if self.afsHotLegTemp > 212:
            self.generatorMW = self.afsHotLegTemp * 1.08
        else:
            self.generatorMW = 0

        if self.elapsedTime%60 == 0:
            self.generatorMWH = self.generatorMWH + (self.generatorRunningMW/60)
            self.generatorRunningMW = 0
        else:
            self.generatorRunningMW += self.generatorMW

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
    
    def _calcRisk(self):
        if self.elapsedTime > 60 and self.elapsedTime%60 == 0:
            print "here"
            self.risk += 1
            
        if self.generatorMWH > 1000 and self.generatorMWH%1000 == 0:
            self.risk += 1
            
    def cryptXOR(self,s, key="\x1027"):
        #TODO: save me for later.
        output = ""
        for character in s:
            for letter in key:
                character = chr(ord(character) ^ ord(letter))
            output += character
        return output
 
 
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
                'risk':self.risk,
                'rcs':self.reactorPumps,
                'hpiTank':self.hpiPump,
                'auxTank':self.afsPumps,
                'feedwater':self.conPumps,
                'cs':self.towerPumps,
                'rods':self.rodLevel
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
        #increment game tick one second
        self.elapsedTime += 1       
        #get temps from last game tick
        self._previousTemp()
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
        self._calcRisk()
        #self.display()

        
    
    
    
    