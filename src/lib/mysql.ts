import { NextResponse } from 'next/server'
import * as mysql from 'promise-mysql'
import 'dotenv/config'

export class MySQL {
  Get = async (sql: string) => {
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_MYSQL_HOST,
      port: 3306,
      database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
      user: process.env.NEXT_PUBLIC_MYSQL_USER,
      password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    })

    try {
      const result = await connection.query(sql)
      return NextResponse.json(result)
    } catch (error) {
      console.error('Error executing SQL query:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    } finally {
      connection.end()
    }
  }
}
