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
        # Timings
        self.elapsedTime = 0  # add to this every cycle
        
        #5 every 20 minutes or so.  
        self.workers = 80 
        
        # Risk Level
        self.risk = 0  # Increments based on Net MWH and time; determines earth quakes
        
        # reactor
        self.energy = [0, 36, 144, 324, 576, 900, 1296, 1600, 2116, 2700]
        self.rodLevel = 9  # Rods Step 0-9 9=max
        self.reactorPumps = 4  # Reactor pump step 1-4 4=max
        
        self.reactorTemp = 653  # 5000 is max; 200 is scrammed
        self.rcsHotLegTemp = 603
        self.rcsColdLegTemp = 561
        self.rcsPressure = 2294  # 2200 - 2300 is normal; above 2400 dangerous; 3000 explosion 
        self.boilingTemp = 657
        
        # Temperatures from previous run
        self.oldRcsHotLegTemp = 0
        self.oldRcsColdLegTemp = 0
        self.oldReactorTemp = 0
        self.oldAfsColdLegTemp = 0
        self.oldAfsHotLegTemp = 0
        self.oldCsHotLegTemp = 0
        self.oldCsColdLegTemp = 0
        self.oldAfsHiddenTemp = 0
        
        # Aux Feed Water System
        self.afsHotLegTemp = 593
        self.afsColdLegTemp = 463
        self.afsValve = False
        self.afsPumps = 0  # 0-2 2 max 
        self.afsTankLevel = 10  # TODO: need a max for this.
        # This is a temp not displayed on screen between power generator and condenser in the afs loop.
        self.afsHiddenTemp = 500
        
        # generator
        self.generatorMW = 999
        self.generatorMWH = 0  # accumulator for Net MWH  
        self.generatorRunningMW = 0                    
        
        # Condenser (heat exchanger)
        self.csHotLegTemp = 94
        self.csColdLegTemp = 65
        self.conPumps = 2  # 0-2 2=max
        
        # tower
        self.towerPumps = 2
        
        # HPI 
        self.hpiValve = False        
        self.hpiPump = 0  # HPI Pump step 0-3 3 max        
        self.hpiWater = 100  # HPI water level        
        
        # pressurizer
        self.pressurizerWaterLevel = 50
        self.pressurizerSteamLevel = 50
        self.pressurizerQuenchTankLevel = 10
        self.pressuizerValve = False
      
        
        # initial value for temperature multipliers based upon pumps open
        self.hotMultiplier = [.1, .073, .053, .033, .01, .008, .007, .0058, .004]
        self.coldMultiplier = .27
        
        # Thermo-dynamics of water
        self.thermalCon = .58
        self.heatCapacity = 4.19  # Joules/grams Kelvin
        self.waterMass = [100, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]  # gallons of water being pumped through the pressure chamber based on pumps on
        
        self.earthquake = False
        
        
    # Relationship between reactor temp and cold leg
    def _energyProduction(self):
        # temp increase from rod energy and number of pumps open
        self.reactorTemp = self.reactorTemp + (self.energy[self.rodLevel] * self.hotMultiplier[self.reactorPumps])
        # temp decrease from coldLegTemp.
        self.reactorTemp = self.reactorTemp - ((self.reactorTemp - self.rcsColdLegTemp) * self.coldMultiplier)
    
    
    # Relationship between reactor temp and hot leg
    def _xferEnergyToRcsLoop(self):
        # heat produced
        reactorHeat = (self.reactorTemp - self.rcsColdLegTemp) / self.thermalCon
        
        # if statement determines if hot leg is increasing or decreasing in temp
        if (self.reactorTemp > self.oldReactorTemp):
            self.rcsHotLegTemp = self.rcsHotLegTemp + ((reactorHeat / (self.waterMass[self.reactorPumps] * self.heatCapacity)) * 200)
        elif (self.reactorTemp < self.oldReactorTemp):
            self.rcsHotLegTemp = self.rcsHotLegTemp - ((reactorHeat / (self.waterMass[self.reactorPumps] * self.heatCapacity)) * 200)
        else:
            self.rcsHotLegTemp = self.rcsHotLegTemp
            
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
        rcsHotTemp = 655 - ((156.21 / (4000 * 4.19))*10) = .009   too small. gonna multiply numbers by 200 so I can see more an increase / decrease in temperatures per tick.
        """
    # relationship between rcscoldLeg, rcsHotLeg, and afsHotLeg, and afsColdLeg
    def _xferEnergyToAfs(self):
        afsHeatExchange = ((self.rcsHotLegTemp - self.afsColdLegTemp) / self.thermalCon)
        tempChange = ((afsHeatExchange / (self.waterMass[self.conPumps] * self.heatCapacity)) * 200)
        
        if (self.rcsHotLegTemp > self.oldRcsHotLegTemp): 
            self.afsHotLegTemp = (self.afsHotLegTemp + tempChange)
            self.rcsColdLegTemp = self.rcsColdLegTemp + tempChange
        elif (self.rcsHotLegTemp < self.oldRcsHotLegTemp):
            self.afsHotLegTemp = (self.afsHotLegTemp - tempChange)
            self.rcsColdLegTemp = self.rcsColdLegTemp - tempChange  
        else:
            self.afsHotLegTemp = self.afsHotLegTemp
            self.rcsColdLegTemp = self.rcsColdLegTemp 
        
    
    # Going to call this first after each new game tick.  It will store the previous temps for calculations.
    def _previousTemp(self):
        self.oldRcsHotLegTemp = self.rcsHotLegTemp
        self.oldRcsColdLegTemp = self.rcsColdLegTemp
        self.oldReactorTemp = self.reactorTemp
        self.oldAfsColdLegTemp = self.afsColdLegTemp
        self.oldAfsHotLegTemp = self.afsHotLegTemp
        self.oldCsHotLegTemp = self.csHotLegTemp
        self.oldCsColdLegTemp = self.csColdLegTemp
        self.oldAfsHiddenTemp = self.afsHiddenTemp
    
    #calculates MWH and afsHiddenTemp
    def _xferSteamToGen(self):
        
        # TODO: figure out a new way to calculate MWH. 
        
        #generatorMW is based on steam volume or some kinda shit. Just gonna hack it to deal with hot leg temp???
        if (self.afsHotLegTemp > 150) and (self.reactorTemp > 350): #Later 150 will turn into the temperature at which steam occurs or something.
            self.generatorMW = self.afsHotLegTemp * 1.08 #made up a rate of increase
        else:
            self.generatorMW = 0 #it should probably decrease by a rate instead of instantly becoming 0.
            
        if self.elapsedTime % 60 == 0:
            self.generatorMWH = self.generatorMWH + (self.generatorRunningMW / 60)
            self.generatorRunningMW = 0
        else:
            self.generatorRunningMW += self.generatorMW
            
            
        #TODO: Could be made into a lookup table
        #TODO: think about logic. Not sure this is exactly how I want it.
        
        if (self.conPumps == 2): #pumps at 2
            #decreasing temp
            if(self.afsHotLegTemp < self.oldAfsHotLegTemp):
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
            #temp increasing
            if(self.afsHotLegTemp > self.oldAfsHotLegTemp):
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .1)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .09)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .08)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .07)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .06)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .05)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .04)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .03)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .02)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .01)
                else: 
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0001)
            #Temp staying same
            else:
                self.afsHiddenTemp = self.afsHiddenTemp
        #pumps at 1
        elif (self.conPumps == 1):
            #temp decreasing
            if(self.afsHotLegTemp < self.oldAfsHotLegTemp):
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
            #temp increasing
            elif(self.afsHotLegTemp > self.oldAfsHotLegTemp):
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .075)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .065)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .055)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .045)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .035)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .025)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .015)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .005)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .001)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0007)
                else: 
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0004)
            #Temp staying same
            else:
                self.afsHiddenTemp = self.afsHiddenTemp
        #pump at 0
        else:
            #temp decreasing
            if(self.afsHotLegTemp < self.oldAfsHotLegTemp):
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
            #temp increase
            elif(self.afsHotLegTemp > self.oldAfsHotLegTemp):
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .02)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .018)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .015)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .012)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0009)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0007)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0005)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0003)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0002)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .0001)
                else: 
                    self.afsHiddenTemp = self.afsHiddenTemp + (self.afsHiddenTemp * .00007)
            #Temp staying same
            else:
                self.afsHiddenTemp = self.afsHiddenTemp
                
        """
        proof of calc
        afsHidden = 500
        MWPower = 650
        pump = 2
        
        self.afsHiddenTemp = self.afsHiddenTemp - (self.afsHiddenTemp * .07)
        
         = 500 - (500 * .07) = 465
        """

    def _xferSteamToCondenser(self):  
        condenserHeatExchange = ((self.afsHiddenTemp - self.csColdLegTemp) / self.thermalCon)
        tempChange = ((condenserHeatExchange / (self.waterMass[self.towerPumps] * self.heatCapacity)) * 200)
        
        #temp increasing
        if (self.afsHiddenTemp > self.oldAfsHiddenTemp): 
            self.csHotLegTemp = (self.csColdLegTemp + tempChange)
            self.afsColdLegTemp = self.afsColdLegTemp + tempChange
        #temp decreasing
        elif(self.afsHiddenTemp > self.oldAfsHiddenTemp): 
            self.csHotLegTemp = (self.csColdLegTemp - tempChange)
            self.afsColdLegTemp = self.afsColdLegTemp - tempChange
        #temp staying same
        else:
            self.csHotLegTemp = self.csHotLegTemp
            self.afsColdLegTemp = self.afsColdLegTemp
            
            """
            proof of calc
            afsHidden = 500
            csColdLeg = 65
            thermalCon = .58
            pumps = 2
            heat cap = 4.19
            
            conHeatEx = (500 - 65) / .58 = 750
            tempChange = ((750 / (2000 * 4.19)) * 200) = 17.9
            
            newCsHotLegTemp = 65 + 17.9 = 82.9
            afsColdLegTemp = 463 + 17.9 = 480.9
            """
        
        #relationship between cs hot leg, tower cooling, and cs cold leg
    def _xferToTower(self):
        if (self.towerPumps == 2): #pumps at 2
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .3)
        elif (self.towerPumps == 1): #pumps at 1
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .2)
        else: #pumps at 0
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .1)
        """proof of calc
        towerPump =2
        csColdLeg = 65
        csHotLeg = 94
        
        assume hot leg is getting cooler.
        csCold = 94 - (94 * .4) = 56.4
        """
    #TODO:Make sure earthquake logic works
    #TODO: Does an earthquake do something to their services (open a vulnerability)? Does it stop them from gathering defense flags from that service? 
    def _getEarthQuake(self):
        magicNumber = random.randrange(0, (500000 - (self.risk * 300)), 1)
        if magicNumber == 69:
            #print"EarthQuake!" #prolly won't need these prints.
            self.earthquake = True
            self._earthquakeDamage()
        else:
            #print"Safe!" #prolly won't need these prints.
            self.earthquake = False
            
    #TODO: Does an earthquake do something to their services (open a vulnerability)? Does it stop them from gathering defense flags from that service? 
    #TODO: determine how earthquake will effect game.  Invisible alteration to calculation (regular scram), disable user movement?, visible damage and point deduction every x seconds?
    def _earthquakeDamage(self):
        #There are 9 places that can be damaged.  This chooses which 1 to destroy
        destroy = random.randrange(1, 9, 1)
        
        #Rod Destruction
        if (destroy == 1):
            self.rodlevel = 9
            #disable rod movement?
        #Reactor Pump Destruction
        elif (destroy == 2):
            self.reactorPumps = 0
            #disable reactorPump arrows
        #HPI valve Destruction
        elif (destroy == 3):
            self.hpiValve = False #TODO: Should I just leave this in its current state? or should I turn it on, or should I turn it off?
            #disable hpiValve from opening or shutting
        #HPI pump Destruction
        elif (destroy == 4):
            self.hpiPump = 0 #TODO: Should I turn it on or off? depends on what I decide to do with valve. On makes their tank drain, but off makes them more likely to overheat.
            #disable hpiPump arrows
        #Pressurizer valve Destruction
        elif (destroy == 5):
            self.pressuizerValve = False
            #disable pressurizerValve
        #Con Pump Destruction (The one on the secondary (afs) loop)
        elif (destroy == 6):
            self.conPumps = 0
            #disable conPumps
        #afs valve Destruction (the tank under afs loop)
        elif (destroy == 7):
            self.afsValve = False
            #disable afsValve
        #afs Pump Destruction (the tank under afs loop)
        elif (destroy == 8):
            self.afsPumps = 0
            #disable afsPump
        #tower pump destruction
        elif (destroy == 9):
            self.towerPumps = 0
            #disable towerPump
            
    def getEarthquake(self):
        return self.earthquake
    
    def _calcRisk(self): #if there is no meltdown or scram risk can go up to 1440 by end of 24 hours just based on time
        if self.elapsedTime >= 60 and self.elapsedTime % 60 == 0:
            self.risk += 1
            
        if self.generatorMWH > 1000 and self.generatorMWH % 1000 == 0:
            self.risk += 1
    #call every 20 minutes.      
    def _restoreWorkers(self):
            self.workers += 5
            
    def _meltDown(self):
        self.generatorMWH = self.generatorMWH * .9 #TODO: figure out an appropriate amount of points to lose. How will MWH affect actual score.
        self._reset()
        
    #If there is a meltdown reset all the things!
    def _reset(self):
        self.rodLevel = 9
        self.reactorTemp = 653
        self.rcsColdLegTemp = 561
        self.rcsHotLegTemp = 603
        self.reactorPumps = 4
        self.afsColdLegTemp = 463
        self.afsHotLegTemp = 593
        self.afsPumps = 0
        self.afsHiddenTemp = 500
        self.generatorMW = 999
        self.csColdLegTemp = 65
        self.csHotLegTemp = 94
        self.risk = 0
        self.conPumps = 2
        self.hpiPump = 0
        self.towerPumps = 2
        self.workers = 80
        self.boilingTemp = 657
        self.rcsPressure = 2294
        self.elapsedTime = 0
        self.rcsPressure = 2294
        self.boilingTemp = 657
        #TODO:Reset valves to off
        #TODO:Reset water levels.
        #TODO: Reset Positions of moving dots?
    

        
    def cryptXOR(self, s, key="\x1027"):
        # TODO: save me for later.
        output = ""
        for character in s:
            for letter in key:
                character = chr(ord(character) ^ ord(letter))
            output += character
        return output
 
 
    def poll(self):
        # self.display()
        # return self.generatorMWH
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
        
    def setRod(self, level):
        self.rodLevel = level
        
    def setValve(self, valveid, state):
        if valveid == 'afs':
            self.afsValve = state
        if valveid == 'hpi':
            self.hpiValve = state
        
    def setPump(self, pumpid, level):
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
        print "Sim Time: %s" % (str(self.elapsedTime))
        print "RCS Reactor Temp: %s" % (str(self.reactorTemp))
        print "RCS Reactor Residual Temp: %s" % (str(self.reactorResidualTemp))
        print "RCS Hot Leg Temp: %s" % (str(self.rcsHotLegTemp)) 
        print "RCS Cold Leg Temp: %s" % (str(self.rcsColdLegTemp))
        print "AFS Hot Leg Temp: %s" % (str(self.afsHotLegTemp))  
        print "Gen MW: %s" % (str(self.generatorMW))
        print "Gen MWH: %s" % (str(self.generatorMWH))
        print "AFS Hot Leg after Gen: %s" % (str(self.afsHotLegTemp))
        print "AFS Cold Leg Temp: %s" % (str(self.afsColdLegTemp))
        print "CS Hot Leg Temp: %s" % (str(self.csHotLegTemp))
        print "CS Cold Leg Temp: %s" % (str(self.csColdLegTemp))  
        
        
                
    def update(self):
        # increment game tick one second
        self.elapsedTime += 1       
        # get temps from last game tick
        self._previousTemp()
        # make some energy; which is heat and
        self._energyProduction()
        # xfer the heat from the reactor to the RCS water high side
        self._xferEnergyToRcsLoop() 
        # run thru the steam gen and xfer energy to AFS
        self._xferEnergyToAfs()
        # then run the steam thru the generator
        self._xferSteamToGen()
        # then pass the steam to the condenser
        self._xferSteamToCondenser()
        # then on to the tower
        self._xferToTower()
        #update risk for earthquakes
        self._calcRisk()
        #Check for eathquake
        if (self.risk >= 1):
            self._getEarthQuake()
        #Restore workers every 20 minutes. (1200 game ticks (sec))
        if (self.elapsedTime >= 1200) and (self.elapsedTime % 1200 == 0):
            self._restoreWorkers()
        #Meltdown or Scram. Decrease points. Reset everything.
        if (self.reactorTemp > 5000):
            self._meltDown()
        # self.display()
            
            
            
            
