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
# API: Asset
# ------------------------------------------------------------------
@api_v1.route('/assets', methods=['GET'])
def getAssets():
    """
    API: getAssets
    取得所有資產資料
    """
    return

@api_v1.route('/assets/price/<string:ticker_symbol>', methods=['GET'])
def getAssetHistoricalPrices(ticker_symbol):
    """
    API: getAssetHistoricalPrices
    取得特定資產的歷史價格資料(過去一年)
    """
    return

# ------------------------------------------------------------------
# API: Portfolio
# ------------------------------------------------------------------
@api_v1.route('/portfolio/<int:user_id>', methods=['GET'])
def getUserPortfolio(user_id):
    """
    API: getUserPortfolio
    取得特定使用者的投資組合資料
    """
    return

@api_v1.route('/portfolio/<int:portfolio_id>', methods=['POST'])
def updatePortfolio(portfolio_id):
    """
    API: updatePortfolio
    更新特定投資組合的資料 (新增/刪除/修改 投資標的)
    """
    return

@api_v1.route('/portfolio/<int:portfolio_id>', methods=['DELETE'])
def deletePortfolio(portfolio_id):
    """
    API: deletePortfolio
    刪除特定投資組合
    """
    return

@api_v1.route('/portfolio/performance/<int:portfolio_id>', methods=['GET'])
def getPortfolioPerformance(portfolio_id):
    """
    API: getPortfolioPerformance
    取得特定投資組合的績效資料
    """
    return

@api_v1.route('/portfolio/simulation/<int:portfolio_id>', methods=['GET'])
def simulatePortfolio(portfolio_id):
    """
    API: simulatePortfolio
    模擬特定投資組合的資產配置
    """
    return

@api_v1.route('/portfolio/recommendation/<int:portfolio_id>', methods=['GET'])
def recommendPortfolio(portfolio_id):
    """
    API: recommendPortfolio
    為特定投資組合提供資產配置建議
    """
    return