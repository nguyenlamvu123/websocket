#!/usr/bin/env python3

import socket

HOST = '127.0.0.1'  # The server's hostname or IP address
##HOST = 'cc.duongduhoc.com'  # The server's hostname or IP address
PORT = 65432        # The port used by the server

if True:#while True:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        z = input('to Server: ')
        s.sendall(bytes(z, encoding='utf8'))#(sz.encode())#
##        s.sendall(b'Hello, world')
        data = s.recv(1024)## 1024 là số bytes mà client có thể nhận được trong 1 lần
##        Phương thức recv() sẽ đọc các byte dữ liệu có trong socket conn
##        tham số 1024 tức là mỗi lần chỉ đọc tối ta 1024 byte dữ liệu

    print('Received', repr(data))
    samgiongzon = input('Enter')
##    if samgiongzon == 'exit':
##        break
    
##import socket 
##s = socket.socket()
##s.connect(("localhost", 6767)) #lắng nghe ở cổng 6767
##
###Nhập vào tên file 
##filename = input("Enter a filename ")
##
###Gửi tên file cho server
##s.send(filename.encode())
##
###Nhận được dữ liệu từ server gửi tới
##content = s.recv(1024)
##
##print(content.decode())
##s.close()

################################################################################################
##AF_INET là dùng IP v4
##AF_INET6 là dùng IP v6
##AF_UNIX là chỉ kết nối các ứng dụng trong một máy (không dùng mạng)
##
##SOCK_TREAM là dùng giao thức TCP
##SOCK_DGRAM là dùng giao thức UDP
