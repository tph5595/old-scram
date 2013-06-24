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
    return function = s

function=output[0]
f("this is  a test")
#fo = open("./testout.txt","w")
#fo.writelines(output)