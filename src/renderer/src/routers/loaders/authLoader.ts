import { redirect, type LoaderFunction } from 'react-router-dom'
import { initializeSession } from '@stores/authStore'

export const authLoader: LoaderFunction = async () => {
  if (!initializeSession()) {
    return redirect('/signin')
  }

  return null
}
