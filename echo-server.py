#!/usr/bin/env python3

import socket

##HOST = 'cc.duongduhoc.com'  # Standard loopback interface address (localhost)
HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65432        # Port to listen on (non-privileged ports are > 1023)

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind((HOST, PORT))#Phương thức bind() chỉ định socket sẽ lắng nghe với địa chỉ IP HOST trên cổng PORT
    s.listen(1)# 1 ở đây có nghĩa chỉ chấp nhận 1 kết nối#s.listen()
    while True:
        print("Server listening on port", PORT)
        conn, addr = s.accept()#Phương thức accept() sẽ đưa server vào trạng thái chờ đợi
##        cho đến khi có kết nối thì sẽ trả về một tuple gồm có một socket khác dùng
##        để truyền dữ liệu qua lại với client và
##        một tuple nữa bao gồm địa chỉ ip và port của ứng dụng client.
        print('Connected by', addr)
        while True:
            try:
                with conn:                
                    data = conn.recv(1024)## 1024 là số bytes mà client có thể nhận được trong 1 lần
    ##                Phương thức recv() sẽ đọc các byte dữ liệu có trong socket conn
    ##                tham số 1024 tức là mỗi lần chỉ đọc tối ta 1024 byte dữ liệu
                    if not data:
                        break
                    print('Received', repr(data))
                    z = input('to Client: ')
                    conn.sendall(bytes(z, encoding='utf8'))
##                conn.sendall(data)
            except:
                break 
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
