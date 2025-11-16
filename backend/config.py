import os

class Config:
    """Flask 設定檔 - 從環境變數讀取"""
    
    MYSQL_HOST = os.environ.get('MYSQL_HOST', '127.0.0.1')
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'password')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'investment_platform')
    MYSQL_CURSORCLASS = 'DictCursor'