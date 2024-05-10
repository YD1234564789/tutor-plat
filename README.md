# Tutor Plat

首頁
-
學生首頁
![tutor](https://github.com/YD1234564789/tutor-plat/assets/67455167/ca07a11e-55d9-4b39-98e5-81f19f9e87e2)
申請頁面
![申請](https://github.com/YD1234564789/tutor-plat/assets/67455167/16c67596-9816-4f2a-9ad6-c0528b01bbb9)
老師首頁
![老師頁面](https://github.com/YD1234564789/tutor-plat/assets/67455167/330c4a5f-0cd8-4366-97d9-25eb191bb346)

介紹
-
線上家教平台，使用者可註冊成為學生，選擇老師預約課程，也可以成為老師開課。

功能
-
- 學生
  - 註冊預設為學生身份，可選擇老師開放的課程選課，支援Google登入。  
  - 學生可以填寫「成為老師」表單，轉換成為老師身份，可自行選擇開放預約的時段及課程時長。
  - 學生可以在首頁看到老師列表、可以用關鍵字（老師名字或國家）搜尋、學生的學習時數排行榜。  
  - 學生可以在個人頁面看到預約的課程、已上過的課程（已評價及未評價）。
  - 學生可以修改個人資料，包含照片、名字、國家、自我介紹。
- 老師  
  - 老師可以在個人頁面看到已被預約的課程、學生的評價。 
  - 老師可以修改個人資料，包含照片、名字、國家、教學方式、教學時段、自我介紹。
- 管理者
  - 管理者可以在後台看到所有使用者列表，並且可以看到使用者個別詳細資料。  
  
開始使用
-
先確認已安裝 node.js 與 npm  
將專案 clone 到本地資料夾  
安裝相關套件：
```
npm install
```
建立資料庫與種子資料：
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
建立.env，設定環境變數：  
```
GOOGLE_ID=
GOOGLE_SECRET=
IMGUR_CLIENT_ID=
JWT_SECRET=
PORT=
```
啟動
```
npm run start
```
若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址
```
App is listening on port http://localhost:3000/
```


測試帳號
-
```
管理者
帳號: root@example.com  
密碼: 12345678
```
```
user1
身分: 老師
帳號: user1@example.com
密碼: 12345678
```
```
user30
身分: 學生
帳號: user30@example.com
密碼: 12345678
```
