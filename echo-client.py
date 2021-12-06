#!/usr/bin/env python3

import socket

HOST = '127.0.0.1'  # The server's hostname or IP address
##HOST = 'cc.duongduhoc.com'  # The server's hostname or IP address
PORT = 65432        # The port used by the server

while True:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        z = input('to Server: ')
        s.sendall(bytes(z, encoding='utf8'))
        s.sendall(b'Hello, world')
        data = s.recv(1024)

    print('Received', repr(data))
    samgiongzon = input('Enter')
    if samgiongzon == 'exit':
        break
    
