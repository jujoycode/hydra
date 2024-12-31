import { Outlet } from 'react-router-dom'
import { Stack, Grid, GridItem } from '@chakra-ui/react'
import { PageTitle } from '@components/common/PageTitle'
import { SettingSidebar } from '@components/features/nav/SettingSidebar'

export function SettingLayout() {
  return (
    <Stack p={4}>
      <PageTitle title='Settings' subTitle='Account' />

      <Grid mt={2} templateColumns='repeat(5, 1fr)' gap='6'>
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
