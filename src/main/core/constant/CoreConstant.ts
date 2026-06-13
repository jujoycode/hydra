// static-only 클래스 대신 const 객체로 정의 (biome noStaticOnlyClass 대응)
export const CoreConstant = {
  OS_TYPE: {
    WINDOWS: 'win32',
    MAC: 'darwin',
    LINUX: 'linux'
  },
  BUCKET_NAME: 'hydra-public-repo'
} as const
