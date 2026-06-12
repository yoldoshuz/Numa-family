# Numa API — Integration Reference

Generated for the Numa multi-tenant backend (Express 5 + Sequelize 6 + Postgres + Redis). Serves three БАД-marketplace storefronts (`nutrition`, `kids`, `halal`) plus one informational site (`family` — Numa Family, no commerce). All endpoints live under `/api/v1/`. This document is the single source of truth for client integration.

---

## Table of Contents

- [0. Overview](#0-overview)
- [1. Auth (User) — `/auth`](#1-auth-user)
- [2. Admin & Auth (Admin) — `/admin`](#2-admin--auth-admin)
- [3. Cart — `/cart`](#3-cart)
- [4. Category — `/categories`](#4-category)
- [5. Product — `/products`](#5-product)
- [6. Order — `/orders`](#6-order)
- [7. Payment — `/payment`](#7-payment)
- [8. Blog — `/blog`](#8-blog)
- [9. Site CMS — `/sites`](#9-site-cms)
- [A. Workflows (end-to-end)](#a-workflows-end-to-end)
- [B. Permissions (RBAC) — full list](#b-permissions-rbac)
- [C. Background jobs](#c-background-jobs)

---

## 0. Overview

### 0.1 Base URL & versioning
- Base URL: `${APP_URL}/api/v1`
- Single version (`v1`). Swagger UI at `/api/v1/api-docs` (source: `swagger.yaml`).
- Health check: `GET /api/v1/health` (200 OK = alive).

### 0.2 Stores (multi-tenancy)
One backend serves four storefronts. The codebase distinguishes two classes:

| slug        | brand          | kind          | has products / cart / orders? |
|-------------|----------------|---------------|-------------------------------|
| `nutrition` | Numa Nutrition | marketplace   | yes                           |
| `kids`      | Numa Kids      | marketplace   | yes                           |
| `halal`     | Numa Halal     | marketplace   | yes                           |
| `family`    | Numa Family    | informational | **no** (blog + site pages only) |

Two TypeScript constants in `src/types.ts`:
- `STORE_SLUGS` — all 4 slugs. Used by site/blog/admin schemas.
- `MARKETPLACE_STORE_SLUGS` — 3 slugs, excludes `family`. Used by product/category/cart/order/payment.

**`family` admin = admin assigned to `store='family'`.** Family content (site CMS, blog) may be managed by an admin whose `store` is `family`, or by any `super_admin`. The previous super-admin-only carve-out has been removed (commit `79b04b5`). A store-scoped admin from a different store (e.g. `nutrition`) trying to reach a family resource still receives `403 Forbidden` because `requireStoreAccess` / `requireResourceStoreAccess` compare the resource's store to the caller's `req.user.store`.

Store is specified per-request in one of three ways depending on the endpoint:
- **URL path** for public + cart/order/site/blog-public endpoints (`storeParam` / `marketplaceStoreParam` middleware).
- **Query param `?store=...`** or **body field `store`** for admin CMS list/create endpoints.
- **`X-Store` HTTP header** — accepted by `storeContext` / `marketplaceStoreContext` middleware but not currently required on any route.

Invalid store values:
- Marketplace endpoints (`/cart/:store`, `/orders/:store/checkout`, `/products/*/:store`, `/categories/store/:store`, etc.) reject `family` with `400 Bad Request` — `"… Valid values: nutrition, kids, halal"`.
- Site / blog endpoints accept all four; `400 Bad Request` only for values outside the enum.

### 0.3 Auth model
Two identity types share one JWT shape. Token claims: `{ id, role, store, permissions }`.

| Identity          | role           | store                                                       | permissions             | Source                              |
|-------------------|----------------|-------------------------------------------------------------|-------------------------|-------------------------------------|
| Customer user     | `user`         | `null`                                                      | `[]`                    | phone+OTP (`/auth/*`)               |
| Marketplace admin | `admin`        | `nutrition` \| `kids` \| `halal`                            | `['products:read', …]`  | email+password (`/admin/login`)     |
| Family admin      | `admin`        | `family` (manages site CMS + blog for Numa Family)          | typically `['site:manage', 'blog:read', 'blog:write', 'blog:delete']` | email+password (`/admin/login`) |
| Super admin       | `super_admin`  | `null` (global) — manages everything across all 4 stores    | ignored                 | email+password (`/admin/login`)     |
| Guest             | — (no token)   | —                                                           | —                       | cookie `cart_session_<store>`       |

Family admins are first-class admins now — they cannot be assigned products / cart / order permissions (those endpoints reject `family` regardless of token), but they pass `requireStoreAccess` for any `:store=family` site/blog CMS path.

- Access token: `Authorization: Bearer <jwt>`. Lifetime: short (JWT config).
- Refresh token: 7 days. Always stored in `httpOnly` cookie `refresh-token` (`SameSite=none; Secure` in prod). Also returned in body for native clients.
- `/auth/refresh` and `/admin/refresh` accept the refresh token either from body or from cookie (cookie takes precedence if body is absent).
- Logout blacklists **both** access and refresh tokens (Redis) and clears the refresh cookie. Blacklist check is performed by `verifyAccessToken` / `verifyRefreshToken` → `requireAuth`.
- **Admin token versioning** (`admins.token_version`): admin / super_admin JWTs carry a `tokenVersion` claim. `requireAuth` (and `optionalAuth`) compare the claim against the live row on every authenticated call; a mismatch returns 401 `Token has been invalidated`. The counter is bumped on:
   - `deactivate` / `update {isActive:false}` — outstanding tokens stop working immediately.
   - `updatePermissions` / store reassignment — old token's `permissions[]` claim becomes irrelevant.
   - `changePassword` (super_admin → other) and `changeOwnPassword` — re-authentication required everywhere.
   - `delete` — row gone → `findAuthState` returns null → 401 (no explicit bump needed).
   `activate` does NOT bump (a fresh login issues a token with the current version anyway). Tokens minted **before** the migration shipped (no `tokenVersion` claim) are rejected — admins must re-login once after deploy.
- Global middleware `optionalAuth` runs for every `/api/v1/*` — sets `req.user` if a valid Bearer token is present (and, for admins, if `tokenVersion` still matches the row); otherwise proceeds without it.

### 0.4 Response envelope (`shared/utils/apiResponse.ts`)

All responses use a uniform envelope.

**Success**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "errors": { ... }   // optional — validation details etc.
}
```

`statusCode` mirrors the HTTP status. `data` is omitted for `204 No Content` and some empty successes.

### 0.5 Error codes

| HTTP | code string             | Meaning / trigger                                           |
|------|-------------------------|-------------------------------------------------------------|
| 400  | `BAD_REQUEST`           | Malformed input / business rule; validation failures other than Zod |
| 401  | `UNAUTHORIZED`          | Missing / invalid / blacklisted token; wrong OTP or password |
| 403  | `FORBIDDEN`             | Role or store-scope violation; permission missing           |
| 404  | `NOT_FOUND`             | Entity missing                                              |
| 409  | `CONFLICT`              | Duplicate email / SKU / etc.; stock conflict at checkout    |
| 422  | `VALIDATION_ERROR`      | Zod schema failed; `errors` carries the flat detail         |
| 429  | `TOO_MANY_REQUESTS`     | Rate-limit hit                                              |
| 500  | `INTERNAL_ERROR`        | Unhandled                                                   |
| 503  | `SERVICE_UNAVAILABLE`   | Redis down during auth; graceful shutdown in progress       |

### 0.6 Cookies & headers

| Name                    | Scope / purpose                                                                 |
|-------------------------|---------------------------------------------------------------------------------|
| `refresh-token`         | httpOnly refresh JWT (7 days). Cleared on logout.                               |
| `cart_session_nutrition`| Guest cart token for `nutrition` store (nanoid32). 7-day expiry.                |
| `cart_session_kids`     | Guest cart token for `kids`.                                                    |
| `cart_session_halal`    | Guest cart token for `halal`.                                                   |
| *(no `cart_session_family`)* | Family store has no cart — no such cookie is ever set.                     |
| `X-Cart-Token` (header) | Mirror of the guest cart token — set in every cart response; clients on non-browser stacks can echo it on subsequent requests instead of using cookies. |
| `X-Store` (header)      | Optional store selector handled by `storeContext` / `marketplaceStoreContext` middleware. Marketplace routes (product/cart/order/category/payment) reject `family` with 400. |
| `X-Request-ID`          | Echo / generation of request correlation ID (always set in responses).          |
| `Authorization`         | `Bearer <access-jwt>`.                                                          |
| `If-None-Match` / `ETag`| Site public endpoints use weak ETags and honor 304.                             |

In production, cookies use `SameSite=none; Secure; domain=${COOKIE_DOMAIN}`. In development, `SameSite=lax`, no `Secure`.

### 0.7 Rate limits

| Endpoint                                        | Window | Max | Key                        |
|-------------------------------------------------|--------|-----|----------------------------|
| `POST /auth/register`                           | 15 min | 5   | `ip + phone`               |
| `POST /auth/verify-otp`                         | 15 min | 10  | `ip + phone`               |
| `POST /auth/refresh`                            | 15 min | 30  | ip                         |
| `POST /admin/login`                             | 15 min | 5   | ip                         |
| `POST /admin/refresh`                           | 15 min | 30  | ip                         |
| `POST /payment/click/*`, `POST /payment/payme`  | 15 min | 100 | ip                         |
| `GET /payment/cms/transactions/:id/click-status`| 1 min  | 10  | admin id (fallback ip)     |

On limit exceeded: `429` with `{ success: false, message: 'Too many …' }` plus `Retry-After` and `RateLimit-*` headers.

### 0.8 Global middleware (in order, `src/main.ts`)
1. `cors` — currently permissive (`origin: true, credentials: true`); tighten via `CORS_ORIGIN` allow-list before going public. (Helmet was removed — see `45b1778` / `ec2a4bd` / `3e035f2`.)
2. `express.json`, `urlencoded`, `cookie-parser`.
3. `pinoHttp` — request logging with `X-Request-ID`.
4. `compression`.
5. `/public` static files (`X-Content-Type-Options: nosniff`).
6. `trackActiveRequests` — counts in-flight requests, refuses new during shutdown.
7. `optionalAuth` on `/api/v1` — populates `req.user` if a valid JWT is presented.
8. Main router (`/api/v1`).
9. `errorHandler` — converts `AppError` / Zod / unhandled into envelope.

### 0.9 Store-access middleware helpers (`shared/middleware/auth.ts`, `shared/middleware/storeContext.ts`)

**Auth / permission:**
- `requireAuth` — 401 if no valid token.
- `requireSuperAdmin` — role must be `super_admin`.
- `requirePermission(perm)` — super_admin passes; admin must have `perm` in `permissions`.

**Store scoping (CMS paths):**
- `requireStoreAccess(getStore)` — if admin, requested store must equal `req.user.store`. Super_admin always passes. A family admin (`store='family'`) passes for `:store=family` requests.
- `enforceAdminStoreFilter(source='query', key='store')` — mutates `req.query.store` (or body) to admin's own store if role=admin; super_admin untouched. Admins without an assigned store get 403.
- `requireResourceStoreAccess(loader)` — fetches `{ store }` for `:id`, compares to admin's store. Super_admin always passes; family admin passes for family resources; cross-store admins (e.g. nutrition admin loading a family post) get 403.

**Public store resolver:**
- `storeParam` / `storeContext` — validate `:store` path param / `X-Store` header against all 4 slugs (`STORE_SLUGS`). Used by site + blog public endpoints.
- `marketplaceStoreParam` / `marketplaceStoreContext` — validate against marketplace slugs only (`MARKETPLACE_STORE_SLUGS`). Used by cart, product public, category public, order checkout. Sending `family` to these returns 400.

### 0.10 Payment amounts
- **Click**: amounts are in **UZS whole units** (integer).
- **Payme**: amounts are in **tiyin** (1 UZS = 100 tiyin). Internal `Payment.amountTiyin` always in tiyin.
- **Uzum Checkout**: amounts are in **tiyin** (same as Payme). The `register` request takes integer tiyin in `amount`, and `acquiring/refund` likewise.
- `Order.totalAmount` is `DECIMAL(16,2)` UZS.

---

## 1. Auth (User)

Module: `src/auth`. Router prefix: `/api/v1/auth`.
All endpoints serve customer users (phone+OTP). User accounts are global — one account spans all three marketplace stores (`family` has no customer auth), tokens carry `role:'user'`, `store:null`.

### `POST /auth/register`
- **Описание:** Начать регистрацию или re-login: создаёт/находит пользователя по телефону и отправляет 4-значный OTP через Eskiz SMS.
- **Auth:** public.
- **Rate limit:** 5 / 15 min per (ip + phone).
- **Body (JSON):**
  | field       | type   | required | rules                                              |
  |-------------|--------|----------|----------------------------------------------------|
  | `firstName` | string | yes      | 2–100 chars, trimmed                               |
  | `lastName`  | string | yes      | 2–100 chars, trimmed                               |
  | `phone`     | string | yes      | regex `^\+998[0-9]{9}$`                            |
  Example:
  ```json
  { "firstName": "Ali", "lastName": "Karimov", "phone": "+998901234567" }
  ```
- **Response 201:**
  ```json
  { "success": true, "statusCode": 201, "message": "OTP sent to your phone number",
    "data": { "message": "...", "userId": "<uuid>", "phone": "+998901234567",
              "otp": "1234" /* only in non-production */ } }
  ```
- **Errors:** 422 validation, 429 rate limit, 500.
- **Side effects:** INSERT into `users` if new (or no-op for existing); OTP hash stored on user row with TTL; SMS dispatched via Eskiz.
- **Workflow:**
  1. Zod validate.
  2. `userRepository.findByPhone` → create if missing; existing profile fields are NOT overwritten (prevents name takeover).
  3. `sendOtp(user)` generates 4-digit code, hashes + stores on user, sends SMS via Eskiz.
  4. Return `{ userId, phone }` (+ raw `otp` in dev).

### `POST /auth/verify-otp`
- **Описание:** Проверить OTP, выдать пару токенов, слинковать гостевые корзины и backfill гостевых заказов.
- **Auth:** public.
- **Rate limit:** 10 / 15 min per (ip + phone).
- **Body:**
  | field   | type   | required | rules                               |
  |---------|--------|----------|-------------------------------------|
  | `phone` | string | yes      | regex `^\+998[0-9]{9}$`             |
  | `otp`   | string | yes      | exactly 4 digits (`^\d{4}$`)        |
- **Response 200:**
  ```json
  { "data": { "user": { "id": "...", "firstName": "...", "lastName": "...", "phone": "...",
                         "isActive": true, "createdAt": "..." },
              "accessToken": "<jwt>",
              "refreshToken": "<jwt>" } }
  ```
  Also sets `refresh-token` httpOnly cookie (7 days).
- **Errors:** 401 invalid/expired OTP, 404 phone not registered, 422 validation.
- **Side effects:**
  - Clears OTP on user.
  - Sets `refresh-token` cookie.
  - For every store, reads `cart_session_<store>` cookie or `X-Cart-Token` header → `cartRepository.linkSessionToUser` merges guest cart into any existing user cart.
  - `orderRepository.backfillUserIdByPhone` — any historical guest orders with matching phone get `userId` attached.
- **Workflow:** validate → find user by phone → verify OTP → clear OTP → backfill orders → link guest carts for each store → sign tokens → set cookie → respond.

### `POST /auth/refresh`
- **Описание:** Rotate: принять refresh token (cookie или body), blacklist'ить старый, выдать новую пару.
- **Auth:** public (token is the auth).
- **Rate limit:** 30 / 15 min per ip.
- **Body (optional):** `{ "refreshToken": "..." }` — fallback if no cookie.
- **Response 200:** `{ data: { accessToken, refreshToken } }` + new `refresh-token` cookie.
- **Errors:** 401 invalid / expired / user disabled, 422 if neither cookie nor body.
- **Workflow:** resolve token (cookie preferred) → `verifyRefreshToken` → load user → ensure active → blacklist old token (best-effort) → sign new pair → set cookie.

### `GET /auth/me`
- **Описание:** Профиль текущего пользователя.
- **Auth:** required (`role=user`).
- **Response 200:** `data` = profile `{ id, firstName, lastName, phone, isActive, createdAt, updatedAt }`.
- **Errors:** 401, 404.

### `PUT /auth/me`
- **Описание:** Обновить `firstName` / `lastName`. Телефон менять нельзя.
- **Auth:** required.
- **Body:** `{ firstName?: string(2–100), lastName?: string(2–100) }`.
- **Response 200:** updated profile.
- **Errors:** 401, 404, 422.

### `POST /auth/logout`
- **Описание:** Blacklist current access token, clear refresh cookie.
- **Auth:** required.
- **Response 200:** `{}`.
- **Side effects:** access token added to Redis blacklist; `refresh-token` cookie cleared.

---

## 2. Admin & Auth (Admin)

Module: `src/admin`. Router prefix: `/api/v1/admin`.
Admin JWT carries `role: 'admin' | 'super_admin'`, `store`, `permissions[]`.

### `POST /admin/login`
- **Auth:** public.
- **Rate limit:** 5 / 15 min per ip.
- **Body:**
  | field      | type   | rules                                   |
  |------------|--------|-----------------------------------------|
  | `email`    | string | valid email                             |
  | `password` | string | ≥ 6 chars                               |
- **Response 200:**
  ```json
  { "data": { "accessToken": "...", "refreshToken": "...",
              "admin": { "id":"...", "name":"...", "email":"...", "role":"admin|super_admin",
                         "store":"nutrition|kids|halal|family|null",
                         "permissions":["products:read",...] } } }
  ```
  Sets `refresh-token` cookie.
- **Errors:** 401 invalid credentials (constant-time), 422, 429.
- **Workflow:** find by email → if not found run dummy bcrypt (timing safety) → verify password → update lastLogin → sign tokens.

### `POST /admin/refresh`
- Same shape as `/auth/refresh` but for admin tokens (preserves role + permissions from DB).
- Rate limit 30 / 15 min.

### `POST /admin/logout`
- **Auth:** required.
- Blacklists both access (from `Authorization`) and refresh (from cookie). Clears cookie.

### `GET /admin/me`
- **Auth:** required. Returns admin entity (without password hash).

### `PATCH /admin/me`
- **Auth:** required.
- **Body:** `{ name?: string(2–100), email?: email }`.
- 409 if email taken.

### `PATCH /admin/me/password`
- **Auth:** required.
- **Body:** `{ currentPassword: string, newPassword: string(≥8) }`.
- 401 if current password mismatch.

### `GET /admin/users`
- **Описание:** Список зарегистрированных customer users (глобально, не по магазинам).
- **Auth:** required + `Permission.USERS_READ` (`users:read`).
- **Query:** `isActive?: boolean`, `page?: int≥1=1`, `limit?: int 1–100=20`.
- **Response:** `{ users: Profile[], page, limit }`.

### `GET /admin/users/:id`
- **Auth:** `users:read`.
- **Response:** `{ user: Profile, orders: { total, items: Order[] (up to 50) } }`.

### `POST /admin/users/:id/activate` / `POST /admin/users/:id/deactivate`
- **Auth:** `users:write`. Toggles `isActive`.
- **Response 200:** `{ data: { user: Profile } }` — updated profile wrapped in `user` (commit `6fd0c52`).

### `GET /admin/`
- **Описание:** Список всех админов.
- **Auth:** `super_admin` only.
- **Query:** `store?: StoreSlug`.

### `POST /admin/`
- **Auth:** `super_admin`.
- **Body:**
  | field         | type                      | required | rules                           |
  |---------------|---------------------------|----------|---------------------------------|
  | `name`        | string                    | yes      | 2–100                           |
  | `email`       | string                    | yes      | email                           |
  | `password`    | string                    | yes      | ≥ 8                             |
  | `storeSlug`   | StoreSlug \| null         | no       | null = global (super_admin). `family` is allowed and gives the admin full site/blog CMS access for Numa Family. Marketplace endpoints still reject `family` admins. |
  | `permissions` | Permission[]              | no       | default `[]`                    |
- **Response 201:** admin summary. Hashes via bcrypt rounds=12.
- **Errors:** 409 email exists.

### `GET /admin/permissions`
- **Auth:** `super_admin`.
- **Response:** `{ permissions: string[] }` — all keys from `Permission` enum.

### `GET /admin/:id`
- **Auth:** `super_admin`.

### `PATCH /admin/:id`
- **Auth:** `super_admin`.
- **Body:** `{ name?, email?, isActive? }`.
- Blocked: deactivating yourself.

### `PATCH /admin/:id/permissions`
- **Auth:** `super_admin`.
- **Body:** `{ storeSlug?: StoreSlug|null, permissions?: Permission[] }`.
- Blocked: changing own permissions; modifying another `super_admin`.

### `PATCH /admin/:id/password`
- **Auth:** `super_admin`.
- **Body:** `{ newPassword: string(≥8) }`.

### `POST /admin/:id/activate` / `POST /admin/:id/deactivate`
- **Auth:** `super_admin`. Blocked: deactivating yourself (`deactivate` only — activating yourself is vacuous since you must already be active to call it).
- **Response 200:** `{ data: { admin: AdminSafe } }` — обновлённый админ без `passwordHash`. Envelope-форма приведена к виду `userCmsController.activate`/`deactivate`, который возвращает `{ user }`. Раньше handler возвращал `data: null`.
- **Errors:** 400 при попытке деактивировать себя, 404 если админ не найден.

### `DELETE /admin/:id`
- **Auth:** `super_admin`. Blocked: deleting yourself.

---

## 3. Cart

Module: `src/cart`. Router prefix: `/api/v1/cart`.
**Marketplace-only** — `:store` must be `nutrition | kids | halal`. Requests with `family` return `400 Bad Request` (rejected by `marketplaceStoreParam` middleware).
Store is always in the path: `/:store`. Cart resolution: `userId` wins if logged in and a user-cart exists for the store; otherwise guest `session_token` cookie / header. Stock and item limits: quantity `1..99` int.

All cart responses include a `withAvailability` wrapper: each item has `isAvailable = product.status=='active' && !deletedAt && stock >= quantity`.

### `GET /cart/:store`
- **Описание:** Текущая корзина для магазина. Если ни cookie, ни user → `{ items: [], store }`.
- **Auth:** optional. `role=user` uses user-cart.
- **Path:** `store: StoreSlug`.
- **Headers:** `X-Cart-Token?` / cookie `cart_session_<store>`; `Authorization?`.
- **Response 200:**
  ```json
  { "data": { "id":"<uuid>", "store":"nutrition", "userId":null, "sessionToken":"...",
              "items":[ { "id":"...", "productId":"...", "quantity":2,
                          "product": { ... }, "isAvailable": true } ] } }
  ```
- **Errors:** 500.
- **Workflow:** `resolveCart(token, store, userId?)` → map items with availability flag.

### `POST /cart/:store/items`
- **Описание:** Добавить товар (или увеличить quantity). Если пользователь авторизован — гарантирует user-cart, мерджит гостевой.
- **Auth:** optional.
- **Headers:** cookie/X-Cart-Token optional; if absent, server generates and returns token in `Set-Cookie` + `X-Cart-Token`.
- **Body:**
  | field       | type        | required | rules              |
  |-------------|-------------|----------|--------------------|
  | `productId` | UUID string | yes      | format UUID        |
  | `quantity`  | int         | yes      | 1..99              |
- **Response 200:** full cart (with availability).
- **Errors:** 400 stock exceeded (`Only N items in stock`), 404 product not found / inactive / wrong store, 422.
- **Side effects:** generates + sets cookie + header if new; `cartRepository.linkSessionToUser` if logged in; upserts item, increments quantity.
- **Workflow:**
  1. Resolve/generate session token, set cookie + `X-Cart-Token` header.
  2. Validate body.
  3. Load product; verify `status=active` and `store` match.
  4. If `userId` — `linkSessionToUser`; use or create user-cart. Else `findOrCreate` by token.
  5. `ensureStock`: `(existing.quantity ?? 0) + input.quantity <= product.stock`.
  6. `addQuantityToItem`.
  7. Refetch and return.

### `PATCH /cart/:store/items/:productId`
- **Описание:** Установить абсолютное quantity для товара в корзине.
- **Auth:** optional (same resolution as GET).
- **Body:** `{ "quantity": int 1..99 }`.
- **Response:** full cart.
- **Errors:** 400 stock, 404 cart/item not found, 422.

### `DELETE /cart/:store/items/:productId`
- **Описание:** Удалить позицию.
- **Response:** refreshed cart.
- **Errors:** 404 cart/item not found.

### `DELETE /cart/:store`
- **Описание:** Очистить всю корзину.
- **Response:** `null`.

---

## 4. Category

Module: `src/category`. Router prefix: `/api/v1/categories`.
**Marketplace-only.** `store` in every schema/DTO is one of `nutrition | kids | halal`. Public path param is validated by `marketplaceStoreParam`.

### `GET /categories/store/:store`
- **Описание:** Публичное дерево активных категорий магазина.
- **Auth:** public.
- **Path:** `store`.
- **Response:** `Category[]` (each: `id, name{uz,ru,en}, slug, parentId, imageUrl, sortOrder, isActive, store, children? (tree), productCount?`).

### `GET /categories/`
- **Описание:** CMS: список категорий. Для admin автоматически фильтруется по своему магазину.
- **Auth:** `categories:read`.
- **Middleware:** `enforceAdminStoreFilter()` + `requireStoreAccess(query.store)`.
- **Query:** `store?: StoreSlug`.

### `GET /categories/id/:id`
- **Auth:** `categories:read` + `requireResourceStoreAccess`.
- **Response:** single Category.

### `GET /categories/:store`
- **Auth:** `categories:read` + `requireStoreAccess(params.store)`.
- Same payload as `/categories/` but scoped by path param.

### `POST /categories/`
- **Auth:** `categories:write` + `requireStoreAccess(body.store)`. Body MUST contain `store` — otherwise the route hard-fails with 400 `BAD_REQUEST` ("store is required") before the auth guard runs.
- **Body:**
  | field       | type                      | required | rules                                                        |
  |-------------|---------------------------|----------|--------------------------------------------------------------|
  | `name`      | `{uz, ru, en}`            | yes      | each 1–200                                                   |
  | `slug`      | string                    | yes      | 1–200, regex `^[a-z0-9-]+$`                                  |
  | `store`     | StoreSlug                 | yes      | enum                                                         |
  | `parentId`  | UUID \| null              | no       |                                                              |
  | `imageUrl`  | URL \| null               | no       |                                                              |
  | `sortOrder` | int ≥ 0                   | no       | default 0                                                    |
  | `isActive`  | boolean                   | no       | default true                                                 |
- **Response 201:** category.
- **Errors:** 409 slug+store unique, 422.

### `PATCH /categories/:id`
- **Auth:** `categories:write` + resource-store check. Body = partial of create DTO.

### `DELETE /categories/:id`
- **Auth:** `categories:delete` + resource-store check. Soft delete.

---

## 5. Product

Module: `src/product`. Router prefix: `/api/v1/products`.
**Marketplace-only.** All public path params (`/store/:store`, `/featured/:store`, `/search/:store`, `/:store/:slug`) are validated by `marketplaceStoreParam`. The CMS DTO `createProductDto` / `productQueryDto` use `MARKETPLACE_STORE_SLUGS` — attempting `store:'family'` on create returns 422.

### `GET /products/store/:store`
- **Описание:** Публичный каталог (только `status=active`).
- **Path:** `store`.
- **Query (`productQueryDto`):**
  | field        | type                                      | default        |
  |--------------|-------------------------------------------|----------------|
  | `categoryId` | UUID                                      | —              |
  | `status`     | `active|draft|archived`                   | (public forces active) |
  | `featured`   | boolean (coerced)                         | —              |
  | `search`     | string ≤ 200                              | —              |
  | `page`       | int ≥ 1                                   | 1              |
  | `limit`      | int 1–100                                 | 20             |
  | `sortBy`     | `createdAt|price|name`                    | `createdAt`    |
  | `sortDir`    | `asc|desc`                                | `desc`         |
- **Response:** `{ products, total, page, limit, pages }`.

### `GET /products/featured/:store`
- **Описание:** Товары с `isFeatured=true`, `status=active`.
- **Response:** `Product[]`.

### `GET /products/search/:store`
- **Описание:** Полнотекстовый поиск (FTS миграция 006) с фасетами.
- **Query (searchQueryDto):**
  | field      | type                                                    |
  |------------|---------------------------------------------------------|
  | `q`        | string 1–120                                            |
  | `brand`    | string 1–80                                             |
  | `category` | UUID                                                    |
  | `attrs`    | JSON-stringified object `{ key: value, ... }`           |
  | `minPrice` | number ≥ 0                                              |
  | `maxPrice` | number ≥ 0                                              |
  | `sort`     | `relevance|price_asc|price_desc|newest`                 |
  | `limit`    | int 1–100                                               |
  | `offset`   | int ≥ 0                                                 |
- **Response:** `{ items: Product[], total, facets? }`.
- **Errors:** 400 if `attrs` not JSON, 404 if store invalid.

### `GET /products/search/:store/brands`
- **Описание:** Brand-фасеты для текущего запроса (те же фильтры, без `brand`).
- **Response:** `[{ brand: string, count: number }]`.

### `GET /products/:store/:slug`
- **Описание:** Публичный продукт по slug. Returns full product incl. `media[]`, `category`, related fields.
- **Errors:** 404.

### `GET /products/cms`
- **Auth:** `products:read` + `enforceAdminStoreFilter()` + `requireStoreAccess(query.store)`.
- Query same as public list + supports `status` = any.
- **Response:** `{ products, total, page, limit, pages }`.

### `GET /products/cms/:id`
- **Auth:** `products:read` + resource store.

### `POST /products/cms`
- **Auth:** `products:write` + `requireStoreAccess(body.store)`.
- **Body (`createProductDto`):**
  | field           | type                                            | required | rules                                  |
  |-----------------|-------------------------------------------------|----------|----------------------------------------|
  | `name`          | `{uz,ru,en}`                                    | yes      | each 1–300                             |
  | `description`   | `{uz,ru,en}` \| null                            | no       | each ≤ 10 000                          |
  | `slug`          | string                                          | yes      | 1–300, `^[a-z0-9-]+$`                  |
  | `sku`           | string                                          | yes      | 1–100                                  |
  | `price`         | number > 0                                      | yes      |                                        |
  | `discountPrice` | number > 0 \| null                              | no       |                                        |
  | `stock`         | int ≥ 0                                         | no       | default 0                              |
  | `unit`          | string ≤ 50                                     | no       | default `"шт"`                         |
  | `store`         | StoreSlug                                       | yes      |                                        |
  | `categoryId`    | UUID                                            | yes      |                                        |
  | `status`        | `active|draft|archived`                         | no       | default `draft`                        |
  | `isFeatured`    | boolean                                         | no       | default false                          |
  | `brand`         | string 1–120 \| null                            | no       |                                        |
  | `attributes`    | `{ [k]: string|number|boolean }` \| null         | no       |                                        |
- **Errors:** 409 (sku+store or slug+store unique), 422.

### `PATCH /products/cms/:id`
- **Auth:** `products:write` + resource store. Body = partial.

### `PATCH /products/cms/:id/status`
- **Body:** `{ "status": "active|draft|archived" }`. Updates only status.

### `POST /products/cms/:id/restore`
- **Auth:** `products:write`. Restores a soft-deleted product (paranoid).

### `POST /products/cms/:id/media`
- **Body:**
  | field       | type             | default   |
  |-------------|------------------|-----------|
  | `url`       | URL              | required  |
  | `type`      | `image|video`    | `image`   |
  | `isMain`    | boolean          | false     |
  | `sortOrder` | int ≥ 0          | 0         |
- **Response 201:** media record.

### `PATCH /products/cms/:id/media/:mediaId`
- **Body:** `{ sortOrder?, type?, isMain? }`.

### `PATCH /products/cms/:id/media/:mediaId/main`
- Sets given media as the main one (unsets others).

### `DELETE /products/cms/:id`
- **Auth:** `products:delete`. Soft delete (paranoid).

### `DELETE /products/cms/:id/media/:mediaId`
- **Auth:** `products:delete`.

---

## 6. Order

Module: `src/order`. Router prefix: `/api/v1/orders`.
**Marketplace-only.** `/orders/:store/checkout` rejects `family` with 400 (`marketplaceStoreParam`). The CMS list filter and `/orders/my?store=` use `MARKETPLACE_STORE_SLUGS` as the Zod enum.

### Enums
- `OrderStatus`: `new | processing | completed | cancelled` (terminals: completed, cancelled).
- `OrderPaymentStatus`: `unpaid | pending | paid | failed | expired | refunded`.
- `PaymentMethod`: `cash | click | payme`.
- `DeliveryType`: `delivery | pickup`.
- State machine (Order): `new → processing|cancelled`, `processing → completed|cancelled`.
- DB invariant: `status='completed'` ⇒ `payment_status='paid' OR payment_method='cash'`.

### `POST /orders/:store/checkout`
- **Описание:** Оформление заказа. Поддерживает гостя и авторизованного пользователя. Атомарно деактивирует сток (conditional `UPDATE`), создаёт Order + OrderItems, удаляет корзину. Идемпотентен по `idempotencyKey`.
- **Auth:** optional (guest or user).
- **Path:** `store`.
- **Headers:** `cart_session_<store>` cookie or `X-Cart-Token`. User может оформлять без cookie, если у него есть user-cart.
- **Body (`checkoutDto`):**
  | field             | type                                     | required                        | rules                                                |
  |-------------------|------------------------------------------|---------------------------------|------------------------------------------------------|
  | `customerName`    | string                                   | yes for guest, else optional    | 2–100                                                |
  | `customerSurname` | string                                   | yes for guest, else optional    | 2–100                                                |
  | `customerPhone`   | string                                   | yes for guest, else optional    | `^\+998[0-9]{9}$`                                    |
  | `customerAddress` | string                                   | required if `deliveryType=delivery` | 5–500                                            |
  | `deliveryType`    | `delivery|pickup`                        | no                              | default `delivery`                                   |
  | `notes`           | string \| null                           | no                              | ≤ 1000                                               |
  | `paymentMethod`   | `cash|click|payme`                       | no                              | default `cash`                                       |
  | `idempotencyKey`  | string                                   | no                              | 8–64, recommended — safe retry                       |
- **Response 201:**
  ```json
  { "data": { "order": { "id":"...", "store":"nutrition", "userId":"...|null",
                          "status":"new", "paymentStatus":"unpaid|pending",
                          "paymentMethod":"cash|click|payme", "totalAmount":"185000.00",
                          "items":[ { "productId":"...", "productName":{...}, "quantity":2,
                                       "unitPrice":"92500.00", "subtotal":"185000.00" } ],
                          "reservedUntil":"<iso|null>", "createdAt":"..." },
              "paymentUrl": null } }
  ```
- **Errors:** 400 empty cart / missing guest fields / cross-store product / no cart token for guest, 404 user not found, 409 insufficient stock, 422.
- **Side effects:** INSERT `orders` + `order_items`, atomic stock decrement via `productRepository.decrementStockAtomic` (conditional UPDATE; fails if `stock < qty`), DELETE cart. For online-payment methods (`click|payme`), `reserved_until = now + 30min`, `paymentStatus='pending'`.
- **Workflow:**
  1. If `idempotencyKey` — check existing order for `(store, user_or_session, key)`; if found → return (short-circuit).
  2. Load cart (user-cart wins).
  3. Open transaction (`withDeadlockRetry`):
     a. Re-check idempotency inside tx.
     b. `productRepository.findManyByIdsForUpdate` (shared lock).
     c. For each cart item: validate product exists & store matches; `decrementStockAtomic` → 409 if 0 rows affected.
     d. Compute subtotal, total (using `discountPrice ?? price`).
     e. Set `paymentStatus = pending` and `reserved_until = now+30m` for `click|payme`; else `unpaid`.
     f. `orderRepository.create(order, items, t)`.
     g. Delete cart.
     h. Return hydrated order.
  4. `paymentUrl` is always `null` here — клиент должен вызвать `/payment/click/checkout-url` или `/payment/payme/checkout-url` по orderId.

### `GET /orders/my`
- **Auth:** `role=user`.
- **Query:** `store?`, `page?=1`, `limit?=20` (1–100).
- **Response:** `{ orders, total, page, limit, pages }`.

### `GET /orders/my/:id`
- **Auth:** `role=user`. 404 если не твой.

### `GET /orders/cms`
- **Auth:** `orders:read` + `enforceAdminStoreFilter()`.
- **Query:** `store?`, `status?: OrderStatus`, `paymentStatus?: OrderPaymentStatus`, `page?`, `limit?`.

### `GET /orders/cms/:id`
- **Auth:** `orders:read` + resource-store check.

### `PATCH /orders/cms/:id`
- **Auth:** `orders:write` + resource-store check.
- **Body:** `{ "status": "new|processing|completed|cancelled" }`.
- **Errors:** 500 (from thrown) if illegal transition (`OrderStateMachine.assertTransition`).
- **Side effects on `cancelled`:** Inside a DB transaction, if previous status was `new|processing` AND `paymentStatus != paid`, stock is restored via `productRepository.incrementStock`. If the order was already paid, status updates but stock is NOT restored — logged warning; use refund flow instead.

---

## 7. Payment

Module: `src/payment`. Router prefix: `/api/v1/payment`. Integrations: **Click**, **Payme**, **Uzum Checkout**.
**Marketplace-only.** `Payment.store` and the CMS list `?store=` filter accept only `nutrition | kids | halal`.

`PaymentMethod` (in checkout DTO) — `cash | click | payme | uzum`. Online methods (`click | payme | uzum`) place the order in `paymentStatus=pending` with `reservedUntil = now+30min`; the StockReaper releases stock if the customer never completes payment.

### 7.1 Click webhooks (called by Click)
Always respond HTTP 200; errors expressed via JSON `error` field. Signature is MD5 — see `verifyClickSign`.

### `POST /payment/click/prepare`
- **Auth:** Click-side sign verification (`CLICK_SECRET_KEY`).
- **Rate limit:** 100 / 15 min per ip.
- **Body:** `{ click_trans_id, service_id, click_paydoc_id, merchant_trans_id (=orderId), amount (UZS), action:0, sign_time, sign_string }`.
- **Response 200 (ClickResponse):**
  ```json
  { "click_trans_id": 123, "merchant_trans_id": "<orderId>",
    "merchant_confirm_id": "<payment-id>", "error": 0, "error_note": "Success" }
  ```
- **Error codes** (in body): `-1 SIGN_FAILED`, `-2 WRONG_AMOUNT`, `-4 ALREADY_PAID`, `-5 ORDER_NOT_FOUND`, `-9 TX_CANCELLED`, `-8 System error`.
- **Workflow:**
  1. `verifyClickSign` → -1 on failure.
  2. Resolve order by `merchant_trans_id` → -5 if missing.
  3. Compare amounts (UZS integer) → -2 on mismatch.
  4. If `paymentStatus=paid` → -4.
  5. Idempotency: existing payment by `(click_trans_id, click)` — return its id; if cancelled → -9.
  6. If checkout pre-created a pending Payment without `providerTransactionId` — update it with `click_trans_id`.
  7. Otherwise create Payment in a tx (amount → tiyin) and set order `paymentStatus=pending`.
  8. Return `merchant_confirm_id = payment.id`.

### `POST /payment/click/complete`
- **Body:** prepare + `{ action:1, merchant_prepare_id (=payment.id), error, error_note }`.
- **Workflow:**
  1. Verify sign.
  2. Find Payment by `id = merchant_prepare_id` → -6 if missing.
  3. If `error < 0` — inside tx: Payment → FAILED; if order was PENDING → restore stock via `productRepository.incrementStock` and set `paymentStatus=failed, status=cancelled`. Return `error` code as-is.
  4. If Payment already PAID → return success (idempotent).
  5. Mark Payment PAID (`paidAt=now`) + order `paymentStatus=paid`. Respond 0.
- **Side effects:** emits `paymentEventService.ingestEvent(...)` for audit.

### `GET /payment/click/checkout-url?orderId=<uuid>`
- **Описание:** Генерирует redirect URL для Click hosted checkout.
- **Auth:** required. `role=user` must own the order; admin must be super_admin or same store.
- **Response:** `{ url, orderId, amountUzs }`.
- **Errors:** 400 missing orderId, 403 mismatch, 404 order, 500 env missing.

### 7.2 Payme
Payme calls JSON-RPC 2.0 over one endpoint. IP whitelist + Basic auth via `paymeAuth` middleware.

### `POST /payment/payme`
- **Auth:** Payme server only (paymeAuth).
- **Rate limit:** 100 / 15 min per ip.
- **Body:** `{ method: PaymeMethod, params, id }`.
- **Methods:** `CheckPerformTransaction | CreateTransaction | PerformTransaction | CancelTransaction | CheckTransaction | GetStatement`.
- **Tx states:** `1 PENDING, 2 COMPLETED, -1 CANCELLED, -2 REFUNDED`.
- **Error codes (PAYME_ERR):** `-31001 WRONG_AMOUNT`, `-31003 TX_NOT_FOUND`, `-31007 ORDER_COMPLETED`, `-31008 CANNOT_PERFORM`, `-31050 ACCOUNT_NOT_FOUND`, `-32700/-32600/-32601/-32504/-32400` JSON-RPC errors.
- **Per-method behavior:**
  - `CheckPerformTransaction`: params `{ account.order, amount }`. Resolves order, checks amount (tiyin), checks not already paid. Returns `{ allow: true, detail? }`. `detail.items` has title/price/count/code/vat_percent=12/package_code=1497091.
  - `CreateTransaction`: params `{ id (paymeTxId), time, amount, account.order }`. Idempotent on `(paymeTxId, payme)`. Links to checkout-pre-created pending payment if any. Stores `paymeTxTime` in `providerPayload`. Expires in 12h.
  - `PerformTransaction`: params `{ id }`. Sets Payment PAID, order `paymentStatus=paid`. Times out (>12h) → EXPIRED + stock release + order cancelled.
  - `CancelTransaction`: params `{ id, reason (CancelReason 1,2,3,4,5,10) }`. Pending → CANCELLED + stock release. Paid → if order is already `completed` → error -31007 (ORDER_COMPLETED); else refund: Payment → REFUNDED, order `paymentStatus=refunded, status=cancelled`, stock restored.
  - `CheckTransaction`: params `{ id }`. Returns `{ create_time, perform_time, cancel_time, transaction, state, reason }`.
  - `GetStatement`: params `{ from, to }`. Returns `{ transactions: [...] }` for Payme reconciliation.

### `GET /payment/payme/checkout-url?orderId=<uuid>`
- Same rules as Click's. Builds `https://checkout.paycom.uz/<base64(m=...;ac.order=...;a=<tiyin>;l=ru)>`.
- **Response:** `{ url, orderId, amountTiyin }`.

### 7.3 Uzum Checkout

Hosted-form REST integration — **no PCI DSS scope on our side**. The customer is redirected to `paymentRedirectUrl` issued by Uzum, enters card data on their form, and Uzum POSTs callbacks to our webhook endpoints.

**Required env vars:**
- `UZUM_API_BASE_URL` — e.g. `https://merchant-api.uzum.uz` (sandbox or prod).
- `UZUM_API_KEY` — secret API key issued by Uzum (sent in `X-API-Key`).
- `UZUM_TERMINAL_ID` — terminal UUID (sent in `X-Terminal-Id`).
- `UZUM_LOCALE` (optional, default `ru-RU`) — sent as `Content-Language`.
- `UZUM_WEBHOOK_BASIC_USER` / `UZUM_WEBHOOK_BASIC_PASS` (optional) — when both set, the webhook routes require `Authorization: Basic` matching these values. Configure in Uzum's merchant cabinet.
- `UZUM_WEBHOOK_IPS` (optional, comma-separated) — IP whitelist for prod; dev is permissive.

**Amount unit:** **тийины** (1 UZS = 100 тийин). Same as Payme.

**Status mapping:**
| Uzum (callback `operationType` × `operationState`) | Our `PaymentStatus` | Side effects |
|---|---|---|
| `AUTHORIZE` × `SUCCESS` | `paid` | Order.paymentStatus=paid |
| `AUTHORIZE` × `FAILURE` | `failed` | Order paymentStatus=failed, status=cancelled, stock restored (if Order was pending) |
| `REFUND` / `REVERSE` × `SUCCESS` | `refunded` | Order.paymentStatus=refunded |
| `BINDING`, `PROCESSING`, ... | (no transition — audited) | Logged via `paymentEventService.ingestEvent` |

#### `POST /payment/uzum/callbacks/acquiring`
- **Auth:** `uzumAuth` middleware — optional Basic auth + optional IP whitelist (see env above).
- **Rate limit:** 100 / 15 min per ip (`webhookLimiter`).
- **Body (per Uzum doc):**
  ```json
  {
    "orderId": "<uzum-uuid>",
    "operationState": "SUCCESS|FAILURE|...",
    "operationType":  "AUTHORIZE|REFUND|REVERSE|BINDING|...",
    "cardType": 2,
    "merchantOperationId": "<uuid>",
    "orderNumber": "<our-order-uuid>",
    "rrn": "<bank ref num>",
    "bindingId": null
  }
  ```
- **Workflow:**
  1. Lookup Payment by `(providerTransactionId=orderId, provider='uzum')`. If missing → log + ack 200 (don't reveal anything).
  2. Cross-check `orderNumber === Payment.orderId` if present — mismatch → log + ack.
  3. AUTHORIZE → SUCCESS: state-machine `pending → paid` inside tx with row lock; Order.paymentStatus=paid.
  4. AUTHORIZE → FAILURE: `pending → failed`; restore stock for each OrderItem; Order.paymentStatus=failed, status=cancelled.
  5. REFUND / REVERSE → SUCCESS: `paid → refunded`; Order.paymentStatus=refunded.
  6. Audit row in `payment_events` (idempotent via UNIQUE `(provider, providerEventId)`).
- **Response:** ALWAYS `200 { ok: true }` — Uzum retries up to 5 times on non-200, so we ack and log the error rather than failing the HTTP call.

#### `POST /payment/uzum/callbacks/event`
- Audit-only (does not drive state). Same auth + rate limit. Always 200.

#### `POST /payment/uzum/callbacks/receipt`
- Stores `{ type, url, ts }` in `Payment.providerPayload.receipts[]`. Same auth + rate limit. Always 200.
- **Body:** `{ orderId, receiptType: 'PURCHASE'|'PREPAID'|..., receiptUrl }`.

#### `GET /payment/uzum/checkout-url?orderId=<uuid>`
- **Auth:** required. `role=user` must own the order; admin must be super_admin or same store.
- **Query:** `orderId` (required), `successUrl?` / `failureUrl?` (optional override of redirect targets).
- **Workflow:**
  1. Resolve order; verify caller authorization.
  2. Call `POST /api/v1/payment/register` on Uzum: `{ amount: <tiyin>, clientId: <userId|sessionToken>, currency: 860, orderNumber: <orderId>, sessionTimeoutSecs: 1800, viewType: 'REDIRECT', successUrl, failureUrl, paymentParams: { payType: 'ONE_STEP' } }`.
  3. Persist Uzum's `result.orderId` in `Payment.providerTransactionId`; if a checkout-precreated pending row exists, update it; else create a new Payment with `expiresAt=now+30min`.
  4. Set Order.paymentStatus=pending.
- **Response:** `{ url: <paymentRedirectUrl>, orderId, uzumOrderId, amountTiyin }`.
- **Errors:** 400 (missing orderId / Uzum register rejected / config missing), 403 (cross-store/user), 404 (order not found).

### 7.4 Admin payment CMS
Prefix `/payment/cms/`.

### `GET /payment/cms/transactions`
- **Auth:** `payments:read` + `enforceAdminStoreFilter()` + `requireStoreAccess(query.store)`.
- **Query:** `store?`, `provider?: click|payme|uzum`, `status?: PaymentStatus`, `orderId?: UUID`, `dateFrom?`, `dateTo?`, `limit?=20 (1..100)`, `offset?=0`.
- **Response:** `{ payments, total, limit, offset, pages }`.
- Where `PaymentStatus = pending|paid|failed|cancelled|expired|refunded`.

### `GET /payment/cms/transactions/:id`
- **Auth:** `payments:read` + `requireResourceStoreAccess`.
- **Response:** full Payment record (+ `providerPayload`).

### `GET /payment/cms/transactions/:id/click-status`
- **Auth:** `payments:read`. Rate-limited 10/min/admin.
- **Описание:** Poll Click servers for real-time status. Priority: `providerTransactionId → getPaymentStatus`; else `providerPayload.invoiceId → getInvoiceStatus`; else fallback `getPaymentStatusByMti(orderId, createdAtDate)`.
- **Errors:** 400 if not Click payment.

### `DELETE /payment/cms/transactions/:id/reversal`
- **Auth:** `payments:write`.
- **Описание:** Reverse (cancel) a successful Click payment. Must be PAID, must have `providerTransactionId`. Calls `clickApiClient.cancelPayment(clickPaymentId)`. On success, in one tx: Payment → REFUNDED (+ `providerPayload.reversalAt/reversalBy`) and Order → `paymentStatus=refunded`.
- **Errors:** 400 (not Click / not paid / no click_trans_id / Click rejected), 404.

### `GET /payment/cms/transactions/:id/uzum-status`
- **Auth:** `payments:read`. Rate-limited 10/min/admin (shared `adminClickPollLimiter`).
- **Описание:** Poll Uzum for live status by calling `POST /api/v1/payment/getOrderStatus`. Useful when the callback hasn't arrived yet or a payment is stuck in PENDING.
- **Response:** `{ paymentId, uzumStatus: { errorCode, result: { status, totalAmount, completedAmount, refundedAmount, … } } }`.
- **Errors:** 400 (not Uzum / no orderId yet), 404.

### `DELETE /payment/cms/transactions/:id/uzum-reversal`
- **Auth:** `payments:write`.
- **Описание:** Refund a successful Uzum payment. Must be PAID, must have `providerTransactionId`. Calls `uzumApiClient.refundPayment` with `X-Operation-Id = <paymentId>-reversal` (idempotent across retries). On success, in one tx: Payment → REFUNDED (+ `providerPayload.reversalAt/reversalBy/reversalOperation`) and Order → `paymentStatus=refunded`.
- **Errors:** 400 (not Uzum / not paid / no Uzum orderId / Uzum rejected refund), 404.
- **Note:** the equivalent transition can also arrive via the acquiring callback (`REFUND × SUCCESS`); `markRefunded` is idempotent so the duplicate is safe.

---

## 8. Blog

Module: `src/blog`. Router prefix: `/api/v1/blog`. CMS routes are registered **before** `/:store` to avoid `cms` being interpreted as a store.

Supports all 4 stores (`nutrition | kids | halal | family`). The blog model was simplified in commits `9822c64` → `9270bb3` → `631d46d`:
- `BlogPostDistribution` model + association — **dropped**. A post belongs to exactly one store.
- `distributeTo: StoreSlug[]` — **dropped** from DTOs, payload, and DB.
- `store` — `NOT NULL` and required in the create DTO. There is no `null` / `global` post anymore.
- `paranoid` / `deletedAt` — **dropped**. Delete is a hard `DELETE`.
- `POST /blog/cms/:id/restore` — **dropped**.
- `BlogPostProduct.store` — kept as denormalised copy of `product.store`, but no longer part of the primary key.

**Family CMS access:** an admin with `store='family'` (or any super_admin) can read/create/update/delete family blog posts. Marketplace-scoped admins still get 403 if they touch family posts (cross-store mismatch).

### Enums
- `BlogPostStatus`: `draft | published | archived`.
- `store: StoreSlug` — required, one of `nutrition | kids | halal | family`.

### `GET /blog/cms`
- **Auth:** `blog:read`.
- **Query (`listBlogPostsQueryDto`):** `store?: StoreSlug`, `status?: BlogPostStatus`, `tag?: string`, `limit?: int 1–100`, `offset?: int ≥0`.
- **Behavior:** for `role=admin` the service forces the filter to `req.user.store` (a marketplace admin cannot see other stores' posts; a family admin sees only family posts). super_admin sees everything; if `?store=` is passed, it is honoured as-is.

### `POST /blog/cms`
- **Auth:** `blog:write`. Non-super admins can only create posts for their own store; the service throws 403 otherwise.
- **Body (`createBlogPostDto`):**
  | field             | type                                      | required | rules                                              |
  |-------------------|-------------------------------------------|----------|----------------------------------------------------|
  | `title`           | `{uz,ru,en}`                              | yes      | each 1–50 000 chars; `<script>`/`<iframe>` etc. and inline `on*=` attrs blocked |
  | `content`         | `{uz,ru,en}`                              | yes      | same XSS guard                                     |
  | `excerpt`         | `{uz,ru,en}`                              | no       |                                                    |
  | `slug`            | string                                    | no       | 1–120, `^[a-z0-9]+(?:-[a-z0-9]+)*$`; auto from title.uz if omitted |
  | `coverImageUrl`   | URL \| null                               | no       |                                                    |
  | `store`           | StoreSlug                                 | **yes**  | one of `nutrition | kids | halal | family`. Regular admin must match own store; super_admin may pick any. |
  | `seoTitle`        | `{uz,ru,en}`                              | no       |                                                    |
  | `seoDescription`  | `{uz,ru,en}`                              | no       |                                                    |
  | `seoKeywords`     | string[]                                  | no       |                                                    |
  | `tags`            | string[]                                  | no       |                                                    |
  | `readTimeMinutes` | int > 0 \| null                           | no       |                                                    |
- **Errors:** 409 `(store, slug)` collision (caught race-safely from `UniqueConstraintError`), 422, 403 cross-store.

### `GET /blog/cms/:id`
- **Auth:** `blog:read` + `requireResourceStoreAccess`.

### `PATCH /blog/cms/:id`
- **Auth:** `blog:write` + resource-store. Body = `updateBlogPostDto` — partial of create, **but `store` is intentionally omitted** (the post's store is immutable per swagger contract). Slug changes are conflict-checked against the current store.

### `DELETE /blog/cms/:id`
- **Auth:** `blog:delete` + resource-store. **Hard delete** — row is removed from `blog_posts`. Cover image (if local upload) is deleted from disk.

### `POST /blog/cms/:id/cover`
- **Auth:** `blog:write` + resource-store.
- **Middleware:** `uploadBlogCover` (multer + size/mime check) → `optimizeImage` (Sharp).
- **Body:** `multipart/form-data` with `image` file.
- **Response 200:** updated post (with new `coverImageUrl`).
- **Side effects:** previous local cover is unlinked from disk.
- **Errors:** 400 if no file.

### `POST /blog/cms/:id/publish`
- **Auth:** `blog:write` + resource-store. Sets `status=published, publishedAt=now`. Only valid from `draft` or `archived` (else 400).

### `POST /blog/cms/:id/archive`
- **Auth:** `blog:write` + resource-store. Sets `status=archived`.

### `GET /blog/cms/:id/products`
- **Auth:** `blog:read` + resource-store check.
- **Response:** attached product cards.

### `POST /blog/cms/:id/products`
- **Auth:** `blog:write` + resource-store.
- **Attachment rule (commit `9270bb3`):**
  - **Marketplace post** (`store ∈ {nutrition, kids, halal}`): `product.store` MUST equal `post.store`. Otherwise 400.
  - **Family post** (`store = family`): `product.store` may be any of the 3 marketplaces (cross-promotion). The denormalised `BlogPostProduct.store` is auto-populated from `product.store`; clients do not (and cannot) set it.
- **Body (`attachProductDto`):**
  | field       | type                          | required | rules                                    |
  |-------------|-------------------------------|----------|------------------------------------------|
  | `productId` | UUID                          | yes      |                                          |
  | `note`      | string \| null                | no       | ≤ 500                                    |
  | `sortOrder` | int ≥ 0                       | no       |                                          |

  Note: the `store` field that previously appeared in this DTO has been removed (commit `842a745`).

### `PATCH /blog/cms/:id/products/:productId`
- **Body:** `{ note?: string<=500|null, sortOrder?: int≥0 }`.

### `DELETE /blog/cms/:id/products/:productId`
- **Auth:** `blog:write` + resource-store. Detaches.

### `GET /blog/:store`
- **Описание:** Публичная лента published-постов. `:store` = `nutrition | kids | halal | family`. The legacy `global` pseudo-store has been removed (commits `3f0f879` / `e5fb54f`). Unknown values → 404 `Store not found`.
- **Query:** `limit?=20` (capped at 100), `offset?=0`.
- **Response:** `BlogPost[]` (published only, single-store).

### `GET /blog/:store/:slug`
- **Описание:** Детальная страница поста + attached products (for family posts, products belong to marketplace stores). Регистрирует view через Redis bucket (`recordView(postId, ip)`).
- **`:store`** = `nutrition | kids | halal | family`.
- **Errors:** 404 unknown store / unknown slug.

---

## 9. Site CMS

Module: `src/site`. Router prefix: `/api/v1/sites`. `Page → Sections (1..n)` + per-store `Settings`. Public endpoints are Redis-cached and return ETag/304.

Supports all 4 stores via `:store` path param (`nutrition | kids | halal | family`). All CMS routes go through `storeParam → requireAuth → requireStoreAccess((req) => req.params.store)`. `:store=family` is allowed for super_admin and for any admin whose own `store='family'`; cross-store admins (e.g. nutrition admin requesting `:store=family`) are rejected with 403.

### Enums / types
- `SectionType`: `hero | text_block | features | gallery | cta | faq | stats | team | reviews | custom`.
- Each type has a typed `content` shape (`HeroContent`, `TextBlockContent`, `FeaturesContent`, `GalleryContent`, `CtaContent`, `FaqContent`, `StatsContent`, `TeamContent`, `ReviewsContent`, or free-form `custom`).
- `style` (optional): `{ backgroundColor?: '#hex', textColor?: '#hex', paddingTop?: 0–200, paddingBottom?: 0–200, maxWidth?: string(≤20) }`.

### `GET /sites/:store/settings`
- **Описание:** Public site settings (branding, colors, typography, contact, socialLinks, navigation, footer, customHeadCode).
- **Response:** settings object; ETag + `Cache-Control: public, max-age=60, must-revalidate`.
- 304 if `If-None-Match` matches.

### `GET /sites/:store/:slug/config`
- **Описание:** Unified JSON for rendering a full page: `{ settings, page: SitePage & { sections: visible[] } }`.
- Cached, ETagged.

### `GET /sites/:store/:slug`
- **Описание:** Published page + visible sections. Cached.
- **Errors:** 404.

### `GET /sites/cms/:store/pages`
- **Auth:** `site:manage` + `requireStoreAccess(params.store)`.
- **Response:** `SitePage[]`.

### `GET /sites/cms/:store/pages/:slug`
- **Auth:** `site:manage`. Returns unpublished+published page.

### `POST /sites/cms/:store/pages`
- **Auth:** `site:manage`.
- **Body (`createPageSchema`):**
  | field             | type                              | required | rules                                    |
  |-------------------|-----------------------------------|----------|------------------------------------------|
  | `slug`            | string                            | yes      | 1–100, `^[a-z0-9-]+$`                    |
  | `metaTitle`       | `{ lang: string }`                | no       | i18n map                                 |
  | `metaDescription` | `{ lang: string }`                | no       |                                          |
  | `ogImage`         | string ≤ 500                      | no       |                                          |
  | `ogType`          | string ≤ 50                       | no       |                                          |
  | `canonicalUrl`    | string ≤ 500                      | no       |                                          |
  | `structuredData`  | object                            | no       |                                          |

### `PATCH /sites/cms/:store/pages/:id`
- **Body:** partial of create DTO (all fields nullable for unset).

### `PATCH /sites/cms/:store/pages/:id/publish`
- **Body:** `{ "publish": true | false }`.
- Invalidates Redis cache for `:store/:slug` and the page-config key.

### `DELETE /sites/cms/:store/pages/:id/:slug`
- Delete by id, invalidate cache by slug. Returns 204.

### `GET /sites/cms/:store/pages/:pageId/sections`
- **Response:** `SiteSection[]` ordered by `sortOrder`.

### `POST /sites/cms/:store/pages/:pageId/:slug/sections`
- **Body (`createSectionSchema`):**
  | field       | type                                         | required | rules                                      |
  |-------------|----------------------------------------------|----------|--------------------------------------------|
  | `type`      | SectionType                                  | yes      | enum                                       |
  | `content`   | object (type-dependent)                      | yes      | see section shapes above                   |
  | `style`     | `{ backgroundColor?, textColor?, ... }` \| null | no     |                                            |
  | `sortOrder` | int ≥ 0                                      | no       |                                            |
- Invalidates page cache.

### `PATCH /sites/cms/:store/pages/:pageId/:slug/sections/reorder`
- **Body:** `{ "ids": ["<uuid>", ...] }` (min 1, must be unique). The list MUST contain **exactly all** section ids of the page — partial reorders are rejected with 400 `BAD_REQUEST` ("ids must include exactly all sections of the page") to avoid leaving duplicate `sortOrder` values. Reassigns `sortOrder` to the array index inside one transaction.
- **Errors:** 404 если страница не найдена; 400 если ids дублируются, не уникальны или не покрывают все секции.

### `PUT /sites/cms/:store/pages/:slug/sections/:id`
- **Body (`updateSectionSchema`):** `{ type?, content?, style?, isVisible? }`.

### `DELETE /sites/cms/:store/pages/:slug/sections/:id`
- 204.

### `GET /sites/cms/:store/settings`
- **Auth:** `site:manage`.

### `PATCH /sites/cms/:store/settings`
- **Body (`updateSettingsSchema`):**
  - `branding?: { logoUrl?, faviconUrl?, siteName?: i18n }`
  - `colors?: { primary?, secondary?, accent?, background?, text? }` (hex `^#[0-9a-fA-F]{3,8}$`)
  - `typography?: { headingFont?, bodyFont?, baseFontSize?: 10–32 }`
  - `contact?: { phone?<=30, email?, address?: i18n, workingHours?<=200 }`
  - `socialLinks?: [{ platform: string(1–50), url: URL, icon?<=100 }]`
  - `navigation?: NavItem[]` where `NavItem = { id: UUID, label: i18n, url, target: _self|_blank, sortOrder, isVisible, children?: NavChild[] }`
  - `footer?: { columns?: FooterColumn[], copyright?: i18n }` where column = `{ title: i18n, links: [{ label: i18n, url, target? }] }`
  - `customHeadCode?: string<=5000 | null`

### `POST /sites/cms/:store/upload`
- **Auth:** `site:manage`.
- **Middleware:** `uploadSiteImage` (multer, size/mime check) → `optimizeImage` (Sharp).
- **Body:** multipart/form-data with `image` file.
- **Response:** `{ url: string }` — `${APP_URL}/public/<relative-path>`.
- **Errors:** 400 if no file.

---

## A. Workflows (end-to-end)

### A.1 Register → login → /me (new user + re-login)

```
Client                                   Server
------                                   ------
POST /auth/register { name, phone }  →   userRepository.findByPhone
                                     →   (none) → users.INSERT
                                         sendOtp(user) — SMS via Eskiz
                                     ←   201 { userId, phone, otp(dev) }

POST /auth/verify-otp { phone, otp } →   find user → verifyOtp()
                                         clearOtp()
                                         orderRepository.backfillUserIdByPhone
                                         for each store: linkSessionToUser(cookie)
                                         sign access + refresh
                                     ←   Set-Cookie: refresh-token=...
                                     ←   200 { user, accessToken, refreshToken }

GET /auth/me  (Authorization)        →   authService.getMe
                                     ←   200 { id, firstName, lastName, phone, ... }
```

Re-login path is the same — `/auth/register` on an existing phone re-sends OTP without overwriting profile, `/auth/verify-otp` issues new tokens.

### A.2 Guest cart → checkout CASH

```
POST /cart/nutrition/items { productId, quantity:2 }
  ↳ no cookie → server generates session token (nanoid32)
  ↳ Set-Cookie: cart_session_nutrition=<token>; httpOnly
  ↳ X-Cart-Token: <token>  (response header for mobile)
  ↳ 200 { cart: { items:[{...isAvailable:true}] } }

POST /cart/nutrition/items { productId:Y, quantity:1 }  (cookie replayed)
  ↳ 200 { cart: { items:[X,Y] } }

POST /orders/nutrition/checkout
  Body: { customerName, customerSurname, customerPhone:+998...,
          customerAddress, deliveryType:'delivery',
          paymentMethod:'cash', idempotencyKey:'<ulid>' }
  Cookie: cart_session_nutrition=<token>
  ↳ no existing order for (store,session,key)
  ↳ tx { decrementStockAtomic per item; create Order+OrderItems (paymentStatus=unpaid);
         delete cart }
  ↳ 201 { order: { id, status:'new', paymentStatus:'unpaid',
                    paymentMethod:'cash', totalAmount, items, reservedUntil:null },
          paymentUrl:null }

Admin later: PATCH /orders/cms/:id { status:'completed' }
  ↳ invariant: cash orders may be completed without paid status.
```

### A.3 Login-with-existing-guest-cart → merge → checkout CLICK

```
1) Guest builds cart cookie (as A.2).

2) POST /auth/verify-otp  (cookie travels alongside Authorization flow):
     inside handler → for each STORE_SLUG: linkSessionToUser(cookie, store, userId)
     - if user-cart already exists for (user,store): guest items merged
     - else: guest cart is converted to user-cart (user_id set)

3) POST /orders/nutrition/checkout  (Authorization: Bearer <access>)
     Body: { customerAddress, paymentMethod:'click', idempotencyKey:'<ulid>' }
     - missing customerName/Phone backfilled from user profile
     - cart resolved by userId (user-cart wins over cookie)
     - tx: stock decrement, create order (paymentStatus='pending',
           reserved_until = now+30m), delete cart
     ↳ 201 { order{...}, paymentUrl:null }

4) GET /payment/click/checkout-url?orderId=<id>  (Authorization required)
     ↳ 200 { url:'https://my.click.uz/services/pay?service_id=..&..', orderId, amountUzs }
     frontend redirects window.location = url

5) Click servers:
     POST /payment/click/prepare  (sign+amount checks; creates Payment if none;
                                   or updates checkout-precreated one)
       ↳ { error:0, merchant_confirm_id:<payment.id> }
     POST /payment/click/complete  { action:1, merchant_prepare_id:<payment.id>, error:0 }
       ↳ tx: Payment.status='paid', paidAt=now;
             Order.paymentStatus='paid'
       ↳ { error:0 }

6) Admin or customer can now watch order move: PATCH .../cms/:id { status:'processing' }
   → ... → 'completed' (DB invariant permits: paymentStatus=paid).
```

### A.4 Checkout PAYME (RPC flow)

```
1) POST /orders/<store>/checkout  paymentMethod:'payme', idempotencyKey
     ↳ order.paymentStatus='pending', reserved_until=now+30m

2) GET /payment/payme/checkout-url?orderId=<id>
     ↳ { url: 'https://checkout.paycom.uz/<base64(m=...;ac.order=<id>;a=<tiyin>;l=ru)>',
         orderId, amountTiyin }
     → frontend redirects.

3) Payme calls our RPC endpoint POST /payment/payme:
     - CheckPerformTransaction  (params: account.order, amount in tiyin)
         → resolveEntity, amount check, not-yet-paid
         → buildPaymeDetail (fiscal items, vat 12%, package_code)
         → { allow:true, detail:{items:[...]} }
     - CreateTransaction (params.id = paymeTxId, time, amount, account.order)
         → idempotent by (paymeTxId, payme)
         → link/update checkout-precreated pending Payment, or create a new one
         → providerPayload:{paymeTxTime}; expires_at = time + 12h
         → Order.paymentStatus='pending'
         → { create_time, transaction:<payment.id>, state:1 PENDING, detail }
     - PerformTransaction (params.id = paymeTxId)
         → Payment.status='paid', paidAt; providerPayload.performTime=now
         → Order.paymentStatus='paid'
         → { transaction, perform_time, state:2 COMPLETED, detail }
     (CheckTransaction for polling; GetStatement for reconciliation)
```

### A.5 Refund via Payme (CancelTransaction on PAID)

```
Payme calls POST /payment/payme { method:'CancelTransaction',
                                  params:{ id:<paymeTxId>, reason:5 REFUND } }

paymeService.cancelTransaction:
  if Payment.status=='paid':
    load Order (FOR UPDATE).
    if order.status=='completed' → return PAYME_ERR.ORDER_COMPLETED (-31007)
    else tx:
      Payment.status='refunded'; providerPayload.cancelTime/cancelReason=5
      for each OrderItem: productRepository.incrementStock(productId, qty, t)
      Order.status='cancelled', paymentStatus='refunded'
  → { transaction, cancel_time, state:-2 REFUNDED }
```

### A.6 Failed payment (Click `error < 0`)

```
Click POST /payment/click/complete with { error: -<n>, error_note, ... }

clickService.complete:
  verify sign.
  find Payment.
  tx:
    Payment.status='failed'; providerPayload.clickError=-<n>
    if Order.paymentStatus=='pending':
      for each OrderItem: productRepository.incrementStock
      Order.paymentStatus='failed', status='cancelled'
    else:
      Order.paymentStatus='failed' only
  return errResp(error=<n>)  (stored in payload; event ingested)
```

### A.7 Stale order expiration (StockReaper)

```
Every 2 minutes (configurable intervalMs):

tx:
  SELECT ... FROM orders
   WHERE payment_status='pending' AND reserved_until < NOW()
   LIMIT 500  FOR UPDATE SKIP LOCKED

for each stale order:
  if paymentStatus still 'pending' AND reserved_until < now:
    assertTransition(status, 'cancelled')
    for each OrderItem: productRepository.incrementStock
    orderRepository.expireStalePending(id, t)
      ↳ sets status='cancelled', paymentStatus='expired'
  else: skip (webhook already raced us)
```

Concurrency: multiple reaper processes do not block each other thanks to SKIP LOCKED. Batch=500 keeps tx size bounded.

### A.8 Admin creates product + category + media

```
1) super_admin POST /admin/  { name,email,password, storeSlug:'nutrition',
                               permissions:['categories:write','products:write','products:delete'] }
     ↳ 201 { admin }

2) admin POST /admin/login  → tokens with store='nutrition'.

3) POST /categories/  Authorization: Bearer <admin>
     Body: { name:{uz,ru,en}, slug, store:'nutrition', parentId:null, sortOrder:0, isActive:true }
     ↳ requireStoreAccess(body.store) → OK (same store)
     ↳ 201 { category }

4) POST /products/cms  Authorization: Bearer <admin>
     Body: { name:{...}, slug, sku, price, stock:100, store:'nutrition', categoryId:<uuid>,
             status:'draft', brand, attributes:{form:'tablet'} }
     ↳ 201 { product }

5) POST /products/cms/:id/media
     Body: { url:'https://cdn/.../img.jpg', type:'image', isMain:true, sortOrder:0 }
     ↳ 201 { media }

6) PATCH /products/cms/:id/status  { status:'active' }  ← goes live.

Attempt from another store's admin:
  GET /products/cms/:id  → requireResourceStoreAccess loads product.store,
  compares to req.user.store → 403.
```

### A.9 Blog post + product attachment + publish

```
1) POST /blog/cms  { title, content, slug, store:'kids', tags:['vitamins'] }
     ↳ service scoping: admin.store='kids' may create; admin.store='nutrition' → 403;
       super_admin may set any of nutrition|kids|halal|family.
     ↳ 201 { post: { id, status:'draft', store:'kids' } }

2) (optional) POST /blog/cms/:id/cover  multipart { image: <file.jpg> }
     ↳ 200 { post with coverImageUrl }

3) POST /blog/cms/:id/products  { productId, note:'best seller', sortOrder:0 }
     ↳ service rule: marketplace post → product.store must equal post.store ('kids');
                     family post     → product.store may be any of the 3 marketplaces.
     ↳ BlogPostProduct.store is set automatically from product.store.
     ↳ 201 { attachment }

4) POST /blog/cms/:id/publish
     ↳ status='published', publishedAt=now.
     ↳ Post lives in exactly one store — no fan-out. Cross-promotion is achieved
       only by family posts attaching marketplace products (read-side only).

5) Public:
   GET /blog/kids            → listed
   GET /blog/kids/:slug      → full post + attached product cards
                               → viewCounter.recordView(postId, ip) in Redis
```

### A.10 Numa Family (informational site) — family-admin or super_admin workflow

```
`family` has no marketplace surface. It is managed via site CMS + blog CMS by:
  - any super_admin, OR
  - an admin whose `store='family'` (created by super_admin via POST /admin/).

Marketplace-scoped admins (store='nutrition'|'kids'|'halal') still get 403 on
any /sites/cms/family/* or family blog post.

1) super_admin POST /admin/  Body:{ name, email, password, storeSlug:'family',
                                      permissions:['site:manage','blog:read','blog:write','blog:delete'] }
   ↳ 201 { admin } — new family admin.
   POST /admin/login  → token (role='admin', store='family', permissions=[...]).
   (Or skip: super_admin token works equally well.)

2) PATCH /sites/cms/family/settings
   Body: { branding:{ siteName:{ru:'Numa Family', uz:'Numa Family', en:'Numa Family'},
                      logoUrl:'/public/sites/family-logo.png' },
           navigation:[{ id:<uuid>, label:{ru:'О проекте',...}, url:'/about',
                          target:'_self', sortOrder:0, isVisible:true }],
           footer:{ copyright:{ru:'© Numa Family', ...} } }
   ↳ storeParam validates ':store' = 'family' (allowed, family is in STORE_SLUGS).
   ↳ requireStoreAccess('family') — passes for super_admin and family admin.
   ↳ 200 settings cache invalidated for store='family'.

3) POST /sites/cms/family/pages  Body:{ slug:'about', metaTitle:{ru:'О нас'} }
   POST /sites/cms/family/pages/:pageId/about/sections  Body:{ type:'hero', content:{...}, sortOrder:0 }
   PATCH /sites/cms/family/pages/:id/publish  { publish:true }

4) POST /blog/cms  Body:{ title, content, slug, store:'family' }
   ↳ family admin: passes (store matches own).
   ↳ super_admin: passes (any store allowed).
   ↳ marketplace admin: 403 ("Cannot create post in a different store").
   POST /blog/cms/:id/products { productId } — product can be from any marketplace.
   POST /blog/cms/:id/publish

5) Public reads (no auth):
   GET /sites/family/settings          → published settings (ETag-cached)
   GET /sites/family/about/config      → unified page config
   GET /blog/family                    → family-only feed
   GET /blog/family/:slug              → family post + attached marketplace products

6) Cross-contamination attempts (all rejected):
   POST /cart/family/items             → 400 "Valid values: nutrition, kids, halal"
   POST /orders/family/checkout        → 400
   POST /products/cms  { store:'family' } → 422 (Zod, MARKETPLACE_STORE_SLUGS only)
   admin with store='nutrition' PATCH /sites/cms/family/pages/:id → 403
   admin with store='nutrition' POST /blog/cms { store:'family', ... } → 403
```

### A.11 Site CMS page lifecycle (cache invalidation)

```
1) GET /sites/cms/nutrition/settings → current SiteSettings.
2) PATCH /sites/cms/nutrition/settings  { branding:{ logoUrl:'/public/.../logo.png' } }
    ↳ updates DB; invalidates settings cache key.

3) POST /sites/cms/nutrition/pages  { slug:'about', metaTitle:{ru:'О нас'} }
    ↳ 201 { page }

4) POST /sites/cms/nutrition/pages/:pageId/about/sections
    Body: { type:'hero', content:{ heading:{ru:'...', uz:'...', en:'...'},
                                    bgImageUrl:'/public/...' }, sortOrder:0 }

5) POST /sites/cms/nutrition/pages/:pageId/about/sections  (type:'features' …)

6) PATCH /sites/cms/nutrition/pages/:pageId/about/sections/reorder  { ids:[...] }

7) PATCH /sites/cms/nutrition/pages/:id/publish  { publish:true }
    ↳ page cache invalidated for slug 'about'; next GET repopulates.

8) GET /sites/nutrition/about/config  → cached response (ETag), 304 on revalidate.
```

---

## B. Permissions (RBAC)

Source: `src/admin/dto/permissionDto.ts` → enum `Permission`. `super_admin` bypasses permission checks.

| Key                    | Guards which endpoints                                                               |
|------------------------|---------------------------------------------------------------------------------------|
| `products:read`        | `GET /products/cms`, `GET /products/cms/:id`                                         |
| `products:write`       | `POST/PATCH /products/cms*`, media add/update/setMain, status, restore                |
| `products:delete`      | `DELETE /products/cms/:id`, `DELETE .../media/:mediaId`                              |
| `categories:read`      | `GET /categories/`, `GET /categories/id/:id`, `GET /categories/:store`               |
| `categories:write`     | `POST /categories/`, `PATCH /categories/:id`                                         |
| `categories:delete`    | `DELETE /categories/:id`                                                             |
| `orders:read`          | `GET /orders/cms`, `GET /orders/cms/:id`                                             |
| `orders:write`         | `PATCH /orders/cms/:id` (status transitions incl. cancel+stock restore)              |
| `payments:read`        | `GET /payment/cms/transactions*`, `click-status`                                     |
| `payments:write`       | `DELETE /payment/cms/transactions/:id/reversal`                                      |
| `blog:read`            | `GET /blog/cms`, `GET /blog/cms/:id`, `GET /blog/cms/:id/products`                   |
| `blog:write`           | `POST/PATCH /blog/cms*`, cover upload, publish, archive, attachProduct, updateProduct, detachProduct |
| `blog:delete`          | `DELETE /blog/cms/:id` (hard delete; no restore)                                     |
| `site:manage`          | All `/sites/cms/*` (pages, sections, settings, upload)                               |
| `users:read`           | `GET /admin/users`, `GET /admin/users/:id`                                           |
| `users:write`          | `POST /admin/users/:id/activate`, `.../deactivate`                                   |

`DEFAULT_ADMIN_PERMISSIONS = []` — new admins created by super_admin have no access until permissions are granted.

`super_admin` exclusive endpoints (not gated by permissions but by `requireSuperAdmin`):
- `GET/POST /admin/`, `GET /admin/permissions`, `GET/PATCH /admin/:id`, `PATCH /admin/:id/permissions`, `PATCH /admin/:id/password`, `POST /admin/:id/activate|deactivate`, `DELETE /admin/:id`.
- (`POST /blog/cms/:id/restore` no longer exists — blog delete is hard.)

**Numa Family CMS surface (`store='family'`):**
Family content is managed by either super_admin OR a regular admin with `store='family'`. The previous super-admin-only carve-out has been dropped (commit `79b04b5`).

| Path                                | Access                                                                                  |
|-------------------------------------|-----------------------------------------------------------------------------------------|
| Public `GET /sites/family/*`        | Open, no auth                                                                           |
| Public `GET /blog/family[/:slug]`   | Open, no auth                                                                           |
| `/sites/cms/family/*`               | super_admin or admin with `store='family'` and `site:manage`. Other admins → 403.       |
| `GET/POST/PATCH/DELETE /blog/cms/*` for `store='family'` posts | super_admin or family admin (with the relevant `blog:*` perm). Other admins → 403.      |
| `POST /blog/cms` with body `store:'family'` | same — non-family non-super admin → 403 via `requireStoreAccess(body.store)`.    |

---

## C. Background jobs

All jobs are in-process (started from `src/main.ts`), not BullMQ. Graceful shutdown clears each interval.

### C.1 StockReaper (`src/order/service/stockReaper.ts`)
- **Interval:** 2 minutes (`intervalMs=2*60*1000`).
- **Batch:** 500 orders per tick.
- **What:** `SELECT ... WHERE payment_status='pending' AND reserved_until < now() FOR UPDATE SKIP LOCKED`. For each: re-check state, assertTransition(status, cancelled), `productRepository.incrementStock` for each OrderItem, `orderRepository.expireStalePending` sets `status='cancelled'`, `paymentStatus='expired'`.
- **Idempotency:** defensive re-check that `paymentStatus==='pending' && reserved_until < now` protects against racing webhooks. `SKIP LOCKED` prevents multi-replica contention.
- **Failure:** caught, logged; next tick retries.

### C.2 viewCounterFlush (`src/blog/service/viewCounter.ts`)
- **Interval:** 60 seconds.
- **Buckets:** hourly Redis hash keys `blog_views:<YYYY-MM-DDTHH>`; each field = `postId`, value = count.
- **Dedup:** `SET viewed:<postId>:<ip> 1 EX 300 NX` — at most 1 view per (post, ip) per 5 minutes.
- **Flush:** scan `blog_views:*` → per-key atomic `HGETALL` + `DEL` via `multi.exec()` → aggregate counts → one `UPDATE blog_posts SET view_count += delta` per post.
- **Failure tolerance:** if Redis unavailable, `recordView` silently returns; request path unaffected; counter simply pauses.

### C.3 cartReaper (`src/cart/service/cartReaper.ts`)
- **Interval:** 1 hour.
- **What:** `cartRepository.deleteExpired()` — removes carts past their TTL.
- **Handle:** `unref()`ed so it doesn't hold the event loop alive on its own.

### C.4 gracefulShutdown / trackActiveRequests (`shared/utils/gracefulShutdown.ts`)
- **Signals handled:** `SIGTERM`, `SIGINT`, plus `uncaughtException` / `unhandledRejection` (treated as fatal).
- **Flow:**
  1. `isShuttingDown = true`. New requests → `503 Server shutting down` with `Connection: close`.
  2. `server.close()` — stop accepting new connections.
  3. Poll `activeRequests` set every 500 ms; when empty → proceed.
  4. Hard timeout 30 s → `process.exit(1)`.
  5. Run `onShutdown` hook from main (`clearInterval` on stockReaper, viewCounter, cartReaper).
  6. Close DB pool + Redis in parallel.
  7. `process.exit(0)` on clean shutdown, `1` on any error.

`trackActiveRequests` middleware runs before any route: adds request id (or synthetic) to the tracking set; cleanup on `res.on('finish'|'close')`.
