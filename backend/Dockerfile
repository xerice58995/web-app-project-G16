# 1. 使用官方 Python 鏡像
FROM python:3.10-slim

# 2. 設定工作目錄
WORKDIR /app

# 3. 安裝系統依賴 (mysqlclient 需要)
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# 4. 複製並安裝 requirements.txt
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 5. 複製所有後端程式碼
COPY . .

# 6. (不需要 CMD) docker-compose.yml 會使用 Flask 的 dev server
#    Flask 預設在 5000 Port