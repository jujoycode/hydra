import { useState, useMemo } from 'react'
import { useAuthStore } from '@stores/authStore'
import { Box, Flex, Text, Input, Stack, type FileUploadFileChangeDetails } from '@chakra-ui/react'
import { Button } from '@components/ui/button'
import { Avatar } from '@components/ui/avatar'
import { toaster } from '@components/ui/toaster'
import { FileUploadRoot, FileUploadTrigger } from '@components/ui/file-upload'
import { getFileExtension, getPublicAccessUrl } from '@utils/commonUtil'
import { IpcChannel } from '@interface/CoreInterface'

interface UserFormState {
  name: string
  avatarFile: File | null
  avatarPath?: string
}

export function AccountSettingPage(): JSX.Element {
  const { user, actions } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formState, setFormState] = useState<UserFormState>({
    name: user?.name ?? '',
    avatarFile: null,
    avatarPath: user?.avatar_key ? getPublicAccessUrl(user.avatar_key) : undefined
  })

  // 사용자 정보 변경 여부 확인
  const isUserInfoChanged = useMemo(() => {
    return formState.name !== user?.name || formState.avatarFile !== null
  }, [formState.name, formState.avatarFile, user?.name])

  /**
   * handleImageUpload
   * @desc 이미지 업로드 처리
   */
  const handleImageUpload = ({ rejectedFiles, acceptedFiles }: FileUploadFileChangeDetails) => {
    if (rejectedFiles.length > 0) {
      toaster.error({
        title: 'Invalid File',
        description: 'Image must be less than 5MB and in PNG, JPEG, or JPG format'
      })

      return
    }

    if (acceptedFiles.length > 0) {
      const reader = new FileReader()

      reader.onload = () => {
        setFormState((prev) => ({
          ...prev,
          avatarFile: acceptedFiles[0],
          avatarPath: reader.result as string
        }))
      }

      reader.readAsDataURL(acceptedFiles[0])
    }
  }

  /**
   * handleReset
   * @desc 사용자 정보 초기화
   */
  const handleReset = () => {
    setFormState({
      name: user?.name ?? '',
      avatarFile: null,
      avatarPath: user?.avatar_key ?? undefined
    })
  }

  /**
   * callUpdateUserData
   * @desc 사용자 정보 업데이트 요청
   */
  const callUpdateUserData = async () => {
    // *. 사용자 정보 유효성 검사
    if (!user?.id) {
      toaster.error({
        title: 'Invalid Parameter',
        description: 'Auth info invalid, Please try again after re-logging.'
      })

      return
    }

    try {
      // 1. 사용자 정보 업데이트 시작
      setIsLoading(true)

      // 2. 사용자 아바타 파일 업로드
      let avatarPath = formState.avatarPath
      if (formState.avatarFile) {
        const fileBuffer = await formState.avatarFile.arrayBuffer()
        const uploadFileResult = await window.callApi(IpcChannel.STORAGE_UPLOAD_FILE, {
          savePath: `user/${user.id}.${getFileExtension(formState.avatarFile.name)}`,
          file: fileBuffer,
          fileOptions: { upsert: true, cacheControl: '0' }
        })

        avatarPath = uploadFileResult.path
      }

      // 3. 사용자 정보 업데이트 (public.users)
      const updatedInfo = await window.callApi(IpcChannel.AUTH_UPDATE_USER, {
        userId: user.id,
        userName: formState.name,
        userAvatarKey: avatarPath
      })

      // 4. 사용자 정보 업데이트 (AuthStore)
      actions.setUser({
        id: updatedInfo.user_id,
        name: updatedInfo.user_name,
        email: updatedInfo.user_email,
        created_at: updatedInfo.user_created_at,
        updated_at: updatedInfo.user_updated_at,
        avatar_key: updatedInfo.user_avatar_key
      })
    } catch (error) {
      // 5. 사용자 정보 업데이트 실패 처리
      toaster.error({
        title: 'Update Failed',
        description: 'Failed to update user information'
      })

      handleReset()
    } finally {
      // 6. 로딩 상태 초기화
      setIsLoading(false)
    }
  }

  return (
    <Box bg='white' boxShadow='md' borderRadius='lg' p={6}>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Stack gap={6} flex={1}>
          <FileUploadRoot
            maxFileSize={1024 * 1024 * 5}
            accept={['image/png', 'image/jpeg', 'image/jpg']}
            onFileChange={(files) => handleImageUpload(files)}
          >
            <FileUploadTrigger asChild>
              <Avatar
                _hover={{ bg: 'gray.200' }}
                variant='outline'
                shape='rounded'
                size='xl'
                name={formState.name ? formState.name : user?.id}
                src={formState.avatarPath}
                cursor='pointer'
              />
            </FileUploadTrigger>
          </FileUploadRoot>

          <Box>
            <Text fontSize='sm' fontWeight='medium' mb={2}>
              Name
            </Text>
            <Input
              placeholder='Enter your full name'
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            />
          </Box>

          <Box>
            <Text fontSize='sm' fontWeight='medium' mb={2}>
              Email
            </Text>
            <Input value={user?.email!} disabled />
          </Box>

          <Box>
            <Button
              float='right'
              size='md'
              px={6}
              disabled={!isUserInfoChanged}
              onClick={callUpdateUserData}
              loading={isLoading}
            >
              Save
            </Button>
            <Button variant='ghost' float='right' size='md' px={6} mr={4} onClick={handleReset}>
              Clear
            </Button>
          </Box>
        </Stack>
      </Flex>
    </Box>
  )
}
