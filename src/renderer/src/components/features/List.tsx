'use client'

import { useNavigate } from 'react-router-dom'
import { Link, Table, Text } from '@chakra-ui/react'
import { SquareX, CircleHelp, Lightbulb, SquareArrowOutUpRight } from 'lucide-react'

interface ListProps {
  headers: string[]
  datas: Record<string, string | number>[]
}

export function List({ headers, datas }: ListProps) {
  const navigation = useNavigate()

  const getCategoryBadge = (type: string): React.ReactElement => {
    switch (type.toLowerCase()) {
      case 'bug':
        return <SquareX size={16} color='#c23d2e' />
      case 'question':
        return <CircleHelp size={16} color='#0d66e4' />
      case 'suggestion':
        return <Lightbulb size={16} color='#ebbf0b' />
      default:
        throw new Error('Invalid type')
    }
  }

  const getTableCell = (header: string, data: string | number): React.ReactElement => {
    let cell: React.ReactElement

    switch (header) {
      case 'Type': {
        cell = getCategoryBadge(data as string)
        break
      }
      case 'Title': {
        cell = (
          <Link color='#0d66e4' onClick={() => navigation(`issues/${data['Key']}`)}>
            {data}
            <SquareArrowOutUpRight size={12} strokeWidth={3} />
          </Link>
        )
        break
      }
      default:
        cell = <Text fontSize='sm'>{data}</Text>
        break
    }

    return cell
  }

  return (
    <Table.ScrollArea borderWidth='1px' rounded='md' maxHeight={350}>
      <Table.Root stickyHeader interactive showColumnBorder variant='outline' size='sm'>
        <Table.Header>
          <Table.Row>
            {headers.map((header, index) => (
              <Table.ColumnHeader key={index}>{header}</Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {datas.map((data, rowIndex) => (
            <Table.Row key={rowIndex}>
              {headers.map((header, colIndex) => {
                const value = data[header]
                return <Table.Cell key={colIndex}>{getTableCell(header, value)}</Table.Cell>
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
