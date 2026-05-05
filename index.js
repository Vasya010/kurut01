const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const nodemailer = require("nodemailer");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const publicDomain = process.env.PUBLIC_DOMAIN || "https://vasya010-backend1-10db.twc1.net";
const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_123";

// Valid roles for validation
const VALID_ROLES = ['USER', 'ADMIN', 'SUPER_ADMIN', 'REALTOR'];

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.S3_REGION || "ru-1",
  endpoint: process.env.S3_ENDPOINT || "https://s3.twcstorage.ru",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "GIMZKRMOGP4F0MOTLVCE",
    secretAccessKey: process.env.S3_SECRET_KEY || "WvhFfIzzCkITUrXfD8JfoDne7LmBhnNzDuDBj89I",
  },
  forcePathStyle: true,
});

const bucketName = process.env.S3_BUCKET || "a2c31109-3cf2c97b-aca1-42b0-a822-3e0ade279447";

const gmailUser = "vasyaproger97@gmail.com";
const gmailAppPassword = "beai hwha jfmz aavl".replace(/\s+/g, "");

function createMailTransport() {
  if (!gmailUser || !gmailAppPassword) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });
}

const mailTransport = createMailTransport();

function buildPasswordResetEmail({ fullName, resetLink }) {
  const safeName = String(fullName || "пользователь");
  return `
    <div style="margin:0;padding:24px;background:#050816;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e4e4e7;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,.12);border-radius:22px;overflow:hidden;background:
        radial-gradient(circle at 100% 0%,rgba(168,85,247,.22),transparent 45%),
        radial-gradient(circle at 0% 100%,rgba(34,211,238,.16),transparent 45%),
        linear-gradient(180deg,rgba(24,24,27,.92),rgba(9,9,11,.96));box-shadow:0 24px 80px -30px rgba(2,6,23,.9);">
        <div style="padding:30px 30px 16px;">
          <div style="display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.2);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c4b5fd;">Kurut Security</div>
          <h1 style="margin:14px 0 8px;font-size:28px;line-height:1.2;color:#fff;">Восстановление пароля</h1>
          <p style="margin:0;color:#cbd5e1;font-size:14px;">Здравствуйте, ${safeName}. Мы получили запрос на смену пароля.</p>
        </div>
        <div style="padding:22px 30px 30px;">
          <p style="margin:0 0 16px;color:#d4d4d8;font-size:14px;">Нажмите кнопку ниже, чтобы задать новый пароль. Ссылка действует <b>30 минут</b>.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 18px;border-radius:12px;background:linear-gradient(90deg,#7c3aed,#d946ef);color:#fff;text-decoration:none;font-weight:600;">Сбросить пароль</a>
          <p style="margin:16px 0 6px;color:#71717a;font-size:12px;">Если кнопка не работает, откройте ссылку вручную:</p>
          <p style="margin:0;word-break:break-all;color:#a1a1aa;font-size:12px;">${resetLink}</p>
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08);font-size:12px;color:#71717a;">
            Если вы не запрашивали смену пароля, просто проигнорируйте это письмо.
          </div>
        </div>
      </div>
    </div>
  `;
}




const corsOrigins = (process.env.FRONTEND_ORIGIN ||
  "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,https://kurutnet.online"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const frontendResetBaseUrl =
  String(process.env.FRONTEND_RESET_URL || "").trim() ||
  corsOrigins[0] ||
  "http://localhost:5173";

app.use(
  cors({
    origin(origin, cb) {
      const ok = !origin || corsOrigins.includes(origin);
      cb(null, ok);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


// JSON Middleware
app.use(express.json());

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // List of common image MIME types
    const allowedImageTypes = [
      'image/jpeg',          // .jpg, .jpeg
      'image/png',           // .png
      'image/gif',           // .gif
      'image/bmp',           // .bmp
      'image/tiff',          // .tiff, .tif
      'image/webp',          // .webp
      'image/heic',          // .heic (iPhone HEIF format)
      'image/heif',          // .heif
      'image/svg+xml',       // .svg
      'image/x-icon',        // .ico
      'image/vnd.microsoft.icon', // .ico (alternate MIME type)
      'image/jp2',           // .jp2 (JPEG 2000)
      'image/avif'           // .avif
    ];

    if (allowedImageTypes.includes(file.mimetype)) {
      console.log(`File ${file.originalname} accepted for upload`);
      cb(null, true);
    } else {
      console.error(`File ${file.originalname} rejected: Invalid MIME type ${file.mimetype}`);
      cb(new Error('Недопустимый формат файла. Разрешены только изображения (JPEG, PNG, GIF, BMP, TIFF, WebP, HEIC, HEIF, SVG, ICO, JP2, AVIF).'), false);
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // Лимит 100 МБ
});

// MySQL Connection Pool
const dbConfig = {
  host: "vh446.timeweb.ru",
  user: "cz45780_kururtne",
  password: "Vasya11091109",
  database: "cz45780_kururtne",
  port: 3306,
  connectionLimit: 10,
};
const pool = mysql.createPool(dbConfig);

/** Глобальная подписка / оплата: до какой даты сервис доступен (кроме SUPER_ADMIN) */
let siteSubscriptionCache = { at: 0, row: null };
const SITE_SUB_CACHE_MS = 8000;

async function getSiteSubscription() {
  const t = Date.now();
  if (siteSubscriptionCache.row != null && t - siteSubscriptionCache.at < SITE_SUB_CACHE_MS) {
    return siteSubscriptionCache.row;
  }
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT valid_until, payment_amount, payment_currency, payment_note, maintenance_mode FROM site_subscription WHERE id = 1"
    );
    const row =
      rows.length > 0
        ? rows[0]
        : { valid_until: null, payment_amount: null, payment_currency: "USD", payment_note: null, maintenance_mode: 0 };
    siteSubscriptionCache = { at: Date.now(), row };
    return row;
  } catch (e) {
    const fallback = { valid_until: null, payment_amount: null, payment_currency: "USD", payment_note: null, maintenance_mode: 0 };
    siteSubscriptionCache = { at: Date.now(), row: fallback };
    return fallback;
  } finally {
    if (connection) connection.release();
  }
}

function invalidateSiteSubscriptionCache() {
  siteSubscriptionCache = { at: 0, row: null };
}

async function siteSubscriptionAllowsRequest(req, res) {
  if (!req.user || req.user.role === "SUPER_ADMIN") return true;
  if (req.path === "/api/logout") return true;
  if (req.path === "/api/me") return true;
  const row = await getSiteSubscription();
  if (Number(row.maintenance_mode) === 1) {
    res.status(503).json({
      error: "Сервис временно недоступен: включён режим обслуживания.",
      code: "SITE_MAINTENANCE_MODE",
    });
    return false;
  }
  if (!row.valid_until) return true;
  if (new Date(row.valid_until).getTime() <= Date.now()) {
    res.status(402).json({
      error:
        "Срок доступа к сервису истёк. Продлите подписку в зоне разработчика (Developer Zone) или обратитесь к владельцу.",
      code: "SITE_SUBSCRIPTION_EXPIRED",
      validUntil: row.valid_until,
    });
    return false;
  }
  return true;
}

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// JWT Authentication Middleware
const authenticate = async (req, res, next) => {
  // Authorization: "Bearer <jwt>"
  const auth = req.headers.authorization;
  const token = auth ? auth.split(/\s+/)[1]?.trim() : undefined;
  if (!token) {
    console.error("Authentication error: Token missing");
    return res.status(401).json({ error: "Токен отсутствует" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT id, role, first_name, last_name, token FROM users1 WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      connection.release();
      console.error("Authentication error: User not found for token, user ID:", decoded.id);
      return res.status(401).json({ error: "Недействительный токен" });
    }

    // If JWT is valid but token in DB doesn't match (e.g. app restarts / token mismatch),
    // update stored token to current token so the session stays stable.
    const dbToken = users[0].token;
    if (!dbToken || dbToken !== token) {
      try {
        await connection.execute("UPDATE users1 SET token = ? WHERE id = ?", [token, users[0].id]);
      } catch (e) {
        // If update fails, still allow request if JWT is valid.
      }
    }

    connection.release();
    req.user = { ...decoded, first_name: users[0].first_name, last_name: users[0].last_name };
    if (!(await siteSubscriptionAllowsRequest(req, res))) return;
    next();
  } catch (error) {
    // Fallback: if JWT verification fails but token exists in DB,
    // treat it as a valid session token (prevents logout loops on token mismatch).
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.execute(
        "SELECT id, role, first_name, last_name, token FROM users1 WHERE token = ? LIMIT 1",
        [token]
      );
      connection.release();

      if (users.length > 0) {
        req.user = {
          id: users[0].id,
          role: users[0].role,
          first_name: users[0].first_name,
          last_name: users[0].last_name,
        };
        if (!(await siteSubscriptionAllowsRequest(req, res))) return;
        return next();
      }
    } catch (e) {
      // ignore fallback errors and fallthrough to 401
    }

    console.error("Authentication error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(401).json({ error: "Недействительный токен" });
  }
};

// Database Connection Test and Setup
async function testDatabaseConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Database connection established successfully!");

    // Create users1 table
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users1'");
    if (tables.length === 0) {
      console.log("Creating users1 table...");
      await connection.execute(`
        CREATE TABLE users1 (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(255) NOT NULL,
          profile_picture VARCHAR(255) DEFAULT NULL,
          password VARCHAR(255) NOT NULL,
          token TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Create properties table
    const [propTables] = await connection.execute("SHOW TABLES LIKE 'properties'");
    if (propTables.length === 0) {
      console.log("Creating properties table...");
      await connection.execute(`
        CREATE TABLE properties (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          type_id VARCHAR(255) DEFAULT NULL,
          repair VARCHAR(255) DEFAULT NULL,
          series VARCHAR(255) DEFAULT NULL,
          zhk_id VARCHAR(255) DEFAULT NULL,
          document_id INT NOT NULL DEFAULT 0,
          owner_name VARCHAR(255) DEFAULT NULL,
          owner_phone VARCHAR(50) DEFAULT NULL,
          curator_id INT UNSIGNED DEFAULT NULL,
          price DECIMAL(15,2) NOT NULL,
          unit VARCHAR(50) DEFAULT NULL,
          rukprice DECIMAL(15,2) NOT NULL,
          mkv DECIMAL(10,2) NOT NULL,
          rooms VARCHAR(10) DEFAULT NULL,
          phone VARCHAR(50) DEFAULT NULL,
          district_id VARCHAR(255) DEFAULT NULL,
          subdistrict_id VARCHAR(255) DEFAULT NULL,
          address TEXT NOT NULL,
          notes TEXT DEFAULT NULL,
          description TEXT DEFAULT NULL,
          latitude DECIMAL(10,6) DEFAULT NULL,
          longitude DECIMAL(10,6) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          photos TEXT DEFAULT NULL,
          document VARCHAR(255) DEFAULT NULL,
          status VARCHAR(50) DEFAULT NULL,
          owner_id INT DEFAULT NULL,
          etaj INT NOT NULL,
          etajnost INT NOT NULL,
          FOREIGN KEY (curator_id) REFERENCES users1(id) ON DELETE SET NULL
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);
    } else {
      // Check and add owner_phone column if not exists
      const [ownerPhoneColumns] = await connection.execute(
        "SHOW COLUMNS FROM properties LIKE 'owner_phone'"
      );
      if (ownerPhoneColumns.length === 0) {
        console.log("Adding owner_phone column to properties table...");
        await connection.execute(
          "ALTER TABLE properties ADD COLUMN owner_phone VARCHAR(50) DEFAULT NULL"
        );
      }

      const [conditionColumns] = await connection.execute(
        "SHOW COLUMNS FROM properties LIKE 'condition'"
      );
      if (conditionColumns.length > 0) {
        console.log("Renaming column 'condition' to 'repair'...");
        await connection.execute("ALTER TABLE properties CHANGE COLUMN `condition` `repair` VARCHAR(255) DEFAULT NULL");
      }

      const [roomColumns] = await connection.execute(
        "SHOW COLUMNS FROM properties LIKE 'room'"
      );
      if (roomColumns.length > 0) {
        console.log("Renaming column 'room' to 'rooms'...");
        await connection.execute("ALTER TABLE properties CHANGE COLUMN `room` `rooms` VARCHAR(10) DEFAULT NULL");
      }
    }

    // Create jk table
    const [jkTables] = await connection.execute("SHOW TABLES LIKE 'jk'");
    if (jkTables.length === 0) {
      console.log("Creating jk table...");
      await connection.execute(`
        CREATE TABLE jk (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT DEFAULT NULL,
          address VARCHAR(255) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Create districts table
    const [districtTables] = await connection.execute("SHOW TABLES LIKE 'districts'");
    if (districtTables.length === 0) {
      console.log("Creating districts table...");
      await connection.execute(`
        CREATE TABLE districts (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Create subdistricts table
    const [subdistrictTables] = await connection.execute("SHOW TABLES LIKE 'subdistricts'");
    if (subdistrictTables.length === 0) {
      console.log("Creating subdistricts table...");
      await connection.execute(`
        CREATE TABLE subdistricts (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          district_id INT UNSIGNED NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Филиалы (офисы сети)
    const [branchTables] = await connection.execute("SHOW TABLES LIKE 'branches'");
    if (branchTables.length === 0) {
      console.log("Creating branches table...");
      await connection.execute(`
        CREATE TABLE branches (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(32) DEFAULT NULL,
          city VARCHAR(128) DEFAULT NULL,
          address VARCHAR(512) DEFAULT NULL,
          phone VARCHAR(64) DEFAULT NULL,
          email VARCHAR(255) DEFAULT NULL,
          director_name VARCHAR(255) DEFAULT NULL,
          work_hours VARCHAR(255) DEFAULT NULL,
          notes TEXT DEFAULT NULL,
          sort_order INT NOT NULL DEFAULT 0,
          is_active TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uk_branch_code (code)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Подписка / срок доступа к CRM (одна строка id=1)
    const [subscrTables] = await connection.execute("SHOW TABLES LIKE 'site_subscription'");
    if (subscrTables.length === 0) {
      console.log("Creating site_subscription table...");
      await connection.execute(`
        CREATE TABLE site_subscription (
          id INT UNSIGNED NOT NULL PRIMARY KEY,
          valid_until DATETIME NULL,
          payment_amount DECIMAL(12,2) NULL,
          payment_currency VARCHAR(8) NOT NULL DEFAULT 'USD',
          payment_note VARCHAR(512) NULL,
          maintenance_mode TINYINT(1) NOT NULL DEFAULT 0,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
      await connection.execute(
        "INSERT INTO site_subscription (id, valid_until, payment_amount, payment_currency, payment_note, maintenance_mode) VALUES (1, NULL, NULL, 'USD', NULL, 0)"
      );
    }
    // Миграция старых БД: отдельный флаг "сайт на обслуживании"
    try {
      await connection.execute(
        "ALTER TABLE site_subscription ADD COLUMN maintenance_mode TINYINT(1) NOT NULL DEFAULT 0"
      );
    } catch (e) {
      // Игнорируем, если колонка уже существует
    }

    // Уведомления для личного кабинета
    const [notificationTables] = await connection.execute("SHOW TABLES LIKE 'notifications'");
    if (notificationTables.length === 0) {
      console.log("Creating notifications table...");
      await connection.execute(`
        CREATE TABLE notifications (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          level VARCHAR(16) NOT NULL DEFAULT 'info',
          created_by INT UNSIGNED NULL,
          target_role VARCHAR(32) NOT NULL DEFAULT 'ALL',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_notifications_created_at (created_at),
          INDEX idx_notifications_target_role (target_role)
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    const [notificationReadsTables] = await connection.execute("SHOW TABLES LIKE 'notification_reads'");
    if (notificationReadsTables.length === 0) {
      console.log("Creating notification_reads table...");
      await connection.execute(`
        CREATE TABLE notification_reads (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          notification_id INT UNSIGNED NOT NULL,
          read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY uk_user_notification (user_id, notification_id),
          INDEX idx_notification_reads_user (user_id),
          FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Токены восстановления пароля
    const [passwordResetTables] = await connection.execute("SHOW TABLES LIKE 'password_reset_tokens'");
    if (passwordResetTables.length === 0) {
      console.log("Creating password_reset_tokens table...");
      await connection.execute(`
        CREATE TABLE password_reset_tokens (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          user_id INT UNSIGNED NOT NULL,
          token_hash CHAR(64) NOT NULL,
          expires_at DATETIME NOT NULL,
          used_at DATETIME NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_prt_user (user_id),
          INDEX idx_prt_token_hash (token_hash),
          INDEX idx_prt_expires_at (expires_at),
          CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users1(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
      `);
    }

    // Setup admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const [existingAdmin] = await connection.execute("SELECT id FROM users1 WHERE email = ?", [adminEmail]);

    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      const token = jwt.sign({ id: 1, role: "SUPER_ADMIN" }, jwtSecret, { expiresIn: "30d" });
      await connection.execute(
        "INSERT INTO users1 (first_name, last_name, email, phone, role, password, token) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ["Admin", "User", adminEmail, "123456789", "SUPER_ADMIN", hashedPassword, token]
      );
    } else {
      console.log("Updating admin user...");
      const token = jwt.sign({ id: existingAdmin[0].id, role: "SUPER_ADMIN" }, jwtSecret, { expiresIn: "30d" });
      await connection.execute("UPDATE users1 SET password = ?, token = ? WHERE email = ?", [hashedPassword, token, adminEmail]);
    }

    console.log("Admin login details:", { email: adminEmail, password: adminPassword, role: "SUPER_ADMIN" });
  } catch (error) {
    console.error("Database setup error:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    if (error.code === "ECONNREFUSED") {
      console.error("MySQL server not running or incorrect host/port.");
    }
  } finally {
    if (connection) connection.release();
  }
}

testDatabaseConnection();

// Test Endpoint
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Ala-Too backend!" });
});

// Публичная проверка, что фронт попал на этот инстанс API (без авторизации)
app.get("/public/dev/ping", (req, res) => {
  res.json({ ok: true, service: "kurut-api", ts: Date.now() });
});

// Публичный статус доступа к сайту (для баннера / гейта на фронте)
app.get("/public/site-access", async (req, res) => {
  try {
    const row = await getSiteSubscription();
    const maintenance = Number(row.maintenance_mode) === 1;
    const active = !row.valid_until || new Date(row.valid_until).getTime() > Date.now();
    res.json({ active, validUntil: row.valid_until, maintenance });
  } catch (e) {
    res.json({ active: true, validUntil: null, maintenance: false });
  }
});

app.post("/public/password-reset/request", async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "Email обязателен" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT id, email, first_name, last_name FROM users1 WHERE email = ? LIMIT 1",
      [email]
    );

    // Всегда возвращаем одинаковый ответ, чтобы не раскрывать, есть ли email в базе.
    if (users.length === 0 || !mailTransport) {
      return res.json({ ok: true, message: "Если email существует, инструкция отправлена." });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 минут

    await connection.execute(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL",
      [user.id]
    );
    await connection.execute(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
      [user.id, tokenHash, expiresAt]
    );

    const resetLink = `${frontendResetBaseUrl.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(token)}`;
    const fullName = `${String(user.first_name || "").trim()} ${String(user.last_name || "").trim()}`.trim() || "пользователь";

    const html = buildPasswordResetEmail({ fullName, resetLink });

    await mailTransport.sendMail({
      from: `"Kurut Security" <${gmailUser}>`,
      to: user.email,
      subject: "Kurut · Восстановление пароля",
      text: `Ссылка для восстановления пароля: ${resetLink} (действует 30 минут)`,
      html,
    });

    return res.json({ ok: true, message: "Если email существует, инструкция отправлена." });
  } catch (error) {
    console.error("POST /public/password-reset/request:", error);
    return res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/public/password-reset/confirm", async (req, res) => {
  const token = String(req.body?.token ?? "").trim();
  const password = String(req.body?.password ?? "");
  if (!token || !password) {
    return res.status(400).json({ error: "token и password обязательны" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Пароль должен быть не короче 8 символов" });
  }

  let connection;
  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = ?
       ORDER BY id DESC
       LIMIT 1`,
      [tokenHash]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: "Токен недействителен" });
    }
    const row = rows[0];
    if (row.used_at) {
      return res.status(400).json({ error: "Токен уже использован" });
    }
    if (new Date(row.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ error: "Срок действия токена истёк" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.beginTransaction();
    await connection.execute("UPDATE users1 SET password = ?, token = NULL WHERE id = ?", [hashedPassword, row.user_id]);
    await connection.execute("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?", [row.id]);
    await connection.commit();
    return res.json({ ok: true, message: "Пароль успешно обновлён" });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }
    console.error("POST /public/password-reset/confirm:", error);
    return res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Чтение / запись подписки (только SUPER_ADMIN)
app.get("/api/dev/site-access", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }
  try {
    const row = await getSiteSubscription();
    const maintenance = Number(row.maintenance_mode) === 1;
    const active = !row.valid_until || new Date(row.valid_until).getTime() > Date.now();
    res.json({
      active,
      validUntil: row.valid_until,
      payment_amount: row.payment_amount != null ? Number(row.payment_amount) : null,
      payment_currency: row.payment_currency || "USD",
      payment_note: row.payment_note || null,
      maintenance_mode: maintenance,
    });
  } catch (error) {
    console.error("GET /api/dev/site-access:", error);
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  }
});

app.put("/api/dev/site-access", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { valid_until, payment_amount, payment_currency, payment_note, maintenance_mode } = req.body || {};
  let validUntilSql = null;
  if (valid_until !== undefined && valid_until !== null && String(valid_until).trim() !== "") {
    const d = new Date(valid_until);
    if (Number.isNaN(d.getTime())) {
      return res.status(400).json({ error: "Некорректная дата valid_until" });
    }
    validUntilSql = d;
  }

  let amount = null;
  if (payment_amount !== undefined && payment_amount !== null && String(payment_amount).trim() !== "") {
    const n = Number(String(payment_amount).replace(",", "."));
    if (!Number.isFinite(n)) {
      return res.status(400).json({ error: "payment_amount должен быть числом" });
    }
    amount = n;
  }

  const currency =
    payment_currency != null && String(payment_currency).trim() !== ""
      ? String(payment_currency).trim().slice(0, 8)
      : "USD";
  const note =
    payment_note != null && String(payment_note).trim() !== "" ? String(payment_note).trim().slice(0, 512) : null;
  const maintenanceMode = maintenance_mode === true || Number(maintenance_mode) === 1 ? 1 : 0;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute(
      "UPDATE site_subscription SET valid_until = ?, payment_amount = ?, payment_currency = ?, payment_note = ?, maintenance_mode = ? WHERE id = 1",
      [validUntilSql, amount, currency, note, maintenanceMode]
    );
    invalidateSiteSubscriptionCache();
    const row = await getSiteSubscription();
    const maintenance = Number(row.maintenance_mode) === 1;
    const active = !row.valid_until || new Date(row.valid_until).getTime() > Date.now();
    res.json({
      active,
      validUntil: row.valid_until,
      payment_amount: row.payment_amount != null ? Number(row.payment_amount) : null,
      payment_currency: row.payment_currency || "USD",
      payment_note: row.payment_note || null,
      maintenance_mode: maintenance,
    });
  } catch (error) {
    console.error("PUT /api/dev/site-access:", error);
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Developer health endpoint (Protected, SUPER_ADMIN only)
app.get("/api/dev/health", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  let connection;
  let db = "down";
  try {
    connection = await pool.getConnection();
    await connection.execute("SELECT 1");
    db = "up";
  } catch (error) {
    db = "down";
  } finally {
    if (connection) connection.release();
  }

  res.json({
    ok: true,
    now: new Date().toISOString(),
    uptimeSec: process.uptime(),
    env: process.env.NODE_ENV || "development",
    db,
    mail: mailTransport ? "configured" : "not_configured",
    node: process.version,
  });
});

// Отправка тестового письма (SUPER_ADMIN only)
app.post("/api/dev/mail/test", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }
  if (!mailTransport) {
    return res.status(400).json({ error: "Почта не настроена. Укажите GMAIL_USER и GMAIL_APP_PASSWORD в .env" });
  }

  const to = String(req.body?.to ?? "").trim();
  const subject = String(req.body?.subject ?? "Kurut test email").trim().slice(0, 255);
  const text = String(req.body?.text ?? "Проверка SMTP: письмо отправлено успешно.").trim().slice(0, 5000);

  if (!to) {
    return res.status(400).json({ error: "Поле to обязательно" });
  }

  try {
    const info = await mailTransport.sendMail({
      from: `"Kurut Backend" <${gmailUser}>`,
      to,
      subject,
      text,
    });
    res.json({ ok: true, messageId: info.messageId, accepted: info.accepted || [] });
  } catch (error) {
    console.error("POST /api/dev/mail/test:", error);
    res.status(500).json({ error: `Не удалось отправить письмо: ${error.message}` });
  }
});

// Admin Login Endpoint
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.error("Login error: Missing email or password");
    return res.status(400).json({ error: "Email и пароль обязательны" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, first_name, last_name, email, phone, role, password, profile_picture AS photoUrl FROM users1 WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Недействительный email или пользователь не найден" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Недействительный пароль" });
    }

    if (user.role !== "SUPER_ADMIN") {
      const sub = await getSiteSubscription();
      if (Number(sub.maintenance_mode) === 1) {
        return res.status(503).json({
          error:
            "Сервис временно недоступен: включён режим обслуживания. Дождитесь завершения работ или обратитесь к разработчику.",
          code: "SITE_MAINTENANCE_MODE",
        });
      }
      if (sub.valid_until && new Date(sub.valid_until).getTime() <= Date.now()) {
        return res.status(402).json({
          error:
            "Срок доступа к сервису истёк. Продлите подписку в Developer Zone (разработчик) или обратитесь к владельцу.",
          code: "SITE_SUBSCRIPTION_EXPIRED",
          validUntil: sub.valid_until,
        });
      }
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: "30d" });
    await connection.execute("UPDATE users1 SET token = ? WHERE id = ?", [token, user.id]);

    const userResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      photoUrl: user.photoUrl ? `https://s3.twcstorage.ru/${bucketName}/${user.photoUrl}` : null,
      name: `${user.first_name} ${user.last_name}`.trim(),
      token,
    };

    res.json({ message: "Авторизация успешна", user: userResponse, token });
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Рассылка уведомления всем пользователям из зоны разработчика
app.post("/api/dev/notifications/broadcast", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const title = String(req.body?.title ?? "").trim();
  const message = String(req.body?.message ?? "").trim();
  const levelRaw = String(req.body?.level ?? "info").trim().toLowerCase();
  const targetRoleRaw = String(req.body?.target_role ?? "ALL").trim().toUpperCase();
  const level = ["info", "success", "warning", "error"].includes(levelRaw) ? levelRaw : "info";
  const targetRole =
    targetRoleRaw === "ALL" || VALID_ROLES.includes(targetRoleRaw) ? targetRoleRaw : "ALL";

  if (!title || !message) {
    return res.status(400).json({ error: "title и message обязательны" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO notifications (title, message, level, created_by, target_role) VALUES (?, ?, ?, ?, ?)",
      [title.slice(0, 255), message.slice(0, 5000), level, req.user.id, targetRole]
    );
    const notificationId = result.insertId;
    const [rows] = await connection.execute("SELECT id, title, message, level, target_role, created_at FROM notifications WHERE id = ?", [
      notificationId,
    ]);
    const row = rows[0];
    res.status(201).json({
      id: row.id,
      title: row.title,
      message: row.message,
      level: row.level,
      target_role: row.target_role,
      created_at: row.created_at,
    });
  } catch (error) {
    console.error("POST /api/dev/notifications/broadcast:", error);
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Current user (JWT)
app.get("/api/me", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, first_name, last_name, email, phone, role, profile_picture AS photoUrl FROM users1 WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    const u = rows[0];
    res.json({
      id: u.id,
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      photoUrl: u.photoUrl
        ? `https://s3.twcstorage.ru/${bucketName}/${u.photoUrl}`
        : null,
      name: `${u.first_name} ${u.last_name}`.trim(),
    });
  } catch (error) {
    console.error("GET /api/me error:", error);
    res
      .status(500)
      .json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Личные уведомления текущего пользователя
app.get("/api/notifications", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const role = String(req.user.role || "").toUpperCase();
    const [rows] = await connection.execute(
      `
      SELECT
        n.id,
        n.title,
        n.message,
        n.level,
        n.target_role,
        n.created_at,
        CASE WHEN nr.id IS NULL THEN 0 ELSE 1 END AS is_read
      FROM notifications n
      LEFT JOIN notification_reads nr
        ON nr.notification_id = n.id
       AND nr.user_id = ?
      WHERE n.target_role = 'ALL' OR n.target_role = ?
      ORDER BY n.created_at DESC
      LIMIT 30
      `,
      [req.user.id, role]
    );
    res.json(
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        message: r.message,
        level: r.level || "info",
        target_role: r.target_role || "ALL",
        created_at: r.created_at,
        is_read: Number(r.is_read) === 1,
      }))
    );
  } catch (error) {
    console.error("GET /api/notifications:", error);
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/api/notifications/:id/read", authenticate, async (req, res) => {
  const notificationId = Number(req.params.id);
  if (!Number.isFinite(notificationId) || notificationId <= 0) {
    return res.status(400).json({ error: "Некорректный id уведомления" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute(
      "INSERT IGNORE INTO notification_reads (user_id, notification_id) VALUES (?, ?)",
      [req.user.id, notificationId]
    );
    res.json({ ok: true });
  } catch (error) {
    console.error("POST /api/notifications/:id/read:", error);
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Logout Endpoint
app.post("/api/logout", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute("UPDATE users1 SET token = NULL WHERE id = ?", [req.user.id]);
    res.json({ message: "Выход успешен" });
  } catch (error) {
    console.error("Logout error:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All Users (Protected, SUPER_ADMIN only)
app.get("/api/users", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, first_name, last_name, email, phone, role, profile_picture AS photoUrl FROM users1"
    );

    res.json(
      rows.map((user) => ({
        ...user,
        name: `${user.first_name} ${user.last_name}`.trim(),
        photoUrl: user.photoUrl ? `https://s3.twcstorage.ru/${bucketName}/${user.photoUrl}` : null,
      }))
    );
  } catch (error) {
    console.error("Error retrieving users:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create New User (Protected, SUPER_ADMIN only)
app.post("/api/users", authenticate, upload.single("photo"), async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { email, name, phone, role, password } = req.body;
  const photo = req.file;

  if (!email || !name || !phone || !role || !password) {
    return res.status(400).json({ error: "Все поля (email, name, phone, role, password) обязательны" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Недействительная роль. Должна быть одной из: ${VALID_ROLES.join(', ')}` });
  }

  const [first_name, last_name = ""] = name.split(" ");
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const profile_picture = photo ? `${uniqueSuffix}${path.extname(photo.originalname)}` : null;

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingUser] = await connection.execute("SELECT id FROM users1 WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    if (photo) {
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: profile_picture,
        Body: photo.buffer,
        ContentType: photo.mimetype,
      }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      "INSERT INTO users1 (first_name, last_name, email, phone, role, password, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [first_name, last_name, email, phone, role, hashedPassword, profile_picture]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId, role }, jwtSecret, { expiresIn: "30d" });
    await connection.execute("UPDATE users1 SET token = ? WHERE id = ?", [token, userId]);

    const newUser = {
      id: userId,
      first_name,
      last_name,
      email,
      phone,
      role,
      photoUrl: profile_picture ? `https://s3.twcstorage.ru/${bucketName}/${profile_picture}` : null,
      name: `${first_name} ${last_name}`.trim(),
      token,
    };

    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Update User (Protected, SUPER_ADMIN only)
app.put("/api/users/:id", authenticate, upload.single("photo"), async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;
  const { email, name, phone, role, password } = req.body;
  const photo = req.file;

  if (!email || !name || !phone || !role) {
    return res.status(400).json({ error: "Все поля (email, name, phone, role) обязательны" });
  }

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: `Недействительная роль. Должна быть одной из: ${VALID_ROLES.join(', ')}` });
  }

  const [first_name, last_name = ""] = name.split(" ");
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  let profile_picture = null;

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingUsers] = await connection.execute("SELECT profile_picture FROM users1 WHERE id = ?", [id]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const [emailCheck] = await connection.execute("SELECT id FROM users1 WHERE email = ? AND id != ?", [email, id]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    profile_picture = existingUsers[0].profile_picture;
    if (photo) {
      profile_picture = `${uniqueSuffix}${path.extname(photo.originalname)}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: profile_picture,
        Body: photo.buffer,
        ContentType: photo.mimetype,
      }));

      if (existingUsers[0].profile_picture) {
        try {
          await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: existingUsers[0].profile_picture }));
        } catch (error) {
          console.warn(`Failed to delete old profile picture from S3: ${existingUsers[0].profile_picture}`);
        }
      }
    }

    // Update password if provided
    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute(
        "UPDATE users1 SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, profile_picture = ?, password = ? WHERE id = ?",
        [first_name, last_name, email, phone, role, profile_picture, hashedPassword, id]
      );
    } else {
      await connection.execute(
        "UPDATE users1 SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, profile_picture = ? WHERE id = ?",
        [first_name, last_name, email, phone, role, profile_picture, id]
      );
    }

    const updatedUser = {
      id: parseInt(id),
      first_name,
      last_name,
      email,
      phone,
      role,
      photoUrl: profile_picture ? `https://s3.twcstorage.ru/${bucketName}/${profile_picture}` : null,
      name: `${first_name} ${last_name}`.trim(),
    };

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Delete User (Protected, SUPER_ADMIN only)
app.delete("/api/users/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [users] = await connection.execute("SELECT profile_picture FROM users1 WHERE id = ?", [id]);
    if (users.length === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    if (users[0].profile_picture) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: users[0].profile_picture }));
      } catch (error) {
        console.warn(`Failed to delete profile picture from S3: ${users[0].profile_picture}`);
      }
    }

    await connection.execute("DELETE FROM users1 WHERE id = ?", [id]);
    res.json({ message: "Пользователь успешно удалён" });
  } catch (error) {
    console.error("Error deleting user:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All JK (Protected)
app.get("/api/jk", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, name, description, address FROM jk");
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving JK:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create JK (Protected, SUPER_ADMIN only)
app.post("/api/jk", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { name, description, address } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Название обязательно" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingJk] = await connection.execute("SELECT id FROM jk WHERE name = ?", [name]);
    if (existingJk.length > 0) {
      return res.status(400).json({ error: "ЖК с таким названием уже существует" });
    }

    const [result] = await connection.execute(
      "INSERT INTO jk (name, description, address) VALUES (?, ?, ?)",
      [name, description || null, address || null]
    );

    res.json({ id: result.insertId, name, description, address });
  } catch (error) {
    console.error("Error creating JK:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Update JK (Protected, SUPER_ADMIN only)
app.put("/api/jk/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;
  const { name, description, address } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Название обязательно" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingJk] = await connection.execute("SELECT id FROM jk WHERE id = ?", [id]);
    if (existingJk.length === 0) {
      return res.status(404).json({ error: "ЖК не найден" });
    }

    const [nameCheck] = await connection.execute("SELECT id FROM jk WHERE name = ? AND id != ?", [name, id]);
    if (nameCheck.length > 0) {
      return res.status(400).json({ error: "ЖК с таким названием уже существует" });
    }

    await connection.execute(
      "UPDATE jk SET name = ?, description = ?, address = ? WHERE id = ?",
      [name, description || null, address || null, id]
    );

    res.json({ id: parseInt(id), name, description, address });
  } catch (error) {
    console.error("Error updating JK:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Delete JK (Protected, SUPER_ADMIN only)
app.delete("/api/jk/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingJk] = await connection.execute("SELECT id FROM jk WHERE id = ?", [id]);
    if (existingJk.length === 0) {
      return res.status(404).json({ error: "ЖК не найден" });
    }

    const [linkedProperties] = await connection.execute("SELECT id FROM properties WHERE zhk_id = ?", [id]);
    if (linkedProperties.length > 0) {
      return res.status(400).json({ error: "Нельзя удалить ЖК, связанный с объектами недвижимости" });
    }

    await connection.execute("DELETE FROM jk WHERE id = ?", [id]);
    res.json({ message: "ЖК успешно удалён" });
  } catch (error) {
    console.error("Error deleting JK:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// ——— Филиалы (branches) ———
app.get("/api/branches", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT id, name, code, city, address, phone, email, director_name, work_hours, notes, sort_order, is_active, created_at
       FROM branches
       ORDER BY sort_order ASC, name ASC, id ASC`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving branches:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.post("/api/branches", authenticate, async (req, res) => {
  if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или ADMIN" });
  }

  const b = req.body || {};
  const name = b.name != null ? String(b.name).trim() : "";
  if (!name) {
    return res.status(400).json({ error: "Название филиала обязательно" });
  }

  const code = b.code != null && String(b.code).trim() !== "" ? String(b.code).trim() : null;
  const city = b.city != null ? String(b.city).trim() || null : null;
  const address = b.address != null ? String(b.address).trim() || null : null;
  const phone = b.phone != null ? String(b.phone).trim() || null : null;
  const email = b.email != null ? String(b.email).trim() || null : null;
  const director_name = b.director_name != null ? String(b.director_name).trim() || null : null;
  const work_hours = b.work_hours != null ? String(b.work_hours).trim() || null : null;
  const notes = b.notes != null ? String(b.notes).trim() || null : null;
  const sort_order = Number.parseInt(String(b.sort_order ?? 0), 10);
  const is_active = b.is_active === false || b.is_active === 0 || b.is_active === "0" ? 0 : 1;

  let connection;
  try {
    connection = await pool.getConnection();
    if (code) {
      const [dup] = await connection.execute("SELECT id FROM branches WHERE code = ?", [code]);
      if (dup.length > 0) {
        return res.status(400).json({ error: "Код филиала уже занят" });
      }
    }

    const [result] = await connection.execute(
      `INSERT INTO branches (name, code, city, address, phone, email, director_name, work_hours, notes, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, code, city, address, phone, email, director_name, work_hours, notes, Number.isFinite(sort_order) ? sort_order : 0, is_active]
    );

    const [rows] = await connection.execute("SELECT * FROM branches WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating branch:", { message: error.message, stack: error.stack });
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Дубликат кода или названия" });
    }
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.put("/api/branches/:id", authenticate, async (req, res) => {
  if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или ADMIN" });
  }

  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }

  const b = req.body || {};
  const name = b.name != null ? String(b.name).trim() : "";
  if (!name) {
    return res.status(400).json({ error: "Название филиала обязательно" });
  }

  const code = b.code != null && String(b.code).trim() !== "" ? String(b.code).trim() : null;
  const city = b.city != null ? String(b.city).trim() || null : null;
  const address = b.address != null ? String(b.address).trim() || null : null;
  const phone = b.phone != null ? String(b.phone).trim() || null : null;
  const email = b.email != null ? String(b.email).trim() || null : null;
  const director_name = b.director_name != null ? String(b.director_name).trim() || null : null;
  const work_hours = b.work_hours != null ? String(b.work_hours).trim() || null : null;
  const notes = b.notes != null ? String(b.notes).trim() || null : null;
  const sort_order = Number.parseInt(String(b.sort_order ?? 0), 10);
  const is_active = b.is_active === false || b.is_active === 0 || b.is_active === "0" ? 0 : 1;

  let connection;
  try {
    connection = await pool.getConnection();
    const [ex] = await connection.execute("SELECT id FROM branches WHERE id = ?", [id]);
    if (ex.length === 0) {
      return res.status(404).json({ error: "Филиал не найден" });
    }

    if (code) {
      const [dup] = await connection.execute("SELECT id FROM branches WHERE code = ? AND id != ?", [code, id]);
      if (dup.length > 0) {
        return res.status(400).json({ error: "Код филиала уже занят" });
      }
    }

    await connection.execute(
      `UPDATE branches SET name=?, code=?, city=?, address=?, phone=?, email=?, director_name=?, work_hours=?, notes=?, sort_order=?, is_active=?
       WHERE id=?`,
      [name, code, city, address, phone, email, director_name, work_hours, notes, Number.isFinite(sort_order) ? sort_order : 0, is_active, id]
    );

    const [rows] = await connection.execute("SELECT * FROM branches WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating branch:", { message: error.message, stack: error.stack });
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Дубликат кода" });
    }
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.delete("/api/branches/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Удаление филиалов доступно только SUPER_ADMIN" });
  }

  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [ex] = await connection.execute("SELECT id FROM branches WHERE id = ?", [id]);
    if (ex.length === 0) {
      return res.status(404).json({ error: "Филиал не найден" });
    }

    await connection.execute("DELETE FROM branches WHERE id = ?", [id]);
    res.json({ message: "Филиал удалён" });
  } catch (error) {
    console.error("Error deleting branch:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All Districts (Protected)
app.get("/api/districts", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, name FROM districts");
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving districts:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Публичный эндпоинт для получения списка районов
app.get("/public/districts", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, name FROM districts");
    res.json(rows);
  } catch (error) {
    console.error("Ошибка при получении районов:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  } finally {
    if (connection) connection.release();
  }
});

// Список кураторов для формы объекта (любой авторизованный пользователь)
app.get("/api/curators", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, first_name, last_name, email, role FROM users1 WHERE role IN ('REALTOR', 'SUPER_ADMIN', 'ADMIN') ORDER BY first_name ASC, last_name ASC"
    );
    const curators = rows.map((u) => ({
      id: u.id,
      name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || String(u.email || u.id),
      role: u.role,
    }));
    res.json(curators);
  } catch (error) {
    console.error("Error retrieving curators:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get Subdistricts by District ID (Protected)
app.get("/api/subdistricts", authenticate, async (req, res) => {
  const { district_id } = req.query;
  if (!district_id) {
    return res.status(400).json({ error: "district_id обязателен" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, name FROM subdistricts WHERE district_id = ?",
      [district_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving subdistricts:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All Districts and Subdistricts
app.get("/api/raions", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [districts] = await connection.execute("SELECT id, name, NULL AS parentRaionId FROM districts");
    const [subdistricts] = await connection.execute("SELECT id, name, district_id AS parentRaionId FROM subdistricts");

    const raions = [
      ...districts.map(row => ({ id: row.id, name: row.name, parentRaionId: null, isRaion: true })),
      ...subdistricts.map(row => ({ id: row.id, name: row.name, parentRaionId: row.parentRaionId, isRaion: false })),
    ];

    res.json(raions);
  } catch (error) {
    console.error("Error retrieving districts and subdistricts:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create District (Protected, SUPER_ADMIN only)
app.post("/api/raions", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Название обязательно" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingDistrict] = await connection.execute("SELECT id FROM districts WHERE name = ?", [name]);
    if (existingDistrict.length > 0) {
      return res.status(400).json({ error: "Район с таким названием уже существует" });
    }

    const [result] = await connection.execute(
      "INSERT INTO districts (name) VALUES (?)",
      [name]
    );

    res.json({ id: result.insertId, name, parentRaionId: null, isRaion: true });
  } catch (error) {
    console.error("Ошибка при создании района:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Update District (Protected, SUPER_ADMIN only)
app.put("/api/raions/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Название обязательно" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingDistrict] = await connection.execute("SELECT id FROM districts WHERE id = ?", [id]);
    if (existingDistrict.length === 0) {
      return res.status(404).json({ error: "Район не найден" });
    }

    const [nameCheck] = await connection.execute("SELECT id FROM districts WHERE name = ? AND id != ?", [name, id]);
    if (nameCheck.length > 0) {
      return res.status(400).json({ error: "Район с таким названием уже существует" });
    }

    await connection.execute("UPDATE districts SET name = ? WHERE id = ?", [name, id]);
    res.json({ id: parseInt(id), name, parentRaionId: null, isRaion: true });
  } catch (error) {
    console.error("Ошибка при обновлении района:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Delete District (Protected, SUPER_ADMIN only)
app.delete("/api/raions/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingDistrict] = await connection.execute("SELECT id FROM districts WHERE id = ?", [id]);
    if (existingDistrict.length === 0) {
      return res.status(404).json({ error: "Район не найден" });
    }

    const [linkedProperties] = await connection.execute("SELECT id FROM properties WHERE district_id = ?", [id]);
    if (linkedProperties.length > 0) {
      return res.status(400).json({ error: "Нельзя удалить район, связанный с объектами недвижимости" });
    }

    await connection.execute("DELETE FROM districts WHERE id = ?", [id]);
    res.json({ message: "Район успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении района:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create Subdistrict (Protected, SUPER_ADMIN only)
app.post("/api/subraions", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { name, parentRaionId } = req.body;
  if (!name || !parentRaionId) {
    return res.status(400).json({ error: "Название и ID родительского района обязательны" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [districtCheck] = await connection.execute("SELECT id FROM districts WHERE id = ?", [parentRaionId]);
    if (districtCheck.length === 0) {
      return res.status(400).json({ error: "Недействительный ID родительского района" });
    }

    const [existingSubdistrict] = await connection.execute(
      "SELECT id FROM subdistricts WHERE name = ? AND district_id = ?",
      [name, parentRaionId]
    );
    if (existingSubdistrict.length > 0) {
      return res.status(400).json({ error: "Микрорайон с таким названием уже существует в этом районе" });
    }

    const [result] = await connection.execute(
      "INSERT INTO subdistricts (name, district_id) VALUES (?, ?)",
      [name, parentRaionId]
    );

    res.json({ id: result.insertId, name, parentRaionId, isRaion: false });
  } catch (error) {
    console.error("Ошибка при создании микрорайона:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Update Subdistrict (Protected, SUPER_ADMIN only)
app.put("/api/subraions/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;
  const { name, parentRaionId } = req.body;
  if (!name || !parentRaionId) {
    return res.status(400).json({ error: "Название и ID родительского района обязательны" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [subdistrictCheck] = await connection.execute("SELECT id FROM subdistricts WHERE id = ?", [id]);
    if (subdistrictCheck.length === 0) {
      return res.status(404).json({ error: "Микрорайон не найден" });
    }

    const [districtCheck] = await connection.execute("SELECT id FROM districts WHERE id = ?", [parentRaionId]);
    if (districtCheck.length === 0) {
      return res.status(400).json({ error: "Недействительный ID родительского района" });
    }

    const [nameCheck] = await connection.execute(
      "SELECT id FROM subdistricts WHERE name = ? AND district_id = ? AND id != ?",
      [name, parentRaionId, id]
    );
    if (nameCheck.length > 0) {
      return res.status(400).json({ error: "Микрорайон с таким названием уже существует в этом районе" });
    }

    await connection.execute(
      "UPDATE subdistricts SET name = ?, district_id = ? WHERE id = ?",
      [name, parentRaionId, id]
    );

    res.json({ id: parseInt(id), name, parentRaionId, isRaion: false });
  } catch (error) {
    console.error("Ошибка при обновлении микрорайона:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Delete Subdistrict (Protected, SUPER_ADMIN only)
app.delete("/api/subraions/:id", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [subdistrictCheck] = await connection.execute("SELECT id FROM subdistricts WHERE id = ?", [id]);
    if (subdistrictCheck.length === 0) {
      return res.status(404).json({ error: "Микрорайон не найден" });
    }

    const [linkedProperties] = await connection.execute("SELECT id FROM properties WHERE subdistrict_id = ?", [id]);
    if (linkedProperties.length > 0) {
      return res.status(400).json({ error: "Нельзя удалить микрорайон, связанный с объектами недвижимости" });
    }

    await connection.execute("DELETE FROM subdistricts WHERE id = ?", [id]);
    res.json({ message: "Микрорайон успешно удалён" });
  } catch (error) {
    console.error("Ошибка при удалении микрорайона:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create New Property (Protected, SUPER_ADMIN or REALTOR)
// Use upload.any() to prevent Multer "Unexpected field" errors.
app.post("/api/properties", authenticate, upload.any(), async (req, res) => {
  if (!["SUPER_ADMIN", "REALTOR"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или REALTOR" });
  }

  const {
    type_id,
    repair,
    series,
    zhk_id,
    owner_name,
    owner_phone,
    curator_id,
    price,
    unit,
    rukprice,
    mkv,
    rooms,
    phone,
    district_id,
    subdistrict_id,
    address,
    notes,
    description,
    status,
    owner_id,
    etaj,
    etajnost,
  } = req.body;

  const allFiles = Array.isArray(req.files) ? req.files : [];
  const photos = allFiles
    .filter((f) => f && f.fieldname === "photos")
    .slice(0, 10)
    .map((file) => ({
      filename: `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`,
      buffer: file.buffer,
      mimetype: file.mimetype,
    }));

  const docFiles = allFiles.filter((f) => f && f.fieldname === "document").slice(0, 1);
  const document = docFiles[0]
    ? {
        filename: `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(docFiles[0].originalname)}`,
        buffer: docFiles[0].buffer,
        mimetype: docFiles[0].mimetype,
      }
    : null;

  if (!type_id || !price || !rukprice || !mkv || !address || !etaj || !etajnost) {
    return res.status(400).json({ error: "Все обязательные поля (type_id, price, rukprice, mkv, address, etaj, etajnost) должны быть заполнены" });
  }

  if (isNaN(parseFloat(price)) || isNaN(parseFloat(rukprice)) || isNaN(parseFloat(mkv)) || isNaN(parseInt(etaj)) || isNaN(parseInt(etajnost))) {
    return res.status(400).json({ error: "Поля price, rukprice, mkv, etaj, etajnost должны быть числами" });
  }

  if (type_id === "Квартира" && repair && !["ПСО", "С отделкой"].includes(repair)) {
    return res.status(400).json({ error: "Недействительное значение ремонта. Должно быть: ПСО, С отделкой" });
  }

  if (type_id === "Квартира" && series && ![
    "105 серия", "106 серия", "Индивидуалка", "Элитка", "103 серия", "106 серия улучшенная",
    "107 серия", "108 серия", "Малосемейка", "Общежитие и Гостиничного типа", "Сталинка", "Хрущевка"
  ].includes(series)) {
    return res.status(400).json({ error: "Недействительная серия. Должна быть одной из: 105 серия, 106 серия, Индивидуалка, Элитка, 103 серия, 106 серия улучшенная, 107 серия, 108 серия, Малосемейка, Общежитие и Гостиничного типа, Сталинка, Хрущевка" });
  }

  if (type_id === "Квартира" && rooms && !["1", "2", "3", "4", "5+"].includes(rooms)) {
    return res.status(400).json({ error: "Недействительное количество комнат. Должно быть: 1, 2, 3, 4, 5+" });
  }

  let finalCuratorId;
  if (curator_id) {
    if (isNaN(parseInt(curator_id))) {
      return res.status(400).json({ error: "curator_id должен быть числом" });
    }
    finalCuratorId = parseInt(curator_id);
  } else {
    finalCuratorId = req.user.role === "REALTOR" ? req.user.id : null;
  }

  if (req.user.role === "REALTOR" && finalCuratorId && finalCuratorId !== req.user.id) {
    return res.status(403).json({ error: "Риелтор может назначить только себя куратором" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    if (zhk_id) {
      const [jkCheck] = await connection.execute("SELECT id FROM jk WHERE id = ?", [zhk_id]);
      if (jkCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID ЖК" });
      }
    }

    if (district_id) {
      const [districtCheck] = await connection.execute("SELECT id FROM districts WHERE id = ?", [district_id]);
      if (districtCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID района" });
      }
    }

    if (subdistrict_id) {
      const [subdistrictCheck] = await connection.execute(
        "SELECT id FROM subdistricts WHERE id = ? AND district_id = ?",
        [subdistrict_id, district_id || null]
      );
      if (subdistrictCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID микрорайона или микрорайон не принадлежит указанному району" });
      }
    }

    let curatorName = null;
    if (finalCuratorId) {
      const [curatorCheck] = await connection.execute(
        "SELECT id, CONCAT(first_name, ' ', last_name) AS curator_name FROM users1 WHERE id = ?",
        [finalCuratorId]
      );
      if (curatorCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID куратора" });
      }
      curatorName = curatorCheck[0].curator_name;
    }

    for (const photo of photos) {
      try {
        await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: photo.filename,
          Body: photo.buffer,
          ContentType: photo.mimetype,
        }));
      } catch (error) {
        console.error(`Failed to upload photo to S3: ${photo.filename}`, error.message);
        throw new Error(`Не удалось загрузить фото: ${photo.filename}`);
      }
    }

    if (document) {
      try {
        await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: document.filename,
          Body: document.buffer,
          ContentType: document.mimetype,
        }));
      } catch (error) {
        console.error(`Failed to upload document to S3: ${document.filename}`, error.message);
        throw new Error(`Не удалось загрузить документ: ${document.filename}`);
      }
    }

    const photosJson = photos.length > 0 ? JSON.stringify(photos.map(img => img.filename)) : null;
    const [result] = await connection.execute(
      `INSERT INTO properties (
        type_id, repair, series, zhk_id, document_id, owner_name, owner_phone, curator_id, price, unit, rukprice, mkv, rooms, phone, 
        district_id, subdistrict_id, address, notes, description, photos, document, status, owner_id, etaj, etajnost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type_id || null,
        repair || null,
        series || null,
        zhk_id || null,
        0,
        owner_name || null,
        owner_phone || null,
        finalCuratorId,
        price,
        unit || null,
        rukprice,
        mkv,
        rooms || null,
        phone || null,
        district_id || null,
        subdistrict_id || null,
        address,
        notes || null,
        description || null,
        photosJson,
        document ? document.filename : null,
        status || null,
        owner_id || null,
        etaj,
        etajnost,
      ]
    );

    const newProperty = {
      id: result.insertId,
      type_id,
      repair,
      series,
      zhk_id,
      document_id: 0,
      owner_name,
      owner_phone,
      curator_id: finalCuratorId,
      curator_name: curatorName || null,
      price,
      unit,
      rukprice,
      mkv,
      rooms,
      phone,
      district_id,
      subdistrict_id,
      address,
      notes,
      description,
      status,
      owner_id,
      etaj,
      etajnost,
      photos: photos.map(img => `https://s3.twcstorage.ru/${bucketName}/${img.filename}`),
      document: document ? `https://s3.twcstorage.ru/${bucketName}/${document.filename}` : null,
      date: new Date().toLocaleDateString("ru-RU"),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    res.json(newProperty);
  } catch (error) {
    console.error("Error creating property:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Update Property (Protected, SUPER_ADMIN or REALTOR)
// Use upload.any() to prevent Multer "Unexpected field" errors.
app.put("/api/properties/:id", authenticate, upload.any(), async (req, res) => {
  if (!["SUPER_ADMIN", "REALTOR"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или REALTOR" });
  }

  const { id } = req.params;
  const {
    type_id,
    repair,
    series,
    zhk_id,
    owner_name,
    owner_phone,
    curator_id,
    price,
    unit,
    rukprice,
    mkv,
    rooms,
    phone,
    district_id,
    subdistrict_id,
    address,
    notes,
    description,
    status,
    owner_id,
    etaj,
    etajnost,
    existingPhotos,
  } = req.body;

  const allFiles = Array.isArray(req.files) ? req.files : [];
  const photos = allFiles
    .filter((f) => f && f.fieldname === "photos")
    .slice(0, 10)
    .map((file) => ({
      filename: `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`,
      buffer: file.buffer,
      mimetype: file.mimetype,
    }));

  const docFiles = allFiles.filter((f) => f && f.fieldname === "document").slice(0, 1);
  const document = docFiles[0]
    ? {
        filename: `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(docFiles[0].originalname)}`,
        buffer: docFiles[0].buffer,
        mimetype: docFiles[0].mimetype,
      }
    : null;

  if (!type_id || !price || !rukprice || !mkv || !address || !etaj || !etajnost) {
    return res.status(400).json({ error: "Все обязательные поля (type_id, price, rukprice, mkv, address, etaj, etajnost) должны быть заполнены" });
  }

  if (isNaN(parseFloat(price)) || isNaN(parseFloat(rukprice)) || isNaN(parseFloat(mkv)) || isNaN(parseInt(etaj)) || isNaN(parseInt(etajnost))) {
    return res.status(400).json({ error: "Поля price, rukprice, mkv, etaj, etajnost должны быть числами" });
  }

  if (type_id === "Квартира" && repair && !["ПСО", "С отделкой"].includes(repair)) {
    return res.status(400).json({ error: "Недействительное значение ремонта. Должно быть: ПСО, С отделкой" });
  }

  if (type_id === "Квартира" && series && ![
    "105 серия", "106 серия", "Индивидуалка", "Элитка", "103 серия", "106 серия улучшенная",
    "107 серия", "108 серия", "Малосемейка", "Общежитие и Гостиничного типа", "Сталинка", "Хрущевка"
  ].includes(series)) {
    return res.status(400).json({ error: "Недействительная серия. Должна быть одной из: 105 серия, 106 серия, Индивидуалка, Элитка, 103 серия, 106 серия улучшенная, 107 серия, 108 серия, Малосемейка, Общежитие и Гостиничного типа, Сталинка, Хрущевка" });
  }

  if (type_id === "Квартира" && rooms && !["1", "2", "3", "4", "5+"].includes(rooms)) {
    return res.status(400).json({ error: "Недействительное количество комнат. Должно быть: 1, 2, 3, 4, 5+" });
  }

  let finalCuratorId;
  if (curator_id) {
    if (isNaN(parseInt(curator_id))) {
      return res.status(400).json({ error: "curator_id должен быть числом" });
    }
    finalCuratorId = parseInt(curator_id);
  } else {
    finalCuratorId = req.user.role === "REALTOR" ? req.user.id : null;
  }

  if (req.user.role === "REALTOR" && finalCuratorId && finalCuratorId !== req.user.id) {
    return res.status(403).json({ error: "Риелтор может назначить только себя куратором" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [existingProperties] = await connection.execute(
      "SELECT photos, document, curator_id, owner_phone FROM properties WHERE id = ?",
      [id]
    );
    if (existingProperties.length === 0) {
      return res.status(404).json({ error: "Объект недвижимости не найден" });
    }

    const existingProperty = existingProperties[0];
    if (req.user.role === "REALTOR" && existingProperty.curator_id && existingProperty.curator_id !== req.user.id) {
      return res.status(403).json({ error: "У вас нет прав для редактирования этого объекта" });
    }

    if (zhk_id) {
      const [jkCheck] = await connection.execute("SELECT id FROM jk WHERE id = ?", [zhk_id]);
      if (jkCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID ЖК" });
      }
    }

    if (district_id) {
      const [districtCheck] = await connection.execute("SELECT id FROM districts WHERE id = ?", [district_id]);
      if (districtCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID района" });
      }
    }

    if (subdistrict_id) {
      const [subdistrictCheck] = await connection.execute(
        "SELECT id FROM subdistricts WHERE id = ? AND district_id = ?",
        [subdistrict_id, district_id || null]
      );
      if (subdistrictCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID микрорайона или микрорайон не принадлежит указанному району" });
      }
    }

    let curatorName = null;
    if (finalCuratorId) {
      const [curatorCheck] = await connection.execute(
        "SELECT id, CONCAT(first_name, ' ', last_name) AS curator_name FROM users1 WHERE id = ?",
        [finalCuratorId]
      );
      if (curatorCheck.length === 0) {
        return res.status(400).json({ error: "Недействительный ID куратора" });
      }
      curatorName = curatorCheck[0].curator_name;
    }

    let photoFiles = [];
    if (existingProperty.photos) {
      try {
        photoFiles = JSON.parse(existingProperty.photos) || [];
      } catch (error) {
        console.warn(`Error parsing photos for ID: ${id}:`, error.message);
        photoFiles = [];
      }
    }

    let existingPhotosList = [];
    if (existingPhotos) {
      try {
        existingPhotosList = JSON.parse(existingPhotos) || [];
        if (!Array.isArray(existingPhotosList) || !existingPhotosList.every(p => typeof p === "string" && p.trim() && photoFiles.includes(p))) {
          return res.status(400).json({ error: "Недействительный формат existingPhotos: должен быть массивом имен файлов фотографий" });
        }
      } catch (error) {
        console.error(`Error parsing existingPhotos for ID: ${id}:`, error.message);
        return res.status(400).json({ error: "Недействительный формат existingPhotos" });
      }
    } else {
      existingPhotosList = photoFiles;
    }

    for (const photo of photos) {
      try {
        await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: photo.filename,
          Body: photo.buffer,
          ContentType: photo.mimetype,
        }));
      } catch (error) {
        console.error(`Failed to upload photo to S3: ${photo.filename}`, error.message);
        throw new Error(`Не удалось загрузить фото: ${photo.filename}`);
      }
    }

    const photosToDelete = photoFiles.filter(p => !existingPhotosList.includes(p));
    for (const oldPhoto of photosToDelete) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: oldPhoto }));
      } catch (error) {
        console.warn(`Failed to delete old photo from S3: ${oldPhoto}`, error.message);
      }
    }

    const newPhotos = [...existingPhotosList, ...photos.map(img => img.filename)];
    const photosJson = newPhotos.length > 0 ? JSON.stringify(newPhotos) : null;

    let newDocument = existingProperty.document;
    if (document) {
      try {
        await s3Client.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: document.filename,
          Body: document.buffer,
          ContentType: document.mimetype,
        }));
        if (existingProperty.document) {
          try {
            await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: existingProperty.document }));
          } catch (error) {
            console.warn(`Failed to delete old document from S3: ${existingProperty.document}`, error.message);
          }
        }
        newDocument = document.filename;
      } catch (error) {
        console.error(`Failed to upload document to S3: ${document.filename}`, error.message);
        throw new Error(`Не удалось загрузить документ: ${document.filename}`);
      }
    }

    await connection.execute(
      `UPDATE properties SET
        type_id = ?, repair = ?, series = ?, zhk_id = ?, document_id = ?, owner_name = ?, owner_phone = ?, curator_id = ?, price = ?, unit = ?, rukprice = ?, mkv = ?, rooms = ?, phone = ?,
        district_id = ?, subdistrict_id = ?, address = ?, notes = ?, description = ?, photos = ?, document = ?, status = ?, owner_id = ?, etaj = ?, etajnost = ?
        WHERE id = ?`,
      [
        type_id || null,
        repair || null,
        series || null,
        zhk_id || null,
        0,
        owner_name || null,
        owner_phone || null,
        finalCuratorId,
        price,
        unit || null,
        rukprice,
        mkv,
        rooms || null,
        phone || null,
        district_id || null,
        subdistrict_id || null,
        address,
        notes || null,
        description || null,
        photosJson,
        newDocument,
        status || null,
        owner_id || null,
        etaj,
        etajnost,
        id,
      ]
    );

    const updatedProperty = {
      id: parseInt(id),
      type_id,
      repair,
      series,
      zhk_id,
      document_id: 0,
      owner_name,
      owner_phone,
      curator_id: finalCuratorId,
      curator_name: curatorName || null,
      price,
      unit,
      rukprice,
      mkv,
      rooms,
      phone,
      district_id,
      subdistrict_id,
      address,
      notes,
      description,
      status,
      owner_id,
      etaj,
      etajnost,
      photos: newPhotos.map(img => `https://s3.twcstorage.ru/${bucketName}/${img}`),
      document: newDocument ? `https://s3.twcstorage.ru/${bucketName}/${newDocument}` : null,
      date: new Date().toLocaleDateString("ru-RU"),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Delete Property (Protected, SUPER_ADMIN or REALTOR)
app.delete("/api/properties/:id", authenticate, async (req, res) => {
  if (!["SUPER_ADMIN", "REALTOR"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или REALTOR" });
  }

  const { id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [properties] = await connection.execute(
      "SELECT photos, document, curator_id FROM properties WHERE id = ?",
      [id]
    );
    if (properties.length === 0) {
      return res.status(404).json({ error: "Объект недвижимости не найден" });
    }

    const existingProperty = properties[0];
    if (req.user.role === "REALTOR" && existingProperty.curator_id && existingProperty.curator_id !== req.user.id) {
      return res.status(403).json({ error: "У вас нет прав для удаления этого объекта" });
    }

    let photoFiles = [];
    if (existingProperty.photos) {
      try {
        photoFiles = JSON.parse(existingProperty.photos) || [];
      } catch (error) {
        console.warn(`Error parsing photos for ID: ${id}:`, error.message);
        photoFiles = [];
      }
      for (const img of photoFiles) {
        try {
          await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: img }));
        } catch (error) {
          console.warn(`Failed to delete image from S3: ${img}`, error.message);
        }
      }
    }

    if (existingProperty.document) {
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: existingProperty.document }));
      } catch (error) {
        console.warn(`Failed to delete document from S3: ${existingProperty.document}`, error.message);
      }
    }

    await connection.execute("DELETE FROM properties WHERE id = ?", [id]);
    res.json({ message: "Объект недвижимости успешно удалён" });
  } catch (error) {
    console.error("Error deleting property:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All Properties (Protected)
app.get("/api/properties", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) AS curator_name
       FROM properties p
       LEFT JOIN users1 u ON p.curator_id = u.id`
    );

    const properties = rows.map(row => {
      let parsedPhotos = [];
      if (row.photos) {
        try {
          parsedPhotos = JSON.parse(row.photos) || [];
        } catch (error) {
          console.warn(`Error parsing photos for ID: ${row.id}:`, error.message);
          parsedPhotos = [];
        }
      }

      return {
        ...row,
        repair: row.repair || null,
        rooms: row.rooms || null,
        owner_phone: row.owner_phone || null,
        photos: parsedPhotos.map(img => `https://s3.twcstorage.ru/${bucketName}/${img}`),
        document: row.document ? `https://s3.twcstorage.ru/${bucketName}/${row.document}` : null,
        date: new Date(row.created_at).toLocaleDateString("ru-RU"),
        time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
        curator_name: row.curator_name || null,
      };
    });

    res.json(properties);
  } catch (error) {
    console.error("Error retrieving properties:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Get All Listings for AdminDashboard (Protected)
app.get("/api/listings", authenticate, async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, type_id, price, rukprice, mkv, status, address, created_at FROM properties"
    );

    const listings = rows.map(row => ({
      id: row.id,
      date: new Date(row.created_at).toLocaleDateString("ru-RU"),
      time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      area: row.mkv,
      district: row.address,
      price: row.price,
      status: row.status,
    }));

    res.json(listings);
  } catch (error) {
    console.error("Error retrieving listings:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});



// Get Variants (Properties) with optional filtering for "all" or "mine"
// REALTOR: всегда только объекты, где curator_id = текущий пользователь (не видит чужие)
// mode=mine: для SUPER_ADMIN/ADMIN — только объекты, где curator_id = текущий пользователь
// mode=all: SUPER_ADMIN / прочие роли (кроме REALTOR) — все объекты
// Optional: id query param to filter by property id
app.get("/api/variants", authenticate, async (req, res) => {
  const { mode = "all", id } = req.query;

  if (!mode || !["all", "mine"].includes(mode)) {
    return res.status(400).json({ error: "mode должен быть 'all' или 'mine'" });
  }

  let propertyId = null;
  if (id !== undefined && id !== null && String(id).trim() !== "") {
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "id должен быть числом" });
    }
    propertyId = parseInt(id);
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const whereParts = ["1=1"];
    const params = [];

    if (propertyId !== null) {
      whereParts.push("p.id = ?");
      params.push(propertyId);
    }

    if (req.user.role === "REALTOR") {
      whereParts.push("p.curator_id = ?");
      params.push(req.user.id);
    } else if (mode === "mine") {
      if (!["SUPER_ADMIN", "ADMIN"].includes(req.user.role)) {
        return res.status(403).json({ error: "Доступ запрещён" });
      }
      whereParts.push("p.curator_id = ?");
      params.push(req.user.id);
    }

    const whereSql = whereParts.join(" AND ");
    const [rows] = await connection.execute(
      `SELECT p.id, p.price, p.mkv, p.status, p.address, p.created_at
       , p.curator_id
       FROM properties p
       WHERE ${whereSql}
       ORDER BY p.created_at DESC`,
      params
    );

    const variants = rows.map((row) => ({
      id: row.id,
      date: new Date(row.created_at).toLocaleDateString("ru-RU"),
      time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      area: row.mkv,
      district: row.address,
      price: row.price,
      status: row.status,
      curator_id: row.curator_id ?? null,
    }));

    res.json(variants);
  } catch (error) {
    console.error("Error retrieving variants:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Один вариант с фото и полями (REALTOR — только свой объект)
app.get("/api/variants/:id", authenticate, async (req, res) => {
  if (!["SUPER_ADMIN", "REALTOR", "ADMIN"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён" });
  }

  const pid = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(pid)) {
    return res.status(400).json({ error: "Некорректный ID" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) AS curator_name
       FROM properties p
       LEFT JOIN users1 u ON p.curator_id = u.id
       WHERE p.id = ?`,
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Объект не найден" });
    }

    const row = rows[0];
    if (
      req.user.role === "REALTOR" &&
      Number(row.curator_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({ error: "Нет доступа к этому объекту" });
    }

    let parsedPhotos = [];
    if (row.photos) {
      try {
        parsedPhotos = JSON.parse(row.photos) || [];
      } catch (e) {
        console.warn(`Error parsing photos for variant ${pid}:`, e.message);
        parsedPhotos = [];
      }
    }

    const property = {
      id: row.id,
      type_id: row.type_id || null,
      repair: row.repair || null,
      series: row.series || null,
      zhk_id: row.zhk_id || null,
      price: row.price || null,
      rukprice: row.rukprice || null,
      unit: row.unit || null,
      mkv: row.mkv || null,
      rooms: row.rooms || null,
      phone: row.phone || null,
      district_id: row.district_id || null,
      subdistrict_id: row.subdistrict_id || null,
      address: row.address || null,
      notes: row.notes || null,
      description: row.description || null,
      status: row.status || null,
      etaj: row.etaj || null,
      etajnost: row.etajnost || null,
      owner_name: row.owner_name || null,
      owner_phone: row.owner_phone || null,
      curator_id: row.curator_id || null,
      curator_name: row.curator_name || null,
      owner_id: row.owner_id || null,
      latitude: row.latitude || null,
      longitude: row.longitude || null,
      photos: parsedPhotos.map((img) => `https://s3.twcstorage.ru/${bucketName}/${img}`),
      document: row.document ? `https://s3.twcstorage.ru/${bucketName}/${row.document}` : null,
      date: new Date(row.created_at).toLocaleDateString("ru-RU"),
      time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
    };

    res.json(property);
  } catch (error) {
    console.error("Error retrieving variant:", { message: error.message, stack: error.stack });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Create Variant (Properties without files) - JSON only (no multer)
app.post("/api/variants", authenticate, async (req, res) => {
  if (!["SUPER_ADMIN", "REALTOR"].includes(req.user.role)) {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN или REALTOR" });
  }

  const {
    type_id,
    repair,
    series,
    zhk_id,
    owner_name,
    owner_phone,
    curator_id,
    price,
    unit,
    rukprice,
    mkv,
    rooms,
    phone,
    district_id,
    subdistrict_id,
    address,
    notes,
    description,
    status,
    owner_id,
    etaj,
    etajnost,
  } = req.body || {};

  if (!type_id || !price || !rukprice || !mkv || !address || etaj === undefined || etaj === null || etajnost === undefined || etajnost === null) {
    return res.status(400).json({ error: "Все обязательные поля (type_id, price, rukprice, mkv, address, etaj, etajnost) должны быть заполнены" });
  }

  const pPrice = Number(String(price).replace(",", "."));
  const pRukPrice = Number(String(rukprice).replace(",", "."));
  const pMkv = Number(String(mkv).replace(",", "."));
  const pEtaj = Number.parseInt(String(etaj), 10);
  const pEtajnost = Number.parseInt(String(etajnost), 10);

  if (!Number.isFinite(pPrice) || !Number.isFinite(pRukPrice) || !Number.isFinite(pMkv) || !Number.isFinite(pEtaj) || !Number.isFinite(pEtajnost)) {
    return res.status(400).json({ error: "Проверьте числовые поля (price, rukprice, mkv, etaj, etajnost)" });
  }

  let finalCuratorId = null;
  if (curator_id !== undefined && curator_id !== null && String(curator_id).trim() !== "") {
    const parsedCuratorId = Number.parseInt(String(curator_id), 10);
    if (!Number.isFinite(parsedCuratorId)) return res.status(400).json({ error: "curator_id должен быть числом" });
    finalCuratorId = parsedCuratorId;
    if (req.user.role === "REALTOR" && finalCuratorId !== req.user.id) {
      return res.status(403).json({ error: "Риелтор может назначить только себя куратором" });
    }
  } else {
    finalCuratorId = req.user.role === "REALTOR" ? req.user.id : null;
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Optional FK checks if provided
    if (zhk_id) {
      const [jkCheck] = await connection.execute("SELECT id FROM jk WHERE id = ?", [zhk_id]);
      if (jkCheck.length === 0) return res.status(400).json({ error: "Недействительный ID ЖК" });
    }
    if (district_id) {
      const [districtCheck] = await connection.execute("SELECT id FROM districts WHERE id = ?", [district_id]);
      if (districtCheck.length === 0) return res.status(400).json({ error: "Недействительный ID района" });
    }
    if (subdistrict_id) {
      const [subdistrictCheck] = await connection.execute(
        "SELECT id FROM subdistricts WHERE id = ? AND district_id = ?",
        [subdistrict_id, district_id || null]
      );
      if (subdistrictCheck.length === 0) return res.status(400).json({ error: "Недействительный ID микрорайона или микрорайон не принадлежит указанному району" });
    }

    let curatorName = null;
    if (finalCuratorId) {
      const [curatorCheck] = await connection.execute(
        "SELECT id, CONCAT(first_name, ' ', last_name) AS curator_name FROM users1 WHERE id = ?",
        [finalCuratorId]
      );
      if (curatorCheck.length === 0) return res.status(400).json({ error: "Недействительный ID куратора" });
      curatorName = curatorCheck[0].curator_name;
    }

    const photosJson = null; // no files in this endpoint

    const [result] = await connection.execute(
      `INSERT INTO properties (
        type_id, repair, series, zhk_id, document_id, owner_name, owner_phone, curator_id, price, unit, rukprice, mkv,
        rooms, phone, district_id, subdistrict_id, address, notes, description, photos, document, status, owner_id, etaj, etajnost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type_id || null,
        repair || null,
        series || null,
        zhk_id || null,
        0,
        owner_name || null,
        owner_phone || null,
        finalCuratorId,
        pPrice,
        unit || null,
        pRukPrice,
        pMkv,
        rooms || null,
        phone || null,
        district_id || null,
        subdistrict_id || null,
        address,
        notes || null,
        description || null,
        photosJson,
        null,
        status || null,
        owner_id || null,
        pEtaj,
        pEtajnost,
      ]
    );

    const newId = result.insertId;

    res.json({
      id: newId,
      date: new Date().toLocaleDateString("ru-RU"),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      area: pMkv,
      district: address,
      price: pPrice,
      status: status || null,
      curator_name: curatorName || null,
    });
  } catch (error) {
    console.error("Error creating variant:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

/**
 * Публичная информация об обновлениях desktop-клиента (без авторизации).
 * На сервере задайте переменные окружения при выходе новой сборки:
 *   DESKTOP_LATEST_VERSION — например 1.1.0
 *   DESKTOP_DOWNLOAD_URL   — прямая ссылка на установщик или страницу загрузки
 *   DESKTOP_RELEASE_NOTES  — пункты через | (вертикальная черта)
 *   DESKTOP_UPDATE_MESSAGE — короткий текст баннера (необязательно)
 */
app.get("/public/desktop/update", (req, res) => {
  try {
    const latestVersion = (process.env.DESKTOP_LATEST_VERSION || "1.0.0").trim();
    const downloadUrl = (process.env.DESKTOP_DOWNLOAD_URL || "").trim();
    const message = (process.env.DESKTOP_UPDATE_MESSAGE || "").trim() ||
      "Версия клиента на сервере задаётся администратором (переменные DESKTOP_*).";
    let releaseNotes = [
      "При публикации новой версии укажите DESKTOP_LATEST_VERSION и при необходимости DESKTOP_DOWNLOAD_URL.",
    ];
    if (process.env.DESKTOP_RELEASE_NOTES) {
      releaseNotes = String(process.env.DESKTOP_RELEASE_NOTES)
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    res.json({
      latestVersion,
      downloadUrl,
      releaseNotes,
      message,
      /** После установки нового .exe рекомендуется полностью закрыть и снова открыть приложение */
      reloadAfterInstall: true,
    });
  } catch (error) {
    console.error("public/desktop/update:", error);
    res.status(500).json({ error: "Не удалось сформировать ответ об обновлении" });
  }
});

// Важно: объявлять ДО /public/properties/:id — иначе "types" и "curator-phone" матчятся как :id
app.get("/public/properties/types", async (req, res) => {
  let connection;
  try {
    console.log("Запрос на /public/properties/types от:", req.get("origin"));
    connection = await pool.getConnection();
    const [tables] = await connection.execute("SHOW TABLES LIKE 'properties'");
    if (!tables.length) {
      console.warn("Таблица properties не найдена");
      return res.status(200).json([]);
    }

    const [rows] = await connection.execute(
      "SELECT DISTINCT type_id FROM properties WHERE type_id IS NOT NULL"
    );
    if (!rows.length) {
      console.warn("Типы недвижимости не найдены в базе данных");
      return res.status(200).json([]);
    }
    const types = rows.map((row) => row.type_id);
    console.log("Полученные типы недвижимости:", types);
    res.status(200).json(types);
  } catch (error) {
    console.error("Ошибка при получении типов недвижимости:", {
      message: error.message,
      stack: error.stack,
      origin: req.get("origin"),
    });
    res.status(500).json({ error: `Ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.get("/public/properties/curator-phone", async (req, res) => {
  const { curator_id } = req.query;

  if (!curator_id || isNaN(parseInt(curator_id))) {
    console.warn("Invalid curator_id:", curator_id);
    return res.status(400).json({ error: "curator_id обязателен и должен быть числом" });
  }

  let connection;
  try {
    console.log("Запрос на /public/properties/curator-phone от:", req.get("origin"), "с curator_id:", curator_id);
    connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT phone FROM users1 WHERE id = ?",
      [parseInt(curator_id)]
    );

    if (users.length === 0) {
      console.warn("Куратор с ID", curator_id, "не найден");
      return res.status(404).json({ error: "Куратор не найден" });
    }

    const phone = users[0].phone;
    console.log("Номер телефона куратора:", phone);
    res.status(200).json({ phone });
  } catch (error) {
    console.error("Ошибка при получении номера телефона куратора:", {
      message: error.message,
      stack: error.stack,
      origin: req.get("origin"),
      curator_id,
    });
    res.status(500).json({ error: `Ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

app.get("/public/properties/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    console.warn("Invalid property ID:", id);
    return res.status(400).json({ error: "ID объекта должен быть числом" });
  }

  let connection;
  try {
    console.log(`Запрос на /public/properties/${id} от:`, req.get('origin'));
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT id, type_id, repair, series, zhk_id, price, mkv, rooms, district_id, subdistrict_id, 
              address, description, notes, status, etaj, etajnost, photos, document, owner_name, 
              owner_phone, curator_id, phone, owner_id, latitude, longitude
       FROM properties WHERE id = ?`,
      [parseInt(id)]
    );

    if (rows.length === 0) {
      console.warn(`Объект с ID ${id} не найден`);
      return res.status(404).json({ error: "Объект недвижимости не найден" });
    }

    const row = rows[0];
    let parsedPhotos = [];
    try {
      parsedPhotos = row.photos ? JSON.parse(row.photos) : [];
    } catch (error) {
      console.warn(`Ошибка парсинга photos для ID ${id}:`, error.message);
      parsedPhotos = [];
    }

    const property = {
      id: row.id,
      type_id: row.type_id || null,
      repair: row.repair || null,
      series: row.series || null,
      zhk_id: row.zhk_id || null,
      price: row.price || null,
      mkv: row.mkv || null,
      rooms: row.rooms || null,
      district_id: row.district_id || null,
      subdistrict_id: row.subdistrict_id || null,
      address: row.address || null,
      description: row.description || null,
      notes: row.notes || null,
      status: row.status || null,
      etaj: row.etaj || null,
      etajnost: row.etajnost || null,
      photos: parsedPhotos.map(img => `https://s3.twcstorage.ru/${bucketName}/${img}`),
      document: row.document ? `https://s3.twcstorage.ru/${bucketName}/${row.document}` : null,
      owner_name: row.owner_name || null,
      owner_phone: row.owner_phone || null,
      curator_id: row.curator_id || null,
      phone: row.phone || null,
      owner_id: row.owner_id || null,
      latitude: row.latitude || null,
      longitude: row.longitude || null,
      date: new Date(row.created_at).toLocaleDateString("ru-RU"),
      time: new Date(row.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    };

    res.status(200).json(property);
  } catch (error) {
    console.error(`Ошибка при получении объекта с ID ${id}:`, {
      message: error.message,
      stack: error.stack,
      origin: req.get('origin')
    });
    res.status(500).json({ error: `Ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});


// Public endpoint for AI-related properties
app.get("/aipublic/properties", async (req, res) => {
  const {
    bid,
    titles,
    ftype,
    fjk,
    fseria,
    fsost,
    room,
    frayon,
    fsubrayon,
    fprice,
    fpriceto,
    mkv,
    fetaj,
    page = 1,
    limit = 30,
  } = req.query;

  let connection;
  let query = `SELECT id, type_id, repair, series, zhk_id, price, mkv, rooms, district_id, subdistrict_id,
                      address, description, status, etaj, etajnost, photos
               FROM properties WHERE 1=1`;
  let params = [];

  try {
    connection = await pool.getConnection();
    if (!connection) {
      throw new Error("Не удалось установить соединение с базой данных");
    }

    // Check if properties table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'properties'");
    if (!tables.length) {
      console.warn("Таблица properties не найдена");
      return res.status(200).json([]);
    }

    // Filters
    if (bid && !isNaN(parseInt(bid))) {
      query += ` AND id = ?`;
      params.push(parseInt(bid));
    } else if (bid) {
      return res.status(400).json({ error: "Недействительный параметр bid: должен быть числом" });
    }

    if (titles && typeof titles === "string" && titles.trim()) {
      query += ` AND (address LIKE ? OR description LIKE ?)`;
      params.push(`%${titles.trim()}%`, `%${titles.trim()}%`);
    }

    if (ftype && ftype !== "all" && typeof ftype === "string") {
      query += ` AND type_id = ?`;
      params.push(ftype);
    }

    if (fjk && fjk !== "all" && typeof fjk === "string") {
      query += ` AND zhk_id = ?`;
      params.push(fjk);
    }

    if (fseria && fseria !== "all" && typeof fseria === "string") {
      query += ` AND series = ?`;
      params.push(fseria);
    }

    if (fsost && fsost !== "all") {
      if (fsost === "3") {
        query += ` AND repair IS NULL`;
      } else if (fsost === "1") {
        query += ` AND repair = ?`;
        params.push("ПСО");
      } else if (fsost === "2") {
        query += ` AND repair = ?`;
        params.push("С отделкой");
      }
    }

    if (room && typeof room === "string" && room !== "") {
      query += ` AND rooms = ?`;
      params.push(room);
    }

    if (frayon && frayon !== "all" && typeof frayon === "string") {
      query += ` AND district_id = ?`;
      params.push(frayon);
    }

    if (fsubrayon && fsubrayon !== "all" && typeof fsubrayon === "string") {
      query += ` AND subdistrict_id = ?`;
      params.push(fsubrayon);
    }

    if (fprice && !isNaN(parseFloat(fprice))) {
      query += ` AND price >= ?`;
      params.push(parseFloat(fprice));
    }

    if (fpriceto && !isNaN(parseFloat(fpriceto))) {
      query += ` AND price <= ?`;
      params.push(parseFloat(fpriceto));
    }

    if (mkv && !isNaN(parseFloat(mkv))) {
      query += ` AND mkv >= ?`;
      params.push(parseFloat(mkv));
    }

    if (fetaj && fetaj !== "all") {
      if (fetaj === "4") {
        query += ` AND etaj >= ?`;
        params.push(4);
      } else if (!isNaN(parseInt(fetaj))) {
        query += ` AND etaj = ?`;
        params.push(parseInt(fetaj));
      }
    }

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: "Недействительный параметр page: должен быть числом >= 1" });
    }
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: "Недействительный параметр limit: должен быть числом >= 1" });
    }
    const offset = (parsedPage - 1) * parsedLimit;
    query += ` LIMIT ${parsedLimit} OFFSET ${offset}`;

    console.log("SQL запрос:", query);
    console.log("Параметры:", params);

    const [rows] = await connection.execute(query, params);

    const properties = rows.map(row => {
      let parsedPhotos = [];
      try {
        parsedPhotos = row.photos ? JSON.parse(row.photos) : [];
      } catch (error) {
        console.warn(`Ошибка парсинга photos для ID ${row.id}:`, error.message);
        parsedPhotos = [];
      }
      return {
        id: row.id,
        type_id: row.type_id || null,
        repair: row.repair || null,
        series: row.series || null,
        zhk_id: row.zhk_id || null,
        price: row.price || null,
        mkv: row.mkv || null,
        rooms: row.rooms || null,
        district_id: row.district_id || null,
        subdistrict_id: row.subdistrict_id || null,
        address: row.address || null,
        description: row.description || null,
        status: row.status || null,
        etaj: row.etaj || null,
        etajnost: row.etajnost || null,
        photos: parsedPhotos.map(img => `https://s3.twcstorage.ru/${bucketName}/${img}`),
      };
    });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Ошибка при получении недвижимости:", {
      message: error.message,
      stack: error.stack,
      query: req.query,
      sqlQuery: query,
      sqlParams: params,
    });
    res.status(500).json({ error: `Ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});


// Публичный эндпоинт для получения списка ЖК
// Public endpoint for JK (zhk)
app.get("/public/jk", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, name FROM jk");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching JK:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

// Public endpoint for JK (zhk)
app.get("/public/jk", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, name FROM jk");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching JK:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

// Public endpoint for subdistricts
app.get("/public/subdistricts", async (req, res) => {
  const { district_id } = req.query;
  if (!district_id) {
    return res.status(400).json({ error: "district_id is required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, name FROM subdistricts WHERE district_id = ?",
      [district_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching subdistricts:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

// Endpoint для списка недвижимости
app.get("/public/properties", async (req, res) => {
  const {
    bid,
    titles,
    ftype,
    fjk,
    fseria,
    fsost,
    room,
    frayon,
    fsubrayon,
    fprice,
    fpriceto,
    mkv,
    fetaj,
    page = 1,
    limit = 30,
  } = req.query;

  let connection;
  let query = `SELECT id, type_id, repair, series, zhk_id, price, mkv, rooms, district_id, subdistrict_id, 
                      address, description, status, etaj, etajnost, photos 
               FROM properties WHERE 1=1`;
  let params = [];

  try {
    connection = await pool.getConnection();

    if (!connection) {
      throw new Error("Не удалось установить соединение с базой данных");
    }

    // Проверка существования таблицы
    const [tables] = await connection.execute("SHOW TABLES LIKE 'properties'");
    if (!tables.length) {
      console.warn("Таблица properties не найдена");
      return res.status(200).json([]);
    }

    // Фильтры
    if (bid && !isNaN(parseInt(bid))) {
      query += ` AND id = ?`;
      params.push(parseInt(bid));
    } else if (bid) {
      return res.status(400).json({ error: "Недействительный параметр bid: должен быть числом" });
    }

    if (titles && typeof titles === "string" && titles.trim()) {
      query += ` AND (address = ? OR description = ?)`;
      params.push(titles.trim(), titles.trim());
    }

    if (ftype && ftype !== "all" && typeof ftype === "string") {
      query += ` AND type_id = ?`;
      params.push(ftype);
    }

    if (fjk && fjk !== "all" && typeof fjk === "string") {
      query += ` AND zhk_id = ?`;
      params.push(fjk);
    }

    if (fseria && fseria !== "all" && typeof fseria === "string") {
      query += ` AND series = ?`;
      params.push(fseria);
    }

    if (fsost && fsost !== "all") {
      if (fsost === "3") {
        query += ` AND repair IS NULL`;
      } else if (fsost === "1") {
        query += ` AND repair = ?`;
        params.push("ПСО");
      } else if (fsost === "2") {
        query += ` AND repair = ?`;
        params.push("С отделкой");
      }
    }

    if (room && typeof room === "string" && room !== "") {
      query += ` AND rooms = ?`;
      params.push(room);
    }

    if (frayon && frayon !== "all" && typeof frayon === "string") {
      query += ` AND district_id = ?`;
      params.push(frayon);
    }

    if (fsubrayon && fsubrayon !== "all" && typeof fsubrayon === "string") {
      query += ` AND subdistrict_id = ?`;
      params.push(fsubrayon);
    }

    if (fprice && !isNaN(parseFloat(fprice))) {
      query += ` AND price >= ?`;
      params.push(parseFloat(fprice));
    }

    if (fpriceto && !isNaN(parseFloat(fpriceto))) {
      query += ` AND price <= ?`;
      params.push(parseFloat(fpriceto));
    }

    if (mkv && !isNaN(parseFloat(mkv))) {
      query += ` AND mkv >= ?`;
      params.push(parseFloat(mkv));
    }

    if (fetaj && fetaj !== "all") {
      if (fetaj === "4") {
        query += ` AND etaj >= ?`;
        params.push(4);
      } else if (!isNaN(parseInt(fetaj))) {
        query += ` AND etaj = ?`;
        params.push(parseInt(fetaj));
      }
    }

    // Пагинация (LIMIT/OFFSET без ?)
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ error: "Недействительный параметр page: должен быть числом >= 1" });
    }
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ error: "Недействительный параметр limit: должен быть числом >= 1" });
    }
    const offset = (parsedPage - 1) * parsedLimit;

    query += ` LIMIT ${parsedLimit} OFFSET ${offset}`;

    console.log("SQL запрос:", query);
    console.log("Параметры:", params);

    const [rows] = await connection.execute(query, params);

    const properties = rows.map(row => {
  let parsedPhotos = [];
  try {
    parsedPhotos = row.photos ? JSON.parse(row.photos) : [];
  } catch (error) {
    console.warn(`Ошибка парсинга photos для ID ${row.id}:`, error.message);
    parsedPhotos = [];
  }

  return {
    id: row.id,
    type_id: row.type_id || null,
    repair: row.repair || null,
    series: row.series || null,
    zhk_id: row.zhk_id || null,
    price: row.price || null,
    mkv: row.mkv || null,
    rooms: row.rooms || null,
    district_id: row.district_id || null,
    subdistrict_id: row.subdistrict_id || null,
    address: row.address || null,
    description: row.description || null,
    status: row.status || null,
    etaj: row.etaj || null,
    etajnost: row.etajnost || null,
    photos: parsedPhotos.map(
      img => `https://s3.twcstorage.ru/${bucketName}/${img}`
    )
  };
});


    res.status(200).json(properties);
  } catch (error) {
    console.error("Ошибка при получении недвижимости:", {
      message: error.message,
      stack: error.stack,
      query: req.query,
      sqlQuery: query,
      sqlParams: params
    });
    res.status(500).json({ error: `Ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Redirect Properties (Protected, SUPER_ADMIN only)444
app.patch("/api/properties/redirect", authenticate, async (req, res) => {
  if (req.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Доступ запрещён: требуется роль SUPER_ADMIN" });
  }

  const { propertyIds, curator_id } = req.body;

  if (!Array.isArray(propertyIds) || !curator_id) {
    return res.status(400).json({ error: "propertyIds должен быть массивом, curator_id обязателен" });
  }

  if (isNaN(parseInt(curator_id))) {
    return res.status(400).json({ error: "curator_id должен быть числом" });
  }
  const finalCuratorId = parseInt(curator_id);

  let connection;
  try {
    connection = await pool.getConnection();
    const [curatorCheck] = await connection.execute(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS curator_name FROM users1 WHERE id = ?",
      [finalCuratorId]
    );
    if (curatorCheck.length === 0) {
      return res.status(400).json({ error: "Недействительный ID куратора" });
    }

    const [existingProperties] = await connection.execute(
      "SELECT id FROM properties WHERE id IN (?)",
      [propertyIds]
    );
    if (existingProperties.length !== propertyIds.length) {
      return res.status(404).json({ error: "Некоторые объекты недвижимости не найдены" });
    }

    const [result] = await connection.execute(
      "UPDATE properties SET curator_id = ? WHERE id IN (?)",
      [finalCuratorId, propertyIds]
    );

    res.json({ message: "Объекты недвижимости успешно перенаправлены", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error redirecting properties:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: `Внутренняя ошибка сервера: ${error.message}` });
  } finally {
    if (connection) connection.release();
  }
});

// Global error handler — только после всех маршрутов
app.use((err, req, res, next) => {
  console.error("Global error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ error: `Внутренняя ошибка сервера: ${err.message}` });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Public access: ${publicDomain}:${port}`);
});