def cryptXOR(s, key="\x1027"):
    #TODO: save me for later.
    output = ""
    for character in s:
        for letter in key:
            character = chr(ord(character) ^ ord(letter))
        output += character
    return output

with open("./testout.txt") as f:
    content = f.readlines()

output = [cryptXOR(x) for x in content]
print content
print output

def makeFunc(s):
    #return function = s
    pass

code_global = compile('''
sum = 0
for x in xrange(500000):
    sum += x
''', '<string>', 'exec')
code_local = compile('''
def f():
    sum = 0
    for x in xrange(500000):
        sum += x
''', '<string>', 'exec')

def test_global():
    exec code_global in {}

def test_local():
    ns = {}
    exec code_local in ns
    ns['f']()

function=output[0]
f("this is  a test")
#fo = open("./testout.txt","w")
#fo.writelines(output)