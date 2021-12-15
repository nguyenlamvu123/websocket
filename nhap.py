##alltitle = {
##  "brand": "Ford",
##  "model": "Mustang",
##  "year": 1964
##}
##
###car.update({"color": "White"})
###car = dict.fromkeys(alltitle)
##
##z = list(alltitle.items())[:2]
####print(z[1][1])
##print(dict(z))
##
####alltitle.update(dict.fromkeys(['samgiongzon', 'hahahehehoho']))
####print(alltitle)

class SoPhuc:

    def __init__(self,r = 0,i = 0):
        self.phanthuc = r
        self.phanao = i
        self.diiict = []
##     def samgiongzon(self):
####         return self.phanthuc+2
##         global s
##         yield from s
    def samgiongzon(self):
        for i1 in [10, 12, 13]:
            for i in list(range(i1)):
##                self.diiict.append([i, 'số '+ str(i)])#;print(s)#yield self.diiict.append(i)#;print(s)
                self.diiict.append({str(i): 'số '+ str(i)})#;print(s)#yield self.diiict.append(i)#;print(s)
##                print('@', self.diiict)

s = SoPhuc(2, 5)
print('###', s.phanthuc)
s.samgiongzon()#for s1 in s.samgiongzon():#
    #pass#print('%', s1)#print([i for i in s.samgiongzon()])
print(s.diiict[3]['3'])##print(dict(filter(lambda x: x[0]%2 == 1, s.diiict)))#
##if not any(d['5'] == 'số 6' for d in s.diiict):
##    print('hahahehehoho')
