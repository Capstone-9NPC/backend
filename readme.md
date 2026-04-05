```
backend/
├── src/
│ ├── config/
│ │ └── supabase.js ← koneksi ke Supabase
│ │
│ ├── controllers/
│ │ ├── authController.js ← logic login/register
│ │ ├── reportController.js ← logic laporan
│ │ └── caseController.js ← logic tracking kasus
│ │
│ ├── middleware/
│ │ ├── authMiddleware.js ← cek token JWT
│ │ └── errorHandler.js ← handle error global
│ │
│ ├── routes/
│ │ ├── authRoutes.js ← endpoint /auth
│ │ ├── reportRoutes.js ← endpoint /reports
│ │ └── caseRoutes.js ← endpoint /cases
│ │
│ ├── services/
│ │ ├── authService.js ← komunikasi dengan Supabase Auth
│ │ └── storageService.js ← upload foto ke Supabase Storage
│ │
│ └── utils/
│ └── response.js ← format response API standar
│
├── .env ← variabel rahasia (tidak di-push)
├── .env.example ← template env untuk tim
├── .gitignore
├── package.json
└── server.js ← entry point
```
