#!/usr/bin/env python3

import socket

##HOST = 'cc.duongduhoc.com'  # Standard loopback interface address (localhost)
HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65432        # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT));print('1')
    while True:
        s.listen();print('2')
        conn, addr = s.accept();print('3')
        print('Connected by', addr)
        with conn:                
                data = conn.recv(1024)#.decode()
                if not data:
                    break
                print('Received', repr(data))
                z = input('to Client: ')
                conn.sendall(bytes(z, encoding='utf8'))
##                conn.sendall(data)

##import socket
##
##s = socket.socket()
##port = 12345
##s.bind((HOST, PORT))#s.bind(('', port))
##s.listen(5)
##c, addr = s.accept()
##print ("Socket Up and running with a connection from", addr)
##while True:
##    rcvdData = c.recv(1024).decode()
##    print ("S:", rcvdData)
##    sendData = input("N: ")
##    c.send(sendData.encode())
##    if(sendData == "Bye" or sendData == "bye"):
##        break
##c.close()
