import { useRef } from 'react'
import { useHotKey } from '@hooks/useHotKey'
import { useParams } from 'react-router-dom'
import { Search, ChevronDown } from 'lucide-react'
import { Button, Group, Input, Kbd } from '@chakra-ui/react'
import { InputGroup } from '@components/ui/input-group'
import { PageTitle } from '@components/common/PageTitle'
import { List } from '@components/features/List'

export function ProjectPage() {
  const { projectId } = useParams()
  const inputRef = useRef<HTMLInputElement>(null)

  useHotKey({ key: 'k', command: true }, () => {
    inputRef.current?.focus()
  })

  const FilterButton = ({ label }: { label: string }): JSX.Element => {
    return (
      <Button size='sm' variant='outline' p={2}>
        {label}
        <ChevronDown size={16} strokeWidth={1} />
      </Button>
    )
  }

  return (
    <>
      <PageTitle title='Issue' subTitle={`Project / ${projectId}`} />

      <Group>
        <InputGroup
          flex='1'
          startElement={<Search size={16} strokeWidth={1} />}
          endElement={
            <Kbd size='sm' color='gray.500'>
              ⌘K
            </Kbd>
          }
        >
          <Input ref={inputRef} size='sm' placeholder='search issues' />
        </InputGroup>

        <FilterButton label='유형' />
        <FilterButton label='상태' />
        <FilterButton label='담당자' />
      </Group>
      <List />
    </>
  )
}
