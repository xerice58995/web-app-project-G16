import pymysql
from flask import current_app, g

def get_db():
    """
    取得當前請求的資料庫連線。
    如果 g (global) 中沒有連線，就建立一個新的。
    """
    if 'db' not in g:
        g.db = pymysql.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB'],
            cursorclass=pymysql.cursors.DictCursor # 讓我們得到 dict 格式的結果
        )
    return g.db

def close_db(e=None):
    """
    在請求結束時，關閉資料庫連線。
    """
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    """
    將 'close_db' 註冊到 Flask app，使其在
    teardown (請求結束) 時被自動呼叫。
    """
    app.teardown_appcontext(close_db)