from app import create_app

app = create_app()

if __name__ == '__main__':
    # 啟動 Flask 伺服器
    # debug=True 會讓伺服器在程式碼變更時自動重啟
    app.run(debug=True, port=5000)