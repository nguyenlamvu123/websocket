#!/usr/bin/env python3

import socket
import threading

class ThreadedServer(object):
    def __init__(self, host, port):
        self.host = host# Standard loopback interface address (localhost)
        self.port = port# Port to listen on (non-privileged ports are > 1023)
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))#Phương thức bind() chỉ định socket sẽ lắng nghe với địa chỉ IP HOST trên cổng PORT

    def listen(self):
        self.sock.listen(5)
        while True:
            print("Server listening on port", self.port)
            client, address = self.sock.accept()#Phương thức accept() sẽ đưa server vào trạng thái chờ đợi
##        cho đến khi có kết nối thì sẽ trả về một tuple gồm có một socket khác dùng
##        để truyền dữ liệu qua lại với client và
##        một tuple nữa bao gồm địa chỉ ip và port của ứng dụng client.
            print('Connected by', address)
            client.settimeout(60)
            threading.Thread(target = self.listenToClient,args = (client,address)).start()

    def listenToClient(self, client, address):
        size = 1024
        while True:
            try:
                data = client.recv(size)## 1024 là số bytes mà client có thể nhận được trong 1 lần
##                Phương thức recv() sẽ đọc các byte dữ liệu có trong socket conn
##                tham số 1024 tức là mỗi lần chỉ đọc tối ta 1024 byte dữ liệu
                if data:
                    # Set the response to echo back the recieved data 
                    print('Received', repr(data))#response = data
                    z = input('to Client: ')
                    client.sendall(bytes(z, encoding='utf8'))#client.send(response)
                else:
                    raise error('Client disconnected')
            except:
                client.close()
                return False

if __name__ == "__main__":#
    ThreadedServer('127.0.0.1', 65432).listen()
##    ThreadedServer('cc.duongduhoc.com', 65432).listen()

################################################################################################
##import socket 
##
##host = 'localhost'
##port = 6767
##
##s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
##s.bind((host, port))
##s.listen(1)
##print("Server listening on port", port)
##
##c, addr = s.accept()
##
###Nhận tên file do client gửi tới
##filename = c.recv(1024)
##try:
##  f =  open(filename, 'rb')
##  content = f.read()
##  
##  # Gửi dữ liệu trong file cho client
##  c.send(content)
##  f.close()
##  
##except FileExistsError:
##  c.send("File not found") #nếu file không tồn tại bảo với client rằng "File not found"
##  
##c.close()

################################################################################################
##AF_INET là dùng IP v4
##AF_INET6 là dùng IP v6
##AF_UNIX là chỉ kết nối các ứng dụng trong một máy (không dùng mạng)
##
##SOCK_TREAM là dùng giao thức TCP
##SOCK_DGRAM là dùng giao thức UDP    
################################################################################################
##import socket
##
####HOST = 'cc.duongduhoc.com'  # Standard loopback interface address (localhost)
##HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
##PORT = 65432        # Port to listen on (non-privileged ports are > 1023)
##
##with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
##    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
##    s.bind((HOST, PORT))#Phương thức bind() chỉ định socket sẽ lắng nghe với địa chỉ IP HOST trên cổng PORT
##    s.listen(1)# 1 ở đây có nghĩa chỉ chấp nhận 1 kết nối#s.listen()
##    while True:
##        print("Server listening on port", PORT)
##        conn, addr = s.accept()#Phương thức accept() sẽ đưa server vào trạng thái chờ đợi
####        cho đến khi có kết nối thì sẽ trả về một tuple gồm có một socket khác dùng
####        để truyền dữ liệu qua lại với client và
####        một tuple nữa bao gồm địa chỉ ip và port của ứng dụng client.
##        print('Connected by', addr)
##        while True:
##            try:
##                with conn:                
##                    data = conn.recv(1024)## 1024 là số bytes mà client có thể nhận được trong 1 lần
##    ##                Phương thức recv() sẽ đọc các byte dữ liệu có trong socket conn
##    ##                tham số 1024 tức là mỗi lần chỉ đọc tối ta 1024 byte dữ liệu
##                    if not data:
##                        break
##                    print('Received', repr(data))
##                    z = input('to Client: ')
##                    conn.sendall(bytes(z, encoding='utf8'))
####                conn.sendall(data)
##            except:
##                break
