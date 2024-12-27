import { useNavigate } from 'react-router-dom'
import { For } from '@chakra-ui/react'
import { Button, ButtonProps } from '@components/ui/button'

interface ContentListProps extends ButtonProps {
  changeRoute?: boolean
  baseRoute?: string
  itemList: {
    id?: string
    icon?: React.ReactNode
    name: string
  }[]
}

export function ContentList({
  itemList,
  baseRoute = '',
  changeRoute = false,
  ...ButtonProps
}: ContentListProps): JSX.Element {
  const navigate = useNavigate()

  const navigateItem = (baseRoute: string, id?: string) => {
    if (changeRoute && baseRoute) {
      const route = id ? `${baseRoute}/${id}` : baseRoute
      navigate(route)
    }
  }

  return (
    <For each={itemList}>
      {(item, index) => (
        <Button key={index} variant='ghost' onClick={() => navigateItem(baseRoute, item.id)} {...ButtonProps}>
          {item.icon}
          {item.name}
        </Button>
      )}
    </For>
  )
}
