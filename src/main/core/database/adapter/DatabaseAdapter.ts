// 데이터베이스 어댑터 인터페이스 - 다중 DBMS 지원을 위한 추상화 레이어

export interface ConnectionConfig {
  host: string
  port: number
  database: string
  user: string
  password: string
  sslCertPath?: string
}

export interface DatabaseAdapter {
  connect(config: ConnectionConfig): Promise<void>
  disconnect(): Promise<void>
  isConnected(): boolean
  getConnection(): unknown
  createRole(roleName: string, password: string): Promise<void>
  dropRole(roleName: string): Promise<void>
  runMigrations(): Promise<void>
  transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T>
}
