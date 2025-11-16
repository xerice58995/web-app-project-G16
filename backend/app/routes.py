from flask import Blueprint, jsonify, request
from app.db import get_db
import pymysql

# 建立符合 /api/v1 規格的 Blueprint
api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# ------------------------------------------------------------------
# API: User (符合 user.md 規格)
# ------------------------------------------------------------------

@api_v1.route('/users/signup', methods=['POST'])
def user_signup():
    """
    API: userSignUp
    使用 username 和 password 註冊
    """
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"code": 0, "message": "Missing username or password"}), 400

    username = data['username']
    password = data['password']
    

    db = get_db()
    cursor = db.cursor()

    try:
        # 1. 檢查 username 是否已被使用
        cursor.execute("SELECT user_id FROM Users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({"code": 0, "message": "Username already exists"}), 409


        # 3. 儲存新使用者
        sql = "INSERT INTO Users (username, password_hash) VALUES (%s, %s)"
        cursor.execute(sql, (username, password))
        db.commit()

        #
        return jsonify({"code": 1, "message": "account successfully created"}), 201

    except pymysql.MySQLError as e:
        db.rollback()
        return jsonify({"code": 0, "message": f"Database error: {e}"}), 500
    finally:
        cursor.close()


@api_v1.route('/users/login', methods=['POST'])
def user_login():
    """
    API: userSignIn
    使用 username 和 password 登入
    """
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"code": 0, "message": "Missing username or password"}), 400

    username = data['username']
    password = data['password']

    db = get_db()
    cursor = db.cursor()

    try:
        # 1. 尋找使用者
        cursor.execute("SELECT user_id, password_hash FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        # 2. (安全!) 檢查密碼雜湊
        if user and user['password_hash'] == password:
            # 密碼正確
            return jsonify({
                "data": {
                    "userId": user['user_id'],
                },
                "code": 1,
                "message": "account successfully login"
            }), 200
        else:
            # 使用者不存在或密碼錯誤
            # (註: 修正您 user.md 中的錯字 "logic")
            #
            return jsonify({
                "data": {},
                "code": 0,
                "message": "account failed to be login" # (typo fixed)
            }), 401

    except pymysql.MySQLError as e:
        return jsonify({"data": {}, "code": 0, "message": f"Database error: {e}"}), 500
    finally:
        cursor.close()

# ------------------------------------------------------------------
# (之後會在這裡繼續實作其他 API)
# ------------------------------------------------------------------