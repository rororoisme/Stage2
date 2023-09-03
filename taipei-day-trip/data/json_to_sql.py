import json
import mysql.connector

# 建立資料庫連線
db_connection=mysql.connector.connect(
    user="root",
    password="mynewpassword",
    host="localhost",
    database="taipei"
)

cursor = db_connection.cursor()

with open('taipei-attractions.json', 'r', encoding='utf-8') as json_file:
    json_data = json.load(json_file)

# 將json資料輸入到資料庫內
for item in json_data["result"]["results"]:
    rate = item.get("rate", None)
    direction = item.get("direction", None)
    name = item.get("name", None)
    date = item.get("date", None)
    longitude = item.get("longitude", None)
    REF_WP = item.get("REF_WP", None)
    avBegin = item.get("avBegin", None)
    langinfo = item.get("langinfo", None)
    MRT = item.get("MRT", None)
    SERIAL_NO = item.get("SERIAL_NO", None)
    RowNumber = item.get("RowNumber", None)
    CAT = item.get("CAT", None)
    MEMO_TIME = item.get("MEMO_TIME", None)
    POI = item.get("POI", None)
    file = item.get("file", None)
    idpt = item.get("idpt", None)
    latitude = item.get("latitude", None)
    description = item.get("description", None)
    _id = item.get("_id", None)
    avEnd = item.get("avEnd", None)
    address = item.get("address", None)

    # 將提取資料放到資料庫欄位
    insert_query = """
    INSERT INTO taipei (rate, direction, name, date, longitude, REF_WP, avBegin, langinfo, 
                       MRT, SERIAL_NO, RowNumber, CAT, MEMO_TIME, POI, file, idpt, 
                       latitude, description, _id, avEnd, address) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (rate, direction, name, date, longitude, REF_WP, avBegin, langinfo,
        MRT, SERIAL_NO, RowNumber, CAT, MEMO_TIME, POI, file, idpt,
        latitude, description, _id, avEnd, address)
    cursor.execute(insert_query, values)


# 更改資料庫內容並關閉連結
db_connection.commit()
cursor.close()
db_connection.close()