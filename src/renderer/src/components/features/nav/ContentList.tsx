import { useNavigate } from 'react-router-dom'
import { For } from '@chakra-ui/react'
import { Button, ButtonProps } from '@components/ui/button'

interface ContentListProps extends ButtonProps {
  itemList: {
    id: string
    name: string
  }[]
  changeRoute: boolean
}

export function ContentList({ itemList, changeRoute, ...ButtonProps }: ContentListProps): JSX.Element {
  const navigate = useNavigate()

  const navigateItem = (id: string) => {
    if (changeRoute) {
      navigate(`/projects/${id}`)
    }
  }

  return (
    <For each={itemList}>
      {(item, index) => (
        <Button key={index} variant='plain' onClick={() => navigateItem(item.id)} {...ButtonProps}>
          {item.name}
        </Button>
      )}
    </For>
  )
}
