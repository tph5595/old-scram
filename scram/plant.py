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
        self.oldAfsColdLegTemp = 0
        self.oldAfsHotLegTemp = 0
        self.oldCsHotLegTemp = 0
        self.oldCsColdLegTemp = 0
        
        #steam generator
        self.sgTcRate = 0.8 #thermal conductivity rate of water in RCS Loop; between 0-1
        
        #Aux Feed Water System
        self.afsHotLegTemp = 0
        self.afsColdLegTemp = 0
        self.afsValve = False
        self.afsPumps = 2 #0-2 2 max 
        self.afsTankLevel = 10 #TODO: need a max for this.
        #This is a temp not displayed on screen between power generator and condenser in the afs loop.
        self.afsHiddenTemp = 0
        
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
        self.hpiPump = 0 #HPI Pump step 0-3 3 max        
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
        
        #Thermo-dynamics of water
        self.thermalCon = .58
        self.heatCapacity = 4.19 #Joules/grams Kelvin
        self.waterMass = [100, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000] #gallons of water being pumped through the pressure chamber based on pumps on
        
        
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
        #heat produced
        reactorHeat = (self.reactorTemp - self.rcsColdLegTemp ) / self.thermalCon
        
        #if statement determines if hot leg is increasing or decreasing in temp
        if (self.reactorTemp > self.oldReactorTemp):
            self.rcsHotLegTemp = self.rcsHotLegTemp + ((reactorHeat / (self.waterMass[self.reactorPumps] * self.heatCapacity)) * 200)
        else:
            self.rcsHotLegTemp = self.rcsHotLegTemp - ((reactorHeat / (self.waterMass[self.reactorPumps] * self.heatCapacity)) * 200)
            
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
    #relationship between rcscoldLeg, rcsHotLeg, and afsHotLeg, and afsColdLeg
    def _xferEnergyToAfs(self):
        """  
        Original Calculations...
        rate = self._exchangeRate(self.sgTcRate, self.afsPumps)
        self.rcsColdLegTemp =  self.rcsHotLegTemp*rate
        self.afsHotLegTemp = self.afsColdLegTemp+(self.rcsHotLegTemp - self.rcsColdLegTemp)
        """ 
        #tempVariables for calculations
        afsHeatExchange = ((self.rcsHotLegTemp - self.afsColdLegTemp) / self.thermalCon)
        tempChange = ((afsHeatExchange / (self.waterMass[self.afsPumps] * self.heatCapacity)) * 200)
        self.rcsColdLegTemp = self.rcsColdLegTemp - tempChange #decreasing cold leg temp by the amount the afsHotLeg will be changing
        #TODO: this will only let coldLegTemp fall.  Should be put into the if statement below to change when it is falling or increasing.
        
        if (self.rcsHotLegTemp > self.oldRcsHotLegTemp): 
            self.afsHotLegTemp = (self.afsHotLegTemp + tempChange)
        else:
            self.afsHotLegTemp = (self.afsHotLegTemp - tempChange)
            
        
        #disregard these comments.  Trying to think of a better way to calculate when temps are increasing or decreasing.
        #if old rcsHotleg - old afsColdLeg > rcsHotLeg - afsColdLeg   ----this wont work
        
    
    #Going to call this first after each new game tick.  It will store the previous temps for later calculations.
    def _previousTemp(self):
        self.oldRcsHotLegTemp = self.rcsHotLegTemp
        self.oldRcsColdLegTemp = self.rcsColdLegTemp
        self.oldReactorTemp = self.reactorTemp
        self.oldAfsColdLegTemp = self.afsColdLegTemp
        self.oldAfsHotLegTemp = self.afsHotLegTemp
        self.oldCsHotLegTemp = self.csHotLegTemp
        self.oldCsColdLegTemp = self.csColdLegTemp
    
    def _xferSteamToGen(self):
        
        #TODO: figure out a new way to calculate MWH. 
        
        if self.afsHotLegTemp > 212:
            self.generatorMW = self.afsHotLegTemp * 1.08
        else:
            self.generatorMW = 0

        if self.elapsedTime%60 == 0:
            self.generatorMWH = self.generatorMWH + (self.generatorRunningMW/60)
            self.generatorRunningMW = 0
        else:
            self.generatorRunningMW += self.generatorMW
        """
        #Old Calculation for drom in temp after steam generator.
        
        #drop the temp in the steam after turbine
        rate = self._exchangeRate(self.genTcRate, self.maxPumps)
        self.afsHotLegTemp = self.afsHotLegTemp*rate
        """
        
        """
        if (self.afsHotLegTemp > 212): #Later 212 will turn into the temperature at which steam occurs.
            self.generatorMW = 1 #some equation
        else:
            print ""
        """
        #Temp loss from turbine based on flat percents since there is only 1 input (afsHotLegTemp). That percent will be based on a curve of mw output.
        #TODO: Should this also be based on flow rate of water? could add an extra if pump = 2 then do rates below else make temp decrease a lower percent.
        if (self.afsPumps == 2):
            if (self.generatorMW > 900):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .1)
            elif (self.generatorMW > 800):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .09)
            elif (self.generatorMW > 700):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .08)
            elif (self.generatorMW > 600):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .07)
            elif (self.generatorMW > 500):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .06)
            elif (self.generatorMW > 400):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .05)
            elif (self.generatorMW > 300):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .04)
            elif (self.generatorMW > 200):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .03)
            elif (self.generatorMW > 100):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .02)
            elif (self.generatorMW > 1):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .01)
            else: 
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0001)
        elif (self.afsPumps == 1):
            if (self.generatorMW > 900):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .075)
            elif (self.generatorMW > 800):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .065)
            elif (self.generatorMW > 700):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .055)
            elif (self.generatorMW > 600):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .045)
            elif (self.generatorMW > 500):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .035)
            elif (self.generatorMW > 400):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .025)
            elif (self.generatorMW > 300):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .015)
            elif (self.generatorMW > 200):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .005)
            elif (self.generatorMW > 100):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .001)
            elif (self.generatorMW > 1):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0007)
            else: 
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0004)
        else:
            if (self.generatorMW > 900):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .02)
            elif (self.generatorMW > 800):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .018)
            elif (self.generatorMW > 700):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .015)
            elif (self.generatorMW > 600):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .012)
            elif (self.generatorMW > 500):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0009)
            elif (self.generatorMW > 400):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0007)
            elif (self.generatorMW > 300):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0005)
            elif (self.generatorMW > 200):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0003)
            elif (self.generatorMW > 100):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0002)
            elif (self.generatorMW > 1):
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .0001)
            else: 
                self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .00007)

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
                'rods':self.rodLevel,
                'hpivalve':self.hpiValve,
                'afsvalve':self.afsValve
                }
        
    def setRod(self,level):
        self.rodLevel = level
        
    def setValve(self,valveid,state):
        if valveid == 'afs':
            self.afsValve = state
        if valveid == 'hpi':
            self.hpiValve = state
        
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
