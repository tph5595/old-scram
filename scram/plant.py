from __future__ import division
import random
import math
import time

"""
This is the nuke plant class

Simulation time step is 1/second!! 1 step = 1 min
"""

class Plant(object):
    
    def __init__(self, clock):
        self.clock = clock
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
        self.rcsPressure = 2294  # 2200 - 2300 is normal; above 2400 dangerous; 3000 makes leak in rcs
        self.boilingTemp = 657
        
        # Temperatures from previous run
        self.oldRcsHotLegTemp = 603
        self.oldRcsColdLegTemp = 561
        self.oldReactorTemp = 653
        self.oldAfsColdLegTemp = 463
        self.oldAfsHotLegTemp = 593
        self.oldCsHotLegTemp = 94
        self.oldCsColdLegTemp = 65
        self.oldAfsHiddenTemp = 500
        
        # Aux Feed Water System
        self.afsHotLegTemp = 593
        self.afsColdLegTemp = 463
        self.afsValve = False
        self.afsPumps = 0  # 0-2 2 max 
        self.afsTankLevel = 7  # TODO: need a max for this.
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
        self.hpiWater = 7  # HPI water level        
        
        # pressurizer
        self.pressurizerWaterLevel = 0
        self.pressurizerValve = False
      
        
        # initial value for temperature multipliers based upon pumps open
        self.hotMultiplier = [.1, .073, .053, .033, .01, .008, .007, .0058, .004]
        self.coldMultiplier = .27
        
        # Thermo-dynamics of water
        self.thermalCon = .58
        self.heatCapacity = 4.19  # Joules/grams Kelvin
        self.waterMass = [100, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]  # gallons of water being pumped through the pressure chamber based on pumps on
        
        self.earthquake = False #if magic number = 69
        self.steamVoiding = False #if reactorTemp > BoilingTemp
        self.pressureExplosion = False #if rcsPRess > 3000
        self.inMeltdown = False
        
        #initialize damage; integer to "or" in damage; to determine current damage "and" it; to remove it xor it
        # self.damage = self.damage|randomNumber <- adds damage
        # randomNumber == self.damage|randomNumber <- contains damage
        # self.damage = self.damage^randomNumber <- removes damage
        self.damage = 0
        
    #TODO:  Need to prove that this gets hotter just as frequently as colder.  Something wrong with rcsHotLegTemp
    # Relationship between reactor temp and cold leg
    def _energyProduction(self):
        # temp increase from rod energy and number of pumps open
        self.reactorTemp = self.reactorTemp + (self.energy[self.rodLevel] * self.hotMultiplier[self.reactorPumps])
        # temp decrease from coldLegTemp.
        self.reactorTemp = self.reactorTemp - ((self.reactorTemp - self.rcsColdLegTemp) * self.coldMultiplier)
        
        if self.reactorTemp < 100:
            self.reactorTemp = 100
            
        #TODO: prove these calculations work.
        """
        Proof of calculations
        
        
        """
    
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
        
        #cannot be colder than coldleg
        if self.rcsHotLegTemp < self.rcsColdLegTemp:
            self.rcsHotLegTemp = self.rcsColdLegTemp + 5
        #rcsHotLeg cannot be hotter than reactor temp
        if self.rcsHotLegTemp > self.reactorTemp:
            self.rcsHotLegTemp = self.reactorTemp - 5
       #rcsHotLeg can never be colder than 50 degrees
        if self.rcsHotLegTemp < 50:
            self.rcsHotLegTemp = 50
            """
            Cant figure out how this would work.  There would be issues if reactor temp was really high and cold leg was really small.  Hot leg could end up colder than cold leg.
            if the percents stay how they are.  Maybe put a cap on the percentage decrease at like 15%?
            
            LOOKUP ARRAY
            
            difBetween    reactorPumps    % decrease
            1 to 10            4             1
            1 to 10            3            .8
            1 to 10            2            .6
            1 to 10            1            .4
            1 to 10            0            .2
            11 to 20            4            2
            11 to 20            3            1.8
            11 to 20            2            1.6
            11 to 20            1            1.4
            11 to 20            0            1.2
            
            rcsHotLeg = reactorTemp - (reactorTemp * .01)
            
            
            
            FACTORS for Calculation
            
            difference in temperature
            rcsColdLegTemp
            reatorTemp
            water being pumped through
            
                    
            """
            
        """
        proof of old calculations
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
        
        #keep cold leg cooler than reactorTemp
        if self.rcsColdLegTemp > self.reactorTemp:
            self.rcsColdLegTemp = self.reactorTemp - 10
        #keeps it hotter than 25 degrees
        if self.rcsColdLegTemp < 25:
            self.rcsColdLegTemp = 25
        #keeps it hotter than 25 degrees
        if self.afsHotLegTemp < 25:
            self.afsHotLegTemp = 25
        #keeps afs cooler than rcsHot
        if self.afsHotLegTemp > self.rcsHotLegTemp:
            self.afsHotLegTemp = self.rcsHotLegTemp - 5
    
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
        
        if (self.steamVoiding == False):
            #generatorMW is based on steam volume or some kinda shit. Just gonna hack it to deal with hot leg temp???
            if (self.afsHotLegTemp > 200) and (self.reactorTemp > 200): #Later 200 on afsLeg will turn into the temperature at which steam occurs or something.
                self.generatorMW = self.afsHotLegTemp * 1.08 #made up a rate of increase
            else:
                self.generatorMW = 0 #it should probably gradually decrease by a rate instead of instantly becoming 0.
        else:
             if (self.afsHotLegTemp > 200) and (self.reactorTemp > 200):
                self.generatorMW = self.afsHotLegTemp * .7 #less efficient power output due to steam voiding
             else:
                self.generatorMW = 0 
        
        if self.generatorMW > 999:
            self.generatorMW = 999
            
        if self.elapsedTime % 60 == 0:
            self.generatorMWH = self.generatorMWH + (self.generatorRunningMW / 60)
            self.generatorRunningMW = 0
        else:
            self.generatorRunningMW += self.generatorMW
            
        """
        Alternate equation for AFSHiddenTemp
        
        AfsHiddenTemp = afsHotLegTemp - (afsHotLegTemp * percentDecrease)
        
        Variables Affecting
        pump rate
        energy being taken out of water (generatorMW)
        """
        
        #TODO: is this if logic right?
        if (self.conPumps == 2): #pumps at 2
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .1)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .09)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .08)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .07)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .06)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .05)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .04)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .03)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .02)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .01)
                else: 
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0001)
        elif (self.conPumps == 1): #pumps at 1
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .075)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .065)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .055)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .045)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .035)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .025)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .015)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .005)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .001)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0007)
                else: 
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .00001)
        else: #pumps at 0
                if (self.generatorMW > 900):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .02)
                elif (self.generatorMW > 800):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .018)
                elif (self.generatorMW > 700):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .015)
                elif (self.generatorMW > 600):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .012)
                elif (self.generatorMW > 500):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0009)
                elif (self.generatorMW > 400):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0007)
                elif (self.generatorMW > 300):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0005)
                elif (self.generatorMW > 200):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0003)
                elif (self.generatorMW > 100):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0002)
                elif (self.generatorMW > 1):
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .0001)
                else: 
                    self.afsHiddenTemp = self.afsHotLegTemp - (self.afsHotLegTemp * .00000007)
                    
        if self.afsHiddenTemp < 10:
            self.afsHiddenTemp = 10
       
        #debugging
        #print "afs hidden: ", self.afsHiddenTemp

    def _xferSteamToCondenser(self):  
        condenserHeatExchange = ((self.afsHiddenTemp - self.csColdLegTemp) / self.thermalCon)
        tempChange = ((condenserHeatExchange / (self.waterMass[self.towerPumps] * self.heatCapacity)) * 200)
        
        #temp increasing
        if (self.afsHiddenTemp > self.oldAfsHiddenTemp): 
            self.csHotLegTemp = (self.csColdLegTemp + tempChange)
            self.afsColdLegTemp = self.afsColdLegTemp + tempChange
        #temp decreasing
        elif(self.afsHiddenTemp < self.oldAfsHiddenTemp): 
            self.csHotLegTemp = (self.csColdLegTemp - tempChange)
            self.afsColdLegTemp = self.afsColdLegTemp - tempChange
        """
        #This section of code isn't going to do anything?
        #temp staying same
        else:
            self.csHotLegTemp = self.csHotLegTemp
            self.afsColdLegTemp = self.afsColdLegTemp
        """
      
        if self.csHotLegTemp < 3:
            self.csHotLegTemp = 3
        #keep afsCold colder than hidden
        if self.afsColdLegTemp > self.afsHiddenTemp:
            self.afsColdLegTemp = self.afsHiddenTemp - 5
            
        if self.afsColdLegTemp < 10:
            self.afsColdLegTemp = 10
            
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
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .4)
        elif (self.towerPumps == 1): #pumps at 1
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .3)
        else: #pumps at 0
            self.csColdLegTemp = self.csHotLegTemp - (self.csHotLegTemp * .06)
        """
        proof of calc
        towerPump =2
        csColdLeg = 65
        csHotLeg = 94
        
        assume hot leg is getting cooler.
        csCold = 94 - (94 * .4) = 56.4
        """
        
    def _boilAndPressure(self):
        #dun dun dun dadadundun Under Pressure!
        difference = self.reactorTemp - self.oldReactorTemp
        
        #Temp is decreasing so decrease pressure by up to 10%
        if (difference <= -99):
            self.rcsPressure = self.rcsPressure / 1.0795
        elif (difference <= -89):
            self.rcsPressure = self.rcsPressure / 1.07272725
        elif (difference <= -79):
            self.rcsPressure = self.rcsPressure / 1.06272725
        elif (difference <= -69):
            self.rcsPressure = self.rcsPressure / 1.05545455
        elif (difference <= -59):
            self.rcsPressure = self.rcsPressure / 1.04818185
        elif (difference <= -49):
            self.rcsPressure = self.rcsPressure / 1.04090915
        elif (difference <= -39):
            self.rcsPressure = self.rcsPressure / 1.03363635
        elif (difference <= -29):
            self.rcsPressure = self.rcsPressure / 1.02636365
        elif (difference <= -19):
            self.rcsPressure = self.rcsPressure / 1.01909095
        elif (difference <= -9):
            self.rcsPressure = self.rcsPressure / 1.01181825
        elif (difference <= -1):
            self.rcsPressure = self.rcsPressure / 1.0005
        #Temp is staying same
        elif (difference == 0): 
            self.rcsPressure = self.rcsPressure
        #Temp is increasing
        elif (difference <= 9):
            self.rcsPressure = self.rcsPressure * 1.00005
        elif (difference <= 19):
            self.rcsPressure = self.rcsPressure * 1.0118182
        elif (difference <= 29):
            self.rcsPressure = self.rcsPressure * 1.0190909
        elif (difference <= 39):
            self.rcsPressure = self.rcsPressure * 1.0263636
        elif (difference <= 49):
            self.rcsPressure = self.rcsPressure * 1.0336363
        elif (difference <= 59):
            self.rcsPressure = self.rcsPressure * 1.0409091
        elif (difference <= 69):
            self.rcsPressure = self.rcsPressure * 1.0481818
        elif (difference <= 79):
            self.rcsPressure = self.rcsPressure * 1.0554545
        elif (difference <= 89):
            self.rcsPressure = self.rcsPressure * 1.0627272
        elif (difference <= 99):
            self.rcsPressure = self.rcsPressure * 1.0727272
        elif (difference >= 100):
            self.rcsPressure = self.rcsPressure * 1.075
        
        #Decrease pressure by 5% every tick while valve is open. This number may need changed
        if (self.pressurizerValve == True) and (self.pressurizerWaterLevel < 7):
            self.rcsPressure = self.rcsPressure * .95
            if (self.elapsedTime % 10 == 0): #Game Exploit - tank levels only decrease every tenth second.
                self.pressurizerWaterLevel += 1
        
        #Increase pressure by 2.5% every tick while this is open. This number may need changed
        if (self.hpiValve == True) and (self.hpiPump >= 1) and (self.hpiWater > 0):
            self.rcsPressure = self.rcsPressure * 1.025
            if (self.elapsedTime % 10 == 0): #Game Exploit - tank levels only decrease every tenth second.
                self.hpiWater -= 1
                
        #Increase pressure by 2.5% every tick while this is open. This number may need changed
        if (self.afsValve == True) and (self.afsPumps >= 1) and (self.afsTankLevel > 0):
            self.rcsPressure = self.rcsPressure * 1.025
            if (self.elapsedTime % 10 == 0): #Game Exploit - tank levels only decrease every tenth second.
                self.afsTankLevel -= 1
        
        #put a low cap on pressure
        if self.rcsPressure < 1000:
            self.rcsPressure = 1000
        
        #convert to farenheight
        self.boilingTemp = self.rcsPressure * .3 #boiling temp is always 30% less than pressure.  Kind of a hack job.
        
        #Explosion in pressure tank
        if (self.rcsPressure >= 5000):
            self.pressureExplosion = True
            self.clock.callLater(5, self._reset)
            
        """
        ***Antoine equation***
        P = pressure (mmHg) ~~~Needs Converted to PSI~~~
        T = boiling temp (Celcius) ~~~Needs Converted to Farenheight~~~
        
        approx constants: (these would vary slightly in real life)
        A = 8.14019s
        B = 1810.94
        C = 244.485
        
        ***unsolved***
        log10 P = A - (B/(C+T))
        
        ***Solved for boiling point***
        T = (B / (A - log10 P)) - C
        
        ***Solved for Pressure***
        P = 10 ^ (A - (B / (C + T)))
        
        ***Conversions***
        
        C * 9/5 + 32 = F
        (F - 32) * 5/9 = C
        
        mmHg / 51.7149241024 = PSI
        PSI * 51.7149241024 = mmHg
        """
        
    #determine if steam voiding exists
    def _steamVoiding(self):
        if (self.reactorTemp > self.boilingTemp):
            self.steamVoiding = True
            #self._steamVoidingAction() #Called in update now
        else:
            self.steamVoiding = False
            
    #getter for steam voiding
    def getSteamVoiding(self):
        return self.steamVoiding
    
    #action due to steam voiding
    #Reactor Temp increases rapidly because the steam acts as an insulator.  It doesn't allow it to cool properly.
    #gonna make all the temps hotter by a percent.  Big bada-boom
    def _steamVoidingAction(self):
        #percent to increase all temps by
        percent = 1.05
        #rcsLoop
        self.reactorTemp = self.reactorTemp * percent
        self.rcsColdLegTemp = self.rcsColdLegTemp * percent
        self.rcsHotLegTemp = self.rcsHotLegTemp * percent
        
        #afsLoop
        self.afsColdLegTemp = self.afsColdLegTemp * percent
        self.afsHiddenTemp = self.afsHiddenTemp * percent
        self.afsHotLegTemp = self.afsHotLegTemp * percent
        
        #csLoop
        self.csColdLegTemp = self.csColdLegTemp * percent
        self.csHotLegTemp = self.csHotLegTemp * percent
        #MWH calculation will be called after steam voiding is set to true or false and will be changed there.
        
        
    #TODO: Does an earthquake do something to their services (open a vulnerability)? Does it stop them from gathering defense flags from that service? 
    def _getEarthQuake(self):
        self.earthquake = False
        
        if (self.risk < 10):
            size = 1000
        elif (self.risk < 20):
            size = 900
        elif (self.risk < 30):
            size = 800
        elif (self.risk < 40):
            size = 700
        elif (self.risk < 50):
            size = 600
        elif (self.risk <60):
            size = 500
        elif (self.risk <70):
            size = 400
        elif (self.risk <80):
            size = 300
        elif (self.risk <90):
            size = 200
        elif (self.risk >= 100):
            size = 100
        
        magicNumber = random.randrange(0, size, 1)
        #magicNumber = 69 #to test earthquake
        if magicNumber == 69:
            #print"EarthQuake!" #for testing
            self.earthquake = True
            self._earthquakeDamage()
        else:
            #print"Safe!" #for testing
            self.earthquake = False
            

    #TODO: Does an earthquake do something to their services (open a vulnerability)? Does it stop them from gathering defense flags from that service? 
    #TODO: determine how earthquake will effect game.  Invisible alteration to calculation (regular scram), disable user movement?, visible damage and point deduction every x seconds?
    def _earthquakeDamage(self):
        # Generate random number
        """
        else:
      self.damageArray.append(destroy)
      self.damageArray.sort()
      """
   
        destroy = random.randrange(0, 8, 1)
        #"or" in the generated damage to the current damage
        self.damage = self.damage|destroy
        
        # Do damage
        # Rod Destruction
        if (destroy == 0):
            self.rodlevel = 9
              # disable rod movement?
              
          # Reactor Pump Destruction
        elif (destroy == 1):
            self.reactorPumps = 0
              # disable reactorPump arrows
              
          # HPI valve Destruction
        elif (destroy == 2):
            self.hpiValve = False #TODO: Should I just leave this in its current state? or should I turn it on, or should I turn it off?
              # disable hpiValve from opening or shutting
              
          # HPI pump Destruction
        elif (destroy == 3):
            self.hpiPump = 0 #TODO: Should I turn it on or off? depends on what I decide to do with valve. On makes their tank drain, but off makes them more likely to overheat.
              # disable hpiPump arrows
              
          # Pressurizer valve Destruction
        elif (destroy == 4):
            self.pressurizerValve = False
              # disable pressurizerValve
              
          # Con Pump Destruction (The one on the secondary (afs) loop)
        elif (destroy == 5):
            self.conPumps = 0
              # disable conPumps
              
          # AFS Valve Destruction (the tank under afs loop)
        elif (destroy == 6):
            self.afsValve = False
              # disable afsValve
              
          # AFS Pump Destruction (the tank under afs loop)
        elif (destroy == 7):
            self.afsPumps = 0
              # disable afsPump
              
          # Tower Pump Destruction
        elif (destroy == 8):
            self.towerPumps = 0
              # disable towerPump
        
    def getEarthquake(self):
        return {'quake':self.earthquake,'damage':self.damage}
    
    def repairDamage(self,repaired):
        #just xor the damage with the repaired
        self.damage = self.damage^repaired
    
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
        self.inMeltdown = True
        self.clock.callLater(5, self._reset)
        
    #If there is a meltdown or pressure explosion reset all the things!
    #This is calledLater after meltdown or pressure explosion and causes 5 second pause
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
        
        #valves
        self.pressurizerValve = False
        self.hpiValve = False
        self.afsValve = False
        
        self.earthquake = False #This wont be needed after I make an earthquake pause.  It should reset to false immediately afterwards.
        self.steamVoiding = False
        
        #water levels
        self.afsTankLevel = 7
        self.hpiWater = 7
        self.pressurizerWaterLevel = 0
        
        #reset latches
        self.inMeltdown = False
        self.pressureExplosion = False
    
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
        if valveid == 'afsvalve':
            self.afsValve = state
        if valveid == 'hpivalve':
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
        if not (self.inMeltdown) and not (self.pressureExplosion):
            # increment game tick one second
            self.elapsedTime += 1
            #Calc boiling and pressure (this is still based on previous game tick since calcs haven't been made at this point)
            self._boilAndPressure()
            # get temps from last game tick
            self._previousTemp()
            #Check for steam voiding
            self._steamVoiding()
            # make reactor heat
            self._energyProduction()
            # xfer the heat from the reactor to the RCS water high side
            self._xferEnergyToRcsLoop() 
            # run thru the steam gen and xfer energy to AFS
            self._xferEnergyToAfs()
            # then run the steam thru the generator
            self._xferSteamToGen()
            #then pass the steam to the condenser
            self._xferSteamToCondenser()
            # then on to the tower
            self._xferToTower()
            #Increase due to SteamVoiding
            if (self.steamVoiding == True):
                self._steamVoidingAction()
                #update risk for earthquakes
            self._calcRisk()
                #Check for eathquake
            if (self.risk > 0):
                self._getEarthQuake()
            #Restore workers every 20 minutes. (1200 game ticks (sec))
            if (self.elapsedTime >= 1200) and (self.elapsedTime % 1200 == 0):
                self._restoreWorkers()
            #Meltdown or Scram. Decrease points. Reset everything.
            if (self.reactorTemp > 5000):
                self._meltDown()
            # self.display()
            
            
            
            
