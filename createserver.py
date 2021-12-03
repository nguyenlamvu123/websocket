from http.server import BaseHTTPRequestHandler, HTTPServer
 
# HTTPRequestHandler class
class SimpleHTTP(BaseHTTPRequestHandler):
  
##server_version	Trả về version của server.
##do_HEAD()	Phương thức này cấu hình thông số head trả về.
##do_GET()	Phương thức xử lý khi có GET request gửi lên.
##do_POST()	Phương thức xử lý khi có POST request gửi lên.
##client_address	Thuộc tính này trả về tuple chứa host và port của server đang chạy.
##command	Thuộc tính này trả về kiểu của request gửi lên.
##path	Thuộc tính này trả về path của request gửi lên.
##request_version	Thuộc tính này trả về version của request hiện tại.
##headers	Thuộc tính này trả về tất tất cả những gì mà request gửi lên. 
 
  # Nhận GET request gửi lên.
  def do_GET(self):
        # SET http status trả về
        self.send_response(200)
 
        # Thiết lập header trả về
        self.send_header('Content-type','text/html')
        self.end_headers()
        # Data
        message = "Hoc Lap Trinh Tai Toidicode.com"
        # Write data dưới dạng utf8
        self.wfile.write(bytes(message, "utf8"))
        return

# cấu hình host và cổng port cho server
server_address = ('127.0.0.1', 8000)

# Khởi tạo server với thông số cấu hình ở trên.
httpd = HTTPServer(server_address, SimpleHTTP)

# Tiến hành chạy server
httpd.serve_forever()

