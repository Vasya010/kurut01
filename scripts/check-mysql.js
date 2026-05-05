/**
 * Проверка доступа к MySQL и создание БД kurut_local при необходимости.
 * Запуск: npm run db:check
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const mysql = require('mysql2/promise')

const host = process.env.DB_HOST || '127.0.0.1'
const user = process.env.DB_USER || 'root'
const password = process.env.DB_PASSWORD ?? ''
const dbName = (process.env.DB_NAME || 'kurut_local').replace(/[^a-zA-Z0-9_]/g, '_')
const port = Number(process.env.DB_PORT || 3306)

async function main() {
  console.log('Параметры:', { host, port, user, database: dbName, passwordSet: Boolean(password) })

  const admin = await mysql.createConnection({
    host,
    user,
    password,
    port,
    connectTimeout: 8000,
  })

  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  console.log('База данных:', dbName, '— готова')
  await admin.end()

  const pool = mysql.createPool({
    host,
    user,
    password,
    database: dbName,
    port,
    waitForConnections: true,
    connectionLimit: 2,
  })

  const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() AS db')
  console.log('Пинг через пул:', rows)
  await pool.end()
  console.log('Подключение успешно.')
}

main().catch((err) => {
  console.error('Ошибка:', err.code || '', err.message)
  if (err.code === 'ECONNREFUSED') {
    console.error('Служба MySQL не запущена или неверный порт.')
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('Неверный пользователь или пароль (проверьте DB_USER / DB_PASSWORD в .env).')
  }
  process.exit(1)
})
