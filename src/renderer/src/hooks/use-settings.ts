import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { invokeApi } from '@/hooks/use-api'
import { useAuth } from '@/hooks/use-auth'
import { IpcChannel } from '@/interface/CoreInterface'

export function useSettings() {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.user_name || '')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNameUpdate = async () => {
    if (!user) return

    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }

    setIsLoading(true)
    try {
      const data = await invokeApi(IpcChannel.AUTH_UPDATE_USER, {
        userId: user.user_id,
        userName: name.trim()
      })

      if (data) {
        setUser({
          ...user,
          user_name: data.user_name
        })
        toast.success('Name changed')
      }
    } catch (error) {
      console.error('Name change failed:', error)
      toast.error('Name change failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return

    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // 파일 크기 제한 (최대 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be up to 5MB')
      return
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files can be uploaded')
      return
    }

    setIsLoading(true)
    try {
      // 파일을 ArrayBuffer로 변환
      const arrayBuffer = await file.arrayBuffer()

      // 파일 경로 생성 (유저 ID + 파일 확장자)
      const fileExtension = file.name.split('.').pop()
      const filePath = `avatars/${user.user_id}.${fileExtension}`

      // Upload to storage
      const data = await invokeApi(IpcChannel.STORAGE_UPLOAD_FILE, {
        fileName: file.name,
        filePath,
        fileData: arrayBuffer
      })

      if (data) {
        // 사용자 정보 업데이트
        await invokeApi(IpcChannel.AUTH_UPDATE_USER, {
          userId: user.user_id,
          userAvatarKey: filePath
        })

        // 사용자 상태 업데이트
        setUser({
          ...user,
          user_avatar_path: filePath
        })

        toast.success('Profile image updated')
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      toast.error('Image upload failed')
    } finally {
      setIsLoading(false)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return {
    user,
    name,
    setName,
    isLoading,
    fileInputRef,
    handleNameUpdate,
    handleAvatarClick,
    handleFileChange
  }
}
