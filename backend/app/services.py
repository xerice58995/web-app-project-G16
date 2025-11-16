import pandas as pd
from app.db import get_db

"""
這是放置所有「商業邏輯」的地方。
routes.py 只負責呼叫這裡的函數，保持 API 路由乾淨。
"""

def get_current_allocation(portfolio_id):
    """
    [功能 1] 計算目前的資產配置百分比
    """
    db = get_db()
    cursor = db.cursor()

    # 1. 取得此組合的所有「股數」
    sql_items = "SELECT ticker_symbol, quantity FROM PortfolioItems WHERE portfolio_id = %s"
    cursor.execute(sql_items, (portfolio_id,))
    items = cursor.fetchall()
    
    if not items:
        return [] # 空的資產配置

    tickers = [item['ticker_symbol'] for item in items]
    quantities = {item['ticker_symbol']: item['quantity'] for item in items}

    # 2. 取得這些股票的「最新」價格
    # (這是一個複雜的 SQL，用於取得 "每個 ticker 的最後一筆 date" 的資料)
    sql_latest_prices = f"""
        SELECT ticker_symbol, close 
        FROM HistoricalPrices h
        WHERE h.date = (
            SELECT MAX(h_inner.date) 
            FROM HistoricalPrices h_inner 
            WHERE h_inner.ticker_symbol = h.ticker_symbol
        )
        AND h.ticker_symbol IN ({','.join(['%s'] * len(tickers))})
    """
    cursor.execute(sql_latest_prices, tickers)
    latest_prices = {row['ticker_symbol']: row['close'] for row in cursor.fetchall()}

    # 3. 計算總價值和百分比
    total_value = 0
    allocation_details = []
    
    for ticker in tickers:
        price = latest_prices.get(ticker, 0)
        quantity = quantities.get(ticker, 0)
        value = float(price) * float(quantity) # 轉為 float
        
        allocation_details.append({
            'ticker': ticker,
            'quantity': float(quantity),
            'current_price': float(price),
            'current_value': value
        })
        total_value += value

    # 4. 計算百分比
    final_allocation = []
    for item in allocation_details:
        percentage = (item['current_value'] / total_value) * 100 if total_value > 0 else 0
        final_allocation.append({
            **item,
            'percentage': round(percentage, 2)
        })

    cursor.close()
    return final_allocation


def get_portfolio_performance(portfolio_id, start_date):
    """
    [功能 4] 計算資產配置的過去表現 (回測)
    """
    db = get_db()
    cursor = db.cursor()

    # 1. 取得此組合的所有「股數」
    sql_items = "SELECT ticker_symbol, quantity FROM PortfolioItems WHERE portfolio_id = %s"
    cursor.execute(sql_items, (portfolio_id,))
    items = cursor.fetchall()
    
    if not items:
        return [] # 空的資產配置

    tickers = [item['ticker_symbol'] for item in items]
    quantities = {item['ticker_symbol']: float(item['quantity']) for item in items}

    # 2. 取得「所有」相關股票的「所有」歷史價格
    sql_history = f"""
        SELECT date, ticker_symbol, adjusted_close 
        FROM HistoricalPrices
        WHERE ticker_symbol IN ({','.join(['%s'] * len(tickers))})
        AND date >= %s
        ORDER BY date ASC
    """
    cursor.execute(sql_history, [*tickers, start_date])
    history_data = cursor.fetchall()
    cursor.close()

    if not history_data:
        return [] # 沒有歷史資料

    # 3. (關鍵) 使用 Pandas 進行運算
    df = pd.DataFrame(history_data)
    
    # (a) 將資料從「長格式」轉為「寬格式」
    #      date | ticker | adj_close         date | AAPL | GOOG
    #      -------------------------  ==>  --------------------
    #      11/1 | AAPL   | 150             11/1 | 150  | 130
    #      11/1 | GOOG   | 130             11/2 | 152  | 132
    #      11/2 | AAPL   | 152
    df_pivot = df.pivot(index='date', columns='ticker_symbol', values='adjusted_close')
    
    # (b) 處理缺失值 (例如假日或某支股票停牌)，使用前一天的資料填充
    df_pivot = df_pivot.fillna(method='ffill')
    
    # (c) 移除掉一開始就沒有資料的列 (例如 5 年前 GOOG 還沒上市)
    df_pivot = df_pivot.dropna()

    if df_pivot.empty:
        return []

    # (d) 核心運算：(AAPL 價格 * 股數) + (GOOG 價格 * 股數)
    df_pivot['total_value'] = 0
    for ticker in df_pivot.columns:
        if ticker in quantities:
            df_pivot['total_value'] += df_pivot[ticker] * quantities[ticker]

    # 4. 格式化輸出
    performance = df_pivot[['total_value']].reset_index()
    performance['date'] = performance['date'].astype(str) # 將日期轉為字串
    
    return performance.to_dict('records') # 轉為 [ {'date': ..., 'total_value': ...}, ... ]