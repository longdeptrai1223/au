AuMiner - Ứng dụng đào Au Coin
Ứng dụng mô phỏng đào Au với chu kỳ 24 giờ, hệ thống giới thiệu +10% mỗi người (tối đa 20 người), quảng cáo AdMob thật +200% trong 2 giờ, và đầy đủ tính năng PWA.

Tính năng chính
🔄 Chu kỳ đào 24 giờ: Mỗi ngày người dùng nhận được 0.1 Au
👥 Hệ thống giới thiệu: +10% tốc độ đào cho mỗi người được giới thiệu (tối đa 20 người = +200%)
📱 Tích hợp AdMob: Xem quảng cáo để nhận +200% tốc độ đào trong 2 giờ
📱 Progressive Web App (PWA): Cài đặt được trên thiết bị di động như ứng dụng native
🔒 Xác thực qua Google: Đăng nhập an toàn bằng tài khoản Google
📊 Theo dõi tiến trình: Giao diện trực quan hiển thị tiến trình đào và các hoạt động
Cài đặt và Chạy ứng dụng
Yêu cầu hệ thống
Node.js 18+
PostgreSQL database (sử dụng Neon PostgreSQL)
Tài khoản Firebase
Tài khoản Google AdMob (cho quảng cáo)
Cài đặt
Clone repository:

git clone <repository_url>
cd auminer
Cài đặt các thư viện phụ thuộc:

npm install
Tạo file .env ở thư mục gốc với nội dung:

# Firebase configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
# Database configuration
DATABASE_URL=your_neon_postgres_connection_string
# AdMob configuration
VITE_ADMOB_APP_ID=your_admob_app_id
VITE_ADMOB_REWARDED_ID=your_admob_rewarded_id
Khởi chạy ứng dụng ở chế độ phát triển:

npm run dev
Mở trình duyệt và truy cập: http://localhost:5000

Triển khai
Ứng dụng được thiết kế để triển khai trên Render.com với cấu hình như sau:

Web Service:

Build Command: npm install && npm run build
Start Command: npm run start
Auto Deploy: Yes
Biến môi trường:

Thêm tất cả các biến môi trường từ file .env vào cấu hình trên Render.com
Cấu trúc dự án
/
├── client/               # Frontend React app
│   ├── public/           # Static assets
│   │   ├── .well-known/  # Digital Asset Links cho TWA
│   └── src/              # Source code
│       ├── components/   # UI components
│       ├── contexts/     # React contexts (Auth, Mining)
│       ├── hooks/        # Custom hooks
│       ├── lib/          # Utilities
│       ├── pages/        # Application pages
│       └── types/        # TypeScript definitions
├── server/               # Backend Express app
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database storage implementations
│   └── firebase-admin.ts # Firebase Admin SDK setup
└── shared/               # Shared code
    └── schema.ts         # Database schema definitions
Tạo ứng dụng TWA (Trusted Web Activity)
Để tạo ứng dụng Android từ PWA này:

Tạo keystore cho ứng dụng:

keytool -genkey -v -keystore auminer_keystore.keystore -alias auminer -keyalg RSA -keysize 2048 -validity 10000
Lấy vân tay SHA-256:

keytool -list -v -keystore auminer_keystore.keystore -alias auminer
Cập nhật file client/public/.well-known/assetlinks.json với vân tay SHA-256 và package name.

Sử dụng PWA Builder để tạo ứng dụng Android.

Cấu hình AdMob trong AndroidManifest.xml của ứng dụng Android.

Giấy phép
MIT License

Liên hệ
Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ:

Email: your_email@example.com
