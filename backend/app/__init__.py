from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 啟用 CORS (允許跨網域請求，這樣您的前端才能呼叫 API)
    CORS(app)

    # 註冊資料庫
    from . import db
    db.init_app(app)

    # 註冊 API 路由 (Blueprint)
    from . import routes
    app.register_blueprint(routes.api_v1)

    @app.route('/hello')
    def hello():
        return 'Hello, Investment Platform API!'

    return app