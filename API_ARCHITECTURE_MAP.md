# FutureLab API Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND APPLICATION                             │
│                     (React + TailwindCSS + Axios)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                               │
│                    (Express.js + CORS + Helmet)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  Rate Limiting │ Authentication │ Error Handling │ Logging               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
        │   PUBLIC      │  │  PROTECTED    │  │    ADMIN      │
        │   ROUTES      │  │   ROUTES      │  │   ROUTES      │
        └───────────────┘  └───────────────┘  └───────────────┘
                │                  │                  │
                │                  │                  │
    ┌───────────┴──────────┐      │      ┌──────────┴──────────┐
    │                      │      │      │                     │
    ▼                      ▼      ▼      ▼                     ▼


┌──────────────────────────────────────────────────────────────────────────┐
│                        API ENDPOINTS BY MODULE                            │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 1. AUTHENTICATION & USER MANAGEMENT                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    POST   /api/v1/auth/register           → Register new user            │
│    POST   /api/v1/auth/login              → Login with credentials       │
│    POST   /api/v1/auth/otp/generate       → Generate OTP                 │
│    POST   /api/v1/auth/otp/verify         → Verify OTP & get token       │
│    POST   /api/v1/auth/admin/login        → Admin login                  │
│                                                                           │
│  PROTECTED:                                                               │
│    GET    /api/v1/auth/me                 → Get current user             │
│    PUT    /api/v1/auth/updatedetails      → Update user profile          │
│    GET    /api/v1/auth/logout             → Logout user                  │
│                                                                           │
│  MISSING:                                                                 │
│    POST   /api/v1/auth/forgot-password    → Request password reset       │
│    PUT    /api/v1/auth/reset-password     → Reset password               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 2. TESTS & PRODUCTS                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/tests                   → Get all tests                │
│    GET    /api/v1/tests/:id               → Get single test              │
│    GET    /api/v1/tests/category/:cat     → Get tests by category        │
│    GET    /api/v1/tests/selected/...      → Get featured tests           │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/tests                   → Create test                  │
│    PUT    /api/v1/tests/:id               → Update test                  │
│    DELETE /api/v1/tests/:id               → Delete test                  │
│                                                                           │
│  MISSING:                                                                 │
│    GET    /api/v1/tests/search            → Advanced search              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 3. CATEGORIES                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/category                → Get all categories           │
│    GET    /api/v1/category/:id            → Get single category          │
│    GET    /api/v1/category/*/selected     → Get category-specific data   │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/category                → Create category              │
│    PUT    /api/v1/category/:id            → Update category              │
│    DELETE /api/v1/category/:id            → Delete category              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 4. PACKAGES                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/packages                → Get all packages             │
│    GET    /api/v1/packages/:id            → Get single package           │
│    GET    /api/v1/packages/category/:cat  → Get packages by category     │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/packages                → Create package               │
│    PUT    /api/v1/packages/:id            → Update package               │
│    DELETE /api/v1/packages/:id            → Delete package               │
│    PATCH  /api/v1/packages/:id/toggle     → Toggle active status         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 5. SHOPPING CART                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC/USER:                                                             │
│    GET    /api/v1/cart/:userId            → Get user cart                │
│    POST   /api/v1/cart/add                → Add item to cart             │
│    DELETE /api/v1/cart/remove             → Remove item from cart        │
│    PUT    /api/v1/cart/update             → Update cart item             │
│    DELETE /api/v1/cart/clear/:userId      → Clear entire cart            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 6. ORDERS                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PROTECTED:                                                               │
│    POST   /api/v1/orders                  → Create new order             │
│    GET    /api/v1/orders/myorders         → Get user's orders            │
│    GET    /api/v1/orders/:id              → Get single order             │
│    PUT    /api/v1/orders/:id/pay          → Mark order as paid           │
│                                                                           │
│  ADMIN:                                                                   │
│    GET    /api/v1/orders                  → Get all orders               │
│    GET    /api/v1/orders/stats            → Get dashboard statistics     │
│    PUT    /api/v1/orders/:id/deliver      → Mark order as delivered      │
│    PUT    /api/v1/orders/:id/status       → Update order status          │
│    DELETE /api/v1/orders/:id              → Delete order                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 7. PAYMENT GATEWAY (HDFC)                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/payment/hdfc/config     → Get HDFC configuration       │
│    POST   /api/v1/payment/hdfc/callback   → Handle payment callback      │
│    POST   /api/v1/payment/hdfc/webhook    → Handle payment webhook       │
│                                                                           │
│  PROTECTED:                                                               │
│    POST   /api/v1/payment/hdfc/create     → Create payment order         │
│    GET    /api/v1/payment/hdfc/verify/:id → Verify payment               │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/payment/hdfc/refund     → Initiate refund              │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 8. LOCATIONS & SERVICE AVAILABILITY                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/locations               → Get all locations            │
│    GET    /api/v1/locations/:id           → Get single location          │
│    GET    /api/v1/locations/check/:pin    → Check pincode availability   │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/locations               → Create location              │
│    PUT    /api/v1/locations/:id           → Update location              │
│    DELETE /api/v1/locations/:id           → Delete location              │
│    PATCH  /api/v1/locations/:id/toggle    → Toggle active status         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 9. BOOKINGS & APPOINTMENTS                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/bookings/available      → Get available time slots     │
│    GET    /api/v1/bookings/next-slot      → Find next available slot     │
│                                                                           │
│  PROTECTED:                                                               │
│    POST   /api/v1/bookings/book-slot      → Book appointment slot        │
│    GET    /api/v1/bookings/collector/:id  → Get collector bookings       │
│    DELETE /api/v1/bookings/cancel/:id     → Cancel booking               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 10. COLLECTOR FOLDER MANAGEMENT                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/admin/collector-folders/pincode/:pin                   │
│                                                                           │
│  PROTECTED (ADMIN):                                                       │
│    GET    /api/v1/admin/collector-folders → Get all folders              │
│    POST   /api/v1/admin/collector-folders → Create folder                │
│    PUT    /api/v1/admin/collector-folders/:id → Update folder            │
│    DELETE /api/v1/admin/collector-folders/:id → Delete folder            │
│    GET    /api/v1/admin/collector-folders/:id/stats → Get stats          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 11. BANNERS & PROMOTIONAL CONTENT                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PUBLIC:                                                                  │
│    GET    /api/v1/banners                 → Get all banners              │
│    GET    /api/v1/banners/main            → Get main banners             │
│    GET    /api/v1/banners/bottom          → Get bottom banners           │
│    GET    /api/v1/banners/bottom/random   → Get random banner            │
│    GET    /api/v1/banners/:id             → Get single banner            │
│                                                                           │
│  ADMIN:                                                                   │
│    POST   /api/v1/banners                 → Create banner                │
│    PUT    /api/v1/banners/:id             → Update banner                │
│    DELETE /api/v1/banners/:id             → Delete banner                │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 12. USER MANAGEMENT (ADMIN)                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ADMIN ONLY:                                                              │
│    GET    /api/v1/users                   → Get all users                │
│    GET    /api/v1/users/stats             → Get user statistics          │
│    GET    /api/v1/users/:id               → Get single user              │
│    PATCH  /api/v1/users/:id/role          → Update user role             │
│    PATCH  /api/v1/users/:id/toggle        → Toggle user active status    │
│    DELETE /api/v1/users/:id               → Delete user                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ 13. REVIEWS & RATINGS (NOT IMPLEMENTED)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  PLANNED:                                                                 │
│    GET    /api/v1/tests/:testId/reviews   → Get test reviews             │
│    POST   /api/v1/tests/:testId/reviews   → Create review                │
│    PUT    /api/v1/reviews/:id             → Update review                │
│    DELETE /api/v1/reviews/:id             → Delete review                │
└─────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                     │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
        │   MongoDB     │  │   Mongoose    │  │   Indexes     │
        │   Atlas       │  │   Models      │  │   & Schema    │
        └───────────────┘  └───────────────┘  └───────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                        DATA MODELS                                        │
└──────────────────────────────────────────────────────────────────────────┘

User ──────────┐
               ├──> Order ──────> OrderItems
Test ──────────┤
               ├──> Cart ───────> CartItems
Package ───────┤
               └──> Review (planned)

Category
Banner
Location
CollectorFolder ──> TimeSlot ──> Booking


┌──────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                                  │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  HDFC Payment   │    │   SMS Service   │    │  Email Service  │
│    Gateway      │    │   (BhashSMS)    │    │   (Nodemailer)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE STACK                                       │
└──────────────────────────────────────────────────────────────────────────┘

Request
   │
   ├──> CORS
   ├──> Helmet (Security Headers)
   ├──> Morgan (Logging)
   ├──> Rate Limiter (MISSING)
   ├──> Body Parser
   ├──> Authentication (JWT)
   ├──> Authorization (Role-based)
   ├──> Error Handler
   │
Response


┌──────────────────────────────────────────────────────────────────────────┐
│                    API RESPONSE FORMAT                                    │
└──────────────────────────────────────────────────────────────────────────┘

SUCCESS:
{
  "success": true,
  "count": 10,
  "data": [...],
  "pagination": {...}
}

ERROR:
{
  "success": false,
  "error": "Error message"
}


┌──────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                                    │
└──────────────────────────────────────────────────────────────────────────┘

1. User enters phone number
   │
   ├──> POST /api/v1/auth/otp/generate
   │
2. OTP sent via SMS
   │
   ├──> User enters OTP
   │
   ├──> POST /api/v1/auth/otp/verify
   │
3. JWT token generated
   │
   ├──> Token stored in localStorage
   │
4. Subsequent requests include token
   │
   ├──> Authorization: Bearer <token>
   │
5. Middleware validates token
   │
   └──> Access granted/denied


┌──────────────────────────────────────────────────────────────────────────┐
│                    BOOKING FLOW                                           │
└──────────────────────────────────────────────────────────────────────────┘

1. User selects tests/packages
   │
2. Check pincode availability
   │
   ├──> GET /api/v1/locations/check/:pincode
   │
3. Get available time slots
   │
   ├──> GET /api/v1/bookings/available-slots
   │
4. User selects slot
   │
5. Create booking
   │
   ├──> POST /api/v1/bookings/book-slot
   │
6. Smart distribution to collector
   │
7. Create order
   │
   ├──> POST /api/v1/orders
   │
8. Process payment
   │
   ├──> POST /api/v1/payment/hdfc/create-order
   │
9. Confirm booking
   │
   └──> Send confirmation (SMS/Email)


┌──────────────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                                │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│   CDN/      │
│   Nginx     │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌─────────────┐
│   Node.js   │◄────►│   MongoDB   │
│   Express   │      │    Atlas    │
└──────┬──────┘      └─────────────┘
       │
       ├──────────┐
       │          │
       ▼          ▼
┌─────────────┐  ┌─────────────┐
│   Payment   │  │     SMS     │
│   Gateway   │  │   Service   │
└─────────────┘  └─────────────┘

```

---

## API Statistics

- **Total Endpoints**: 80+
- **Public Endpoints**: 30+
- **Protected Endpoints**: 25+
- **Admin Endpoints**: 25+
- **Implemented**: 90%
- **Missing**: 10%

---

## Security Layers

1. **CORS** - Cross-origin protection
2. **Helmet** - Security headers
3. **JWT** - Token-based auth
4. **Bcrypt** - Password hashing
5. **Rate Limiting** - (MISSING)
6. **Input Validation** - Mongoose schemas
7. **RBAC** - Role-based access

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-04
