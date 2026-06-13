import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: 'build/icon',
    appBundleId: 'com.hydra.app',
    name: 'hydra',
    executableName: 'hydra',
    extraResource: ['./drizzle']
  },
  makers: [
    new MakerSquirrel({
      name: 'hydra',
      setupExe: 'hydra-setup.exe'
    }),
    new MakerDMG({
      name: 'hydra'
    }),
    new MakerDeb({
      options: {
        name: 'hydra',
        productName: 'Hydra'
      }
    }),
    new MakerZIP({}, ['darwin', 'linux'])
  ]
}

export default config
