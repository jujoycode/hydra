import { redirect, type LoaderFunction } from 'react-router-dom'
import { initializeSession } from '@stores/AuthStore'

export const authLoader: LoaderFunction = async () => {
  if (!initializeSession()) {
    return redirect('/signin')
  }

  return null
}
