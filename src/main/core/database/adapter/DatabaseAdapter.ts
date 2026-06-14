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
  runMigrations(migrationsFolder: string): Promise<void>
  transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T>
  // 트랜잭션을 다이얼렉트별 advisory lock으로 감싼다 (동시 임계구역 시드 직렬화).
  // PG: pg_advisory_xact_lock(커밋 시 자동 해제) / MySQL: GET_LOCK(커밋 후 명시 해제).
  transactionWithAdvisoryLock<T>(lockKey: number, fn: (tx: unknown) => Promise<T>): Promise<T>
}
