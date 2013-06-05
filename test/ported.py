"""
This is an attempt at taking the original SCAM basic code and porting to python
I am going to unwind the code a little, but preserve the orig flow
I could have implemented http://code.activestate.com/recipes/576944-the-goto-decorator/ as a goto decorator
"""
import random
mem = {} #create a dict for atari's mem map; for peeks and pokes; might need to initialize this
def peek(loc):
    return mem[loc]
def poke(loc,val):
    mem[loc] = val
    
#atari memory map init
poke(106,8000/256) #loc 106 is the num of 256 byte pages of memory

#attached devices like joystick
# joystick map values
# 15 = center stick
# 14 = up
# 13 = down
# 11 = left
# 7 = right
# 10 = top/left
# 6 = top/right
# 9 = bottom/left
# 5 = bottom/right

# stick trigger 0 = off 1 = pressed
strig = [1]
strig[0] = 0

n1 = 1
n0 = n1-n1
x=n0
y=n0
i=n0
n2=n1+n1
n3=n2+n1
n4=n3+n1
n5=n4+n1
n6=n5+n1
n7=n6+n1
n8=n7+n1
#goto 1000 this is line #2
n9=n8+n1 #this is line 1000 onward
n10=n9+n1
n14 = n7+n7
n13 = n9+n4
n15 = n9+n6
n16 = n8+n8
n18 = n9+n9
n23 = n18+n5
n24 = n23+n1
n40 = n24+n16
n50 = n5*n10
n77 = 77 
n100 = n50+n50
n256 = n16*n16
cursy=656
cursx=cursy+n1
n3000=3000
tiny = 0.03
poke(82,n1) 
alvl=n2
aStr = [n10] #orig a$ which is a string array
devx = [n10]
devy = [n10]
devset = [0,244,2446,1133,2738,2015,2886,1744,2626,1869,2953]
ulim = [None]*n10
maxx = [None]*n10 #max is a reserved word in python changed to maxx
rdng = [None]*n10
n400 = n4*n100
n64 = n4*n16
n1726 = 1726
temp = [None]*n9
tempx = [n8]
tempy = [n8]
oldtemp = [None]*n8
pmbase = n256*(peek(106)-20) #mem loc is the size of memory of 256 byte pages 
poke(928,9)
poke(930,17)
poke(934,182)
poke(935,245)
# for i in range(n1,n8):
#     tempx[i] = peek(pmbase+620+i)
#     tempy[i] = peek(pmbase+628+i)
#     temp[i] = n0
for i in range(n1,n10):
    #devx[i] = peek(959+i)
    #devy[i] = peek(969+i)
    #devset[i] = peek(979+i)
    rdng[i] = devset[i]
    poke(n77,n0)
    #ulim[i] = peek(989+i)
    maxx[i] = ulim[i]
netnrg = n0
wrkrs=n77+n3
#a = usr(pmbase+512,pmbase+4320) #usr calls a machine lang subroutine
reactorpower = 2700
tr = cursy
tp=587
ts=526
tc=95
q2 = 2684
q3=2670
q5=n16
q6=14.3
pp=2260
vp=n5
ls=67
li=ls
s1=n40
cctc=s1
s2=43.5
s3=6.2
s4=60
s5=tiny
s6=tiny
bs=n0
ip=n0
iss=n0 #is is a python reserved word changing is to iss
turbpow=953
pq=n1/n2
stbub=22000
##########fixing scope
n = None
b = None
c = None
x = None
y = None
device = None
func=None

##########

def f4():
    #skipping colors and drawtos
    #goto n5+n <- this is hopping down thru the code lines 5 - 27
    print " Hopping down by n: %s"%(str(n)) #just making sure that when we run we understand the hopping
    return
   
def f8200(): #code starting at line 8200
    if device>n4:
        #goto 8300
        #sound call
        n=func 
        b=n3
        c=n1
        if device == n10:
            b=n1
            c=n3
        #x = devx[device]+n4
        #y = devy[device]-n3
        #gosub n4
        f4()
        #goto 8290+device*n10
        memloc = 8290+device*n10
        print "Goto some mem loc: %s"%(str(memloc))
        #a=usr(pmbase+572,func)   
    if ulim[device]==n1:
        devset[device]=func
    #gosub 8540+n5*n6*device
    memloc = 8540+n5*n6*device
    print "Gosub some mem loc: %s"%(str(memloc))    
    return

for device in range(n2,n9):
    func=rdng[device] #not sure what func does
    #gosub 8200
    f8200()
device = n1
a=n2
def f8110():
    return

for func in range(n0,n9):
    #gosub 8110
    f8110()
alvl = n2
badluck = n0
#skip 3070,3080,3090
#now at 3130
for j in range(pmbase+680,pmbase+688):
    poke(j,213)
for j in range(pmbase+689, pmbase+719):
    poke(j,n0)
for i in range(n1,n8):
    #tempx[i] = peek(pmbase+620+i)
    #tempy[i] = peek(pmbase+628+i)
    oldtemp[i] = n0
b=n1
c=n3
n=n0
#x=devx[n10]+n4
#y = devy[n10]-n3
#now at 7205
#gosub n4
f4()
#now at 7210
#goto n100
#now at 100
if rdng[n1] == n0:
    reactorpower = reactorpower*0.99
h = s3*s4/(s3+s4)
a = s2*(s6+h)/(s2+s6+h)/s5
q2 = a*reactorpower/(a+n1)
q5 = reactorpower-q2
h = h/s6
q3 = h*q2/(n1+h)
a = q3*s1*s2*s3*s4/1750000
turbpow = turbpow+(a-turbpow)/n4
if turbpow > 999:
    turbpow = 999
#now at 120
q6 = q2-q3
ac = n50+q3/s4
#gosub n24
def f24():
    if strig[0] == n0:
        func = rdng[device]
        #gosub 8020
    return
f24()
aas = n50+q6/s6 #renamed as to aas python reserves as
ap = n50+q5/s5
ar = ap+reactorpower/s1
tc = tc+(ac-tc)/n24
#now at 150
ts = ts+(aas-ts)/n24
tp = tp+(ap-tp)/n24
tr = tr+(ar-tr)/n24
a = (tp/n3+n256)*vp
przrlvl = n23
pp = pp+(a-pp)/(przrlvl+n1) #can't figure out why przrlvl is not defined yet; defining it above
#now at 160
if pp>n3000:
    a = (pp-2500/2000000)
if a > bs:
    bs = a
vp = vp-pp*(1e-04*(devset[n3]+devset[n2]/n5)+bs)+n2*ip
if vp<tiny:
    vp = tiny
pq = pq+pp*devset[n3]*5.0e-05
if pq>n3:
    pq = n3
#now at 180
for i in range(n1,n8):
    oldtemp[i] = temp[i]
tcrit = round(212+33.8*pp)**0.33333
temp[n3] = tp+(tr-tp)/(n3+devset[n5]/n4)
temp[n2] = tp-(tp-ts)/(1.5+devset[n5]/n4)
temp[n4] = ts-(ts-tc)/(n6+devset[n7]/n2)
temp[n5] = temp[n3]-devset[n7]*(temp[n3]-ts)/n16
f24()
temp[n6] = tc
temp[n7] = tc-(tc-n50)/(1.3+devset[n9]/n9)
temp[n1] = tr
temp[n8] = turbpow
#now at 198
# this is the steam voiding logic
for i in range(n1,n8):
    if tr<tcrit+n2 or i == n8:
        pass
    if i/n2 == i/n2:
        print "steam voiding"
a = turbpow/n77
stbub = stbub-pp*devset[n3]*n3
if stbub < n0:
    stbub = n0
przrlvl = stbub/pp
if przrlvl > n23:
    przrlvl = n23
#now at 310
alvl = alvl+((n40-n3000*s3/tp)-alvl)/n4
if alvl<n2:
    alvl = n2
netnrg = netnrg+turbpow/144
# add the earthquake code here
#now at 350
z = n8*random.random()+n2

import pdb; pdb.set_trace()
    





















