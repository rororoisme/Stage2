from flask import *
import json
import mysql.connector
import jwt
import datetime


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True


# 建立資料
# 建立資料庫連線
def get_conn():
    db_connection= mysql.connector.connect(
        user="root",
        password="mynewpassword",
        host="localhost",
        database="taipei"
    )
    return db_connection


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# 註冊一個新的會員 /api/user (POST)
@app.route("/api/user", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        username = data.get("name")
        email = data.get("email")
        password = data.get("password")

        con = get_conn()
        cursor = con.cursor()
        cursor.execute("SELECT * FROM MEMBERS WHERE EMAIL = %s",(email,))
        result = cursor.fetchall()

        #print(result)
        if len(result) <1:
            cursor.execute("INSERT INTO MEMBERS(NAME, EMAIL, PASSWORD) VALUES(%s, %s, %s)", (username, email, password))
            con.commit()
            cursor.close()
            con.close()
            return jsonify({
                "ok": True,
            }), 200
        
        else:
            cursor.close()
            con.close()
            return jsonify({
                "error": True,
                "message": "註冊失敗，重複的Email或其他原因"
            }), 400

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({
            "error": True,
            "message": str(e)
        }), 500
    
    finally:
        cursor.close()
        con.close()


# 取得當前當入的會員資訊 /api/user/auth (GET)
@app.route("/api/user/auth", methods=["GET"])
def checkUserStatus():
    authorizationHeaders = request.headers.get("Authorization")
    # "bearer " + token字串

    try:
        if authorizationHeaders is None or  len(authorizationHeaders.split(" ")) < 2:
            return jsonify({
                "data": None
            }), 200

        token = authorizationHeaders.split(" ")[1]
        if token is None or token == "":
            return jsonify({
                "data": None
            }), 200
        
        payload = jwt.decode(token, "secret", algorithms="HS256")
        print(payload)

        email = payload["email"]
        con = get_conn()
        cursor = con.cursor()
        cursor.execute("SELECT * FROM MEMBERS WHERE EMAIL = %s",(email,))
        user_data = cursor.fetchone()
        print(user_data)
       
        # 拿取Token中的過期時間
        token_exp = payload.get("exp")
        current_time =  datetime.datetime.utcnow()

        if token_exp is not None and current_time > datetime.datetime.fromtimestamp(token_exp):
            return jsonify({
                "message": "Token已過期"
            }), 401
        
        else: 
            userDataDict = {
                "id": user_data[0],
                "name": user_data[1],
                "email": user_data[2]
            }
            return jsonify({
                "data": userDataDict
            }), 200
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return jsonify({
            "error": True,
            "message": str(e)
        }), 500


# 登入會員帳戶 /api/user/auth (PUT)
@app.route("/api/user/auth", methods=["PUT"])
def login():
    try:
        data = request.get_json()
        print(data)
        email = data.get('email')
        password = data.get('password')

        con = get_conn()
        cursor = con.cursor()
        cursor.execute("SELECT * FROM MEMBERS WHERE EMAIL = %s AND PASSWORD = %s",(email, password))
        result = cursor.fetchall()
        print(result)
        
        if len(result)> 0:
            # 設定JWT的有效期限
            expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=7)
            # 生成JWT Token
            token = jwt.encode({"email": email, "exp": expiration_time}, "secret", algorithm="HS256")

            return jsonify({
                "token": token,
            }), 200
        
        else:
            return jsonify({
                "error": True,
                "message": "登入失敗，帳號或密碼錯誤或其他原因"
            }), 400
    except Exception as e:
        return jsonify ({
            "error": True,
            "message": str(e)
        }), 500
    
    finally:
        cursor.close()
        con.close()

# 取得景點資料列表 /api/attractions (GET)
@app.route("/api/attractions")
def get_attractions():
    pageStr = request.args.get("page")
    keyword = request.args.get("keyword")

    # 伺服器內部錯誤 (StatusCode:500)
    if pageStr is None and keyword is None:
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    # 不給定關鍵字 (StatusCode:200)
    elif keyword is None:
        page = int(pageStr)
		
        conn = get_conn()
        cursor = conn.cursor()

        # 為了預防 SQL injection, 不要直接將變數嵌入到SQL搜尋字符
        # select_query = """
        # select _id, name, CAT, description, address, direction, MRT, latitude, longitude, file 
        # from taipei 
        # limit 12 offset {};
        # """

        #select_query = select_query.format((page)*12)

        select_query = """
        SELECT _id, name, CAT, description, address, direction, MRT, latitude, longitude, file 
        FROM taipei 
        LIMIT %s OFFSET %s;
        """
    
        limit = 12
        offset = page * limit 


        cursor.execute(select_query, (limit + 1, offset))
        db_result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        data = []
        for i in db_result :
            result = {
                  "id": i[0],
                  "name": i[1],
                  "category": i[2],
                  "description": i[3],
                  "address": i[4],
                  "transport": i[5],
                  "mrt": i[6],
                  "lat": i[7],
                  "lng": i[8],
                  "images": []
            }
           
            # 處理images欄位
            imgStr = i[9]
            # 依照http切割成list
            imgList = imgStr.split("http")
            for i in imgList:
                if i != "":
                    # 統一小寫 + 挑選jpg,png字串內容
                    if "jpg" in i.lower() or "png" in i.lower():
                        # 加回http字串, 處理第一個切割點會是空的內容
                        result["images"].append("http" + i)

            data.append(result) 
        # 防止無限讀取nextPage
        if (len(data) < 13):
            response = {"nextPage":None,"data":data}
        else:
            response = {"nextPage":page + 1,"data":data[0:12]}
        
        return response, 200   
    # 給定關鍵字 (StatusCode:200)
    else:
        page = int(pageStr)
		
        conn = get_conn()
        cursor = conn.cursor()
    
        #select_query = """
        #select _id, name, CAT, description, address, direction, MRT, latitude, longitude, file 
        #from taipei 
        #where MRT LIKE "%{}%" OR name LIKE "%{}%" 
        #limit 12 offset {};
        #"""

        #select_query = select_query.format(keyword, keyword, (page)*12)
        #cursor.execute(select_query)  
        #db_result = cursor.fetchall()

        keyword = '%' + keyword + '%'
       
        select_query = """
        SELECT _id, name, CAT, description, address, direction, MRT, latitude, longitude, file 
        FROM taipei 
        WHERE MRT LIKE %s OR name LIKE %s
        LIMIT %s OFFSET %s
        """
        
        limit = 12
        offset = page * limit
        cursor.execute(select_query, (keyword, keyword, limit+1, offset))
        db_result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        data = []
        for i in db_result :
            result = {
                  "id": i[0],
                  "name": i[1],
                  "category": i[2],
                  "description": i[3],
                  "address": i[4],
                  "transport": i[5],
                  "mrt": i[6],
                  "lat": i[7],
                  "lng": i[8],
                  "images": []
            }
           
            # 處理images欄位
            imgStr = i[9]
            # 依照http切割成list
            imgList = imgStr.split("http")
            for i in imgList:
                if i != "":
                    # 統一小寫 + 挑選jpg,png字串內容
                    if "jpg" in i.lower() or "png" in i.lower():
                        # 加回http字串, 處理第一個切割點會是空的內容
                        result["images"].append("http" + i)

            data.append(result) 
        if (len(data) <13):
            response = {"nextPage":None, "data":data}
        else:
            response = {"nextPage":page+1,"data":data[0:12]}
        return response, 200


# 根據景點編號取得景點資料 /api/attraction/{attractionId} (GET)
@app.route("/api/attraction/<string:attractionIdStr>")
def get_attraction(attractionIdStr):
    try:
        attractionId = int(attractionIdStr)
        # 景點編號不正確 (StatusCode:400)
        if attractionId <1 or attractionId >58 :
            return {"error": True, "message": "景點編號不正確"}, 400    
        # 景點資料 (StatusCode:200)
        else:
            conn = get_conn()
            cursor = conn.cursor()
            
            select_query = """
            select _id, name, CAT, description, address, direction, MRT, latitude, longitude, file from taipei where _id = %s;
            """
            cursor.execute(select_query, (attractionId, ))  
            db_result = cursor.fetchall()
            cursor.close()
            conn.close()
        
            i = db_result[0]
            result = {
                    "id": i[0],
                    "name": i[1],
                    "category": i[2],
                    "description": i[3],
                    "address": i[4],
                    "transport": i[5],
                    "mrt": i[6],
                    "lat": i[7],
                    "lng": i[8],
                    "images": []
            }
    
            # 處理images欄位
            imgStr = i[9]
            # 依照http切割成list
            imgList = imgStr.split("http")
            for i in imgList:
                if i != "":
                    # 統一小寫 + 挑選jpg,png字串內容
                    if "jpg" in i.lower() or "png" in i.lower():
                        # 加回http字串, 處理第一個切割點會是空的內容
                        result["images"].append("http" + i)

                
            response = {"data": result}
            return response, 200    
    # 伺服器內部錯誤 (StatusCode:500)
    except Exception as e:
        print(str(e))
        return {"error": True, "message": "伺服器內部錯誤"}, 500


# 取得捷運站名稱列表 /api/mrts (GET)
@app.route("/api/mrts")
def get_mrts():
    try:
        conn = get_conn()
        cursor = conn.cursor()
        
        select_query = """
        select MRT from taipei group by MRT order by count(MRT) desc;
        """
        cursor.execute(select_query)  
        db_result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        data = []
        for i in db_result:
            if i[0] is not None:
                data.append(i[0])

        response = {"data": data}
        return response, 200 
    
    except Exception as e:
        print(str(e))
        return {"error": True, "message": "伺服器內部錯誤"}, 500


app.run(host="0.0.0.0", port=3000)
