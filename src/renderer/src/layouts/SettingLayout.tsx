import { Outlet, useParams } from 'react-router-dom'
import { Stack, Grid, GridItem } from '@chakra-ui/react'
import { SettingSidebar } from '@components/features/nav/SettingSidebar'
import { PageTitle } from '@components/common/PageTitle'

export function SettingLayout() {
  const { accountId } = useParams()

  return (
    <Stack p={4}>
      <PageTitle title='Settings' subTitle={`Account Id / ${accountId}`} />

      <Grid mt={4} templateColumns='repeat(5, 1fr)' gap='6'>
        <GridItem colSpan={1}>
          <SettingSidebar />
        </GridItem>

        <GridItem colSpan={4}>
          <Outlet />
        </GridItem>
      </Grid>
    </Stack>
  )
}
