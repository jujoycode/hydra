import { Container, Input, Stack, Text } from '@chakra-ui/react'

export function AccountSettingPage(): JSX.Element {
  const Field = ({ label }: { label: string }) => (
    <Container gap={0}>
      <Text fontSize='sm'>{label}</Text>
      <Input></Input>
    </Container>
  )

  return (
    <Stack gap={4}>
      <Field label='Avatar' />
      <Field label='User Name' />
      <Field label='Email' />
    </Stack>
  )
}
