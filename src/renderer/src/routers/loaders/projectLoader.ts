import { initializeProject } from '@stores/projectStore'
import { type LoaderFunction } from 'react-router-dom'

export const projectLoader: LoaderFunction = async () => {
  initializeProject()
}
