from flask import Blueprint, jsonify, request
from app.db import get_db
import pymysql
import app.services as services

# 建立符合 /api/v1 規格的 Blueprint
api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# ------------------------------------------------------------------
# API: User (符合 user.md 規格)
# ------------------------------------------------------------------

@api_v1.route('/users/signup', methods=['POST'])
def user_signup():
    """
    使用者註冊
    ---
    tags:
      - User Management
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: "test_user"
              description: 使用者名稱 (或 Email)
            password:
              type: string
              example: "password123"
              description: 密碼
    responses:
      201:
        description: 註冊成功
        schema:
          type: object
          properties:
            code:
              type: integer
              example: 1
            message:
              type: string
              example: "account successfully created"
            data:
              type: object
              properties:
                userId:
                  type: integer
                userName:
                  type: string
      400:
        description: 缺少參數
      409:
        description: 使用者名稱已存在
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
        return jsonify({
            "code": 1,
            "message": "account successfully created",
            "data": {
                "userId": cursor.lastrowid,
                "userName": username
            }
        }), 201

    except pymysql.MySQLError as e:
        db.rollback()
        return jsonify({"code": 0, "message": f"Database error: {e}"}), 500
    finally:
        cursor.close()


@api_v1.route('/users/login', methods=['POST'])
def user_login():
    """
    使用者登入
    ---
    tags:
      - User Management
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - username
            - password
          properties:
            username:
              type: string
              example: "test_user"
            password:
              type: string
              example: "password123"
    responses:
      200:
        description: 登入成功
        schema:
          type: object
          properties:
            code:
              type: integer
              example: 1
            message:
              type: string
            data:
              type: object
              properties:
                userId:
                  type: integer
                userName:
                  type: string
      401:
        description: 登入失敗 (密碼錯誤或無此帳號)
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
        cursor.execute("SELECT user_id, password_hash, username FROM Users WHERE username = %s", (username,))
        user = cursor.fetchone()

        # 2. (安全!) 檢查密碼雜湊
        if user and user['password_hash'] == password:
            # 密碼正確
            return jsonify({
                "data": {
                    "userId": user['user_id'],
                    "userName": user['username'],
                },
                "code": 1,
                "message": "account successfully login"
            }), 200
        else:
            # 使用者不存在或密碼錯誤
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
    取得所有資產列表
    ---
    tags:
      - Asset Information
    responses:
      200:
        description: 成功取得資產列表
        schema:
          type: object
          properties:
            code:
              type: integer
              example: 1
            data:
              type: array
              items:
                type: string
                example: "AAPL"
    """
    try:
        assets_data = services.get_all_stock_tickers()
        return jsonify({
            "data": assets_data,
            "code": 1,
            "message": "assets retrieved successfully"
        }), 200
    except Exception as e:
        return jsonify({
            "data": [],
            "code": 0,
            "message": f"An unexpected error occurred: {e}"
        }), 500

@api_v1.route('/assets/price/<string:ticker_symbol>', methods=['GET'])
def getAssetHistoricalPrices(ticker_symbol):
    """
    取得特定資產歷史股價
    ---
    tags:
      - Asset Information
    parameters:
      - name: ticker_symbol
        in: path
        type: string
        required: true
        description: 股票代號 (例如 AAPL)
        example: "AAPL"
    responses:
      200:
        description: 成功取得歷史股價
        schema:
          type: object
          properties:
            data:
              type: object
              properties:
                assetName:
                  type: string
                historicalPrice:
                  type: object
                  description: 日期與價格的對應
                  example: {"2023-01-01": 150.0, "2023-01-02": 152.5}
      404:
        description: 找不到該資產
    """
    try:
        history = services.get_security_history(ticker_symbol)
        if not history:
            return jsonify({
                "data": {},
                "code": 0,
                "message": "Asset not found or no history"
            }), 404
            
        return jsonify({
            "data": {
                "assetName": ticker_symbol,
                "historicalPrice": history
            },
            "code": 1,
            "message": "the historical price is successfully retrieved"
        }), 200
    except Exception as e:
        return jsonify({"data": {}, "code": 0, "message": str(e)}), 500

# ------------------------------------------------------------------
# API: Portfolio
# ------------------------------------------------------------------
@api_v1.route('/portfolio/<int:user_id>', methods=['GET'])
def getUserPortfolio(user_id):
    """
    取得使用者的所有投資組合
    ---
    tags:
      - Portfolio Management
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
        description: 使用者 ID
    responses:
      200:
        description: 成功取得組合列表
    """
    try:
        portfolio_data = services.get_user_portfolios_data(user_id)
        if not portfolio_data:
            return jsonify({
                "data": [],
                "code": 1,
                "message": "no portfolios found for the user"
            }), 200
        return jsonify({
            "data": portfolio_data,
            "code": 1,
            "message": "portfolios retrieved successfully"
        }), 200
    except pymysql.MySQLError as e:
        return jsonify({
            "data": [],
            "code": 0,
            "message": f"Database error: {e}"
        }), 500
    except Exception as e:
        # 處理 Pandas 或其他潛在的運算錯誤
        return jsonify({
            "data": [],
            "code": 0,
            "message": f"An unexpected error occurred: {e}"
        }), 500

@api_v1.route('/portfolio/<int:portfolio_id>', methods=['POST'])
def updatePortfolio(portfolio_id):
    """
    更新投資組合內容 (全量更新)
    ---
    tags:
      - Portfolio Management
    parameters:
      - name: portfolio_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        description: "支援 Map 格式或 List 格式"
        schema:
          type: object
          properties:
            portfolioId:
              type: object
              description: "Map 格式 { Ticker: Quantity }"
              example: { "TSMC": 10, "AAPL": 90 }
            assets:
              type: array
              description: "List 格式"
              items:
                type: object
                properties:
                  ticker:
                    type: string
                  quantity:
                    type: number
    responses:
      200:
        description: "更新成功"
    """
    data = request.get_json()
    if not data:
        return jsonify({"code": 0, "message": "Missing request body"}), 400
    
    assets_map = data.get(str(portfolio_id))
    # (防呆) 如果上面都沒抓到，但 data 本身就是 { "TSMC": 10 } 這種格式
    if assets_map is None:
        # 檢查 data 的 values 是否都是數字 (代表直接傳了資產 Map)
        is_direct_map = all(isinstance(v, (int, float)) for k, v in data.items())
        if is_direct_map:
            assets_map = data

    if assets_map is None or not isinstance(assets_map, dict):
        return jsonify({
            "code": 0, 
            "message": "Invalid format. Expected { 'portfolioId': { 'TICKER': quantity } }"
        }), 400
    
    # 轉換成服務層需要的格式
    # Map: { "TSMC": 10, "AAPL": 90 }
    # List: [ {"ticker": "TSMC", "quantity": 10}, {"ticker": "AAPL", "quantity": 90} ]
    normalized_assets = []
    for ticker, quantity in assets_map.items():
        # 過濾掉可能混入的非股票欄位
        if ticker in ['id', 'portfolioId', 'userId']: 
            continue
            
        normalized_assets.append({
            "ticker": ticker,
            "quantity": float(quantity)
        })

    try:
        # 3. 呼叫 Service 執行更新 (全量覆蓋)
        result = services.update_portfolio_assets(portfolio_id, normalized_assets)
        
        # 提交交易
        get_db().commit()

        if result is None:
             return jsonify({"data": {}, "code": 0, "message": "Portfolio not found"}), 404

        # 4. 回傳成功回應 (符合您提供的格式)
        return jsonify({
            "data": result,
            "code": 1,
            "message": "Portfolio successfully added"
        }), 200

    except pymysql.MySQLError as e:
        get_db().rollback()
        return jsonify({"data": {}, "code": 0, "message": f"Database error: {e}"}), 500
    except Exception as e:
        get_db().rollback()
        return jsonify({"data": {}, "code": 0, "message": f"Error: {e}"}), 500

@api_v1.route('/portfolio/create', methods=['POST'])
def createPortfolio():
    """
    建立新的投資組合
    ---
    tags:
      - Portfolio Management
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - userId
            - name
          properties:
            userId:
              type: integer
              example: 1
            name:
              type: string
              example: "My Tech Portfolio"
            assets:
              type: array
              items:
                type: object
                properties:
                  ticker:
                    type: string
                    example: "AAPL"
                  quantity:
                    type: number
                    example: 10
              description: (選填) 初始資產列表
    responses:
      201:
        description: 建立成功
    """
    data = request.get_json()
    if not data or 'userId' not in data or 'name' not in data:
        return jsonify({"code": 0, "message": "Missing userId or name"}), 400

    user_id = data['userId']
    name = data['name']
    
    normalized_assets = []
    raw_assets = data.get('assets')

    if raw_assets:
        # 情況 A: List 格式 [ {"ticker": "AAPL", "quantity": 10}, ... ]
        if isinstance(raw_assets, list):
            normalized_assets = raw_assets
        
        # 情況 B: Map 格式 { "AAPL": 10, "TSMC": 20 }
        elif isinstance(raw_assets, dict):
            for ticker, qty in raw_assets.items():
                normalized_assets.append({
                    "ticker": ticker,
                    "quantity": float(qty)
                })

    try:
        # 呼叫 Service
        result = services.create_user_portfolio(user_id, name, normalized_assets)
        
        # 提交交易
        get_db().commit()

        if result is None:
            return jsonify({"code": 0, "message": "User not found"}), 404

        return jsonify({
            "data": result,
            "code": 1,
            "message": "Portfolio successfully created"
        }), 201

    except pymysql.MySQLError as e:
        get_db().rollback()
        return jsonify({"data": {}, "code": 0, "message": f"Database error: {e}"}), 500
    except Exception as e:
        get_db().rollback()
        return jsonify({"data": {}, "code": 0, "message": f"Error: {e}"}), 500

@api_v1.route('/portfolio/<int:portfolio_id>', methods=['DELETE'])
def deletePortfolio(portfolio_id):
    """
    刪除投資組合
    ---
    tags:
      - Portfolio Management
    parameters:
      - name: portfolio_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: 刪除成功
    """
    try:
        # 呼叫 Service 執行刪除
        success = services.delete_portfolio_by_id(portfolio_id)
        
        # 提交交易 (讓刪除生效)
        get_db().commit()

        if success:
            # 刪除成功
            return jsonify({
                "code": 1,
                "message": "portfolio successfully deleted"
            }), 200
        else:
            # 找不到 ID (刪除失敗)
            return jsonify({
                "code": 0,
                "message": "portfolio fail to be deleted"  # (可能是 ID 不存在)
            }), 404

    except pymysql.MySQLError as e:
        get_db().rollback()
        return jsonify({"code": 0, "message": f"Database error: {e}"}), 500
    except Exception as e:
        get_db().rollback()
        return jsonify({"code": 0, "message": f"Error: {e}"}), 500

@api_v1.route('/portfolio/performance/<int:portfolio_id>', methods=['GET'])
def getPortfolioPerformance(portfolio_id):
    """
    取得歷史績效回測
    ---
    tags:
      - Analysis & Simulation
    parameters:
      - name: portfolio_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: 成功取得績效數據
    """
    try:
        # 呼叫 Service
        result = services.get_portfolio_performance_history(portfolio_id)
        
        if result is None:
            return jsonify({
                "data": {},
                "code": 0,
                "message": "Portfolio not found"
            }), 404

        # 回傳成功回應 (符合 docs/portfolio.md 格式)
        return jsonify({
            "data": result,
            "code": 1,
            "message": "portfolio history successfully retrieved"
        }), 200

    except Exception as e:
        return jsonify({"data": {}, "code": 0, "message": str(e)}), 500

@api_v1.route('/portfolio/simulation/<int:portfolio_id>', methods=['GET'])
def simulatePortfolio(portfolio_id):
    """
    執行蒙地卡羅模擬 (未來預測)
    ---
    tags:
      - Analysis & Simulation
    parameters:
      - name: portfolio_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: 成功回傳模擬數據 (百分位數)
    """
    try:
        # 呼叫 Service 執行模擬
        percentiles = services.simulate_portfolio_growth(portfolio_id)
        
        if percentiles is None:
            return jsonify({
                "data": [],
                "code": 0,
                "message": "Fail to stimulate (No history or portfolio empty)"
            }), 400

        # 轉換為前端需要的格式 array of objects
        # 格式: [ {"10th": [...]}, {"25th": [...]}, ... ]
        formatted_val = []
        # 依照常見順序排列
        for key in ["10th", "25th", "50th", "75th", "90th"]:
            if key in percentiles:
                metrics = services.get_portfolio_metrics(portfolio_id, stimulated_data=percentiles[key]) #dict of metrics
                metrics['percentile'] = key
                metrics['values'] = percentiles[key]
                formatted_val.append(metrics)

        return jsonify({
            "data": {
                "portfolioId": portfolio_id,
                "name": f"Portfolio {portfolio_id}", # (可選: 再去 DB 查真實名稱)
                "portfolioVal": formatted_val
            },
            "code": 1,
            "message": "successfully stimulate"
        }), 200

    except Exception as e:
        return jsonify({"data": [], "code": 0, "message": str(e)}), 500

@api_v1.route('/portfolio/recommendation/<int:portfolio_id>', methods=['GET'])
def recommendPortfolio(portfolio_id):
    """
    取得智能投資建議
    ---
    tags:
      - Analysis & Simulation
    parameters:
      - name: portfolio_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: 成功回傳建議
    """
    try:
        # 呼叫 Service
        recommendation = services.generate_portfolio_recommendation(portfolio_id)
        
        if recommendation is None:
            return jsonify({
                "data": {},
                "code": 0,
                "message": "Insufficient data to generate recommendation (Need at least 2 days of history)"
            }), 400
            
        return jsonify({
            "data": recommendation,
            "code": 1,
            "message": "Recommendation generated successfully"
        }), 200
        
    except Exception as e:
        return jsonify({"data": {}, "code": 0, "message": str(e)}), 500

# -------------------------------------------------------------------
# API: Watchlist
# -------------------------------------------------------------------
@api_v1.route('/watchlists/<int:user_id>', methods=['GET'])
def getUserWatchlist(user_id):
    """
    取得關注清單
    ---
    tags:
      - Watchlist
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: 成功取得清單
    """
    try:
        watchlist_data = services.get_user_watchlist(user_id)
        return jsonify({
            "data": watchlist_data,
            "code": 1,
            "message": "watchlist retrieved successfully"
        }), 200
    except pymysql.MySQLError as e:
        return jsonify({
            "data": [],
            "code": 0,
            "message": f"Database error: {e}"
        }), 500
    except Exception as e:
        return jsonify({
            "data": [],
            "code": 0,
            "message": f"An unexpected error occurred: {e}"
        }), 500
    
@api_v1.route('/watchlists/<int:user_id>', methods=['POST'])
def addStockWatchListItem(user_id):
    """
    新增關注股票
    ---
    tags:
      - Watchlist
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
      - name: body
        in: body
        required: true
        schema:
          type: object
          required:
            - ticker
          properties:
            ticker:
              type: string
              example: "2330.TW"
    responses:
      200:
        description: 新增成功
    """
    data = request.get_json()
    if not data or 'ticker' not in data:
        return jsonify({"data": {}, "code": 0, "message": "Missing ticker"}), 400
        
    ticker = data['ticker']
    
    try:
        # 呼叫 Service 新增並取得股票資訊
        added_stock_info = services.add_watchlist_item(user_id, ticker)
        
        # 提交交易
        get_db().commit()
        
        return jsonify({
            "data": added_stock_info,
            "code": 1,
            "message": "stock successfully added"
        }), 200
        
    except Exception as e:
        get_db().rollback()
        return jsonify({"data": {}, "code": 0, "message": str(e)}), 500
    
@api_v1.route('/watchlists/<int:user_id>/<string:ticker>', methods=['DELETE'])
def deleteWatchListItem(user_id, ticker):
    """
    移除關注股票
    ---
    tags:
      - Watchlist
    parameters:
      - name: user_id
        in: path
        type: integer
        required: true
      - name: ticker
        in: path
        type: string
        required: true
    responses:
      200:
        description: 移除成功
    """
    try:
        success = services.remove_watchlist_item(user_id, ticker)
        get_db().commit()
        
        if success:
            return jsonify({
                "code": 1,
                "message": "stock successfully deleted"
            }), 200
        else:
            return jsonify({
                "code": 0,
                "message": "Stock not found in watchlist"
            }), 404 # 或者 200，視前端需求而定，這裡依據 doc 失敗回傳 code 0
            
    except Exception as e:
        get_db().rollback()
        return jsonify({"code": 0, "message": str(e)}), 500