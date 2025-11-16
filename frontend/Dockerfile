# 1. 基礎鏡像
FROM node:20-alpine

# 2. 設定工作目錄
WORKDIR /app

# 3. 【關鍵】只複製 package.json
COPY package.json ./

# 4. 執行 npm install (現在會強制重裝)
RUN npm install

# 5. 複製所有剩餘的程式碼
COPY . .

# 6. 暴露 Vite 的 Port 5173
EXPOSE 5173

# 7. 執行 "dev" 腳本
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]