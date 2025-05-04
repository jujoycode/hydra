import { SettingCard } from '@/molecules/cards/SettingCard'

export default function IntegrationPage() {
  return (
    <div className='w-full'>
      <SettingCard title='Service Integration'>
        <div className='grid gap-4'>
          <div className='border rounded-lg p-5 bg-muted/30'>
            <div className='flex flex-col items-center justify-center text-center py-6'>
              <div className='bg-primary/10 p-4 rounded-full mb-4'>
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-primary'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 8v8' />
                  <path d='M8 12h8' />
                </svg>
              </div>
              <h3 className='text-base font-medium mb-2'>Service Integration Feature is under development</h3>
              <p className='text-sm text-muted-foreground max-w-md'>
                No available integration services. <br />
                More external service integration features will be added soon.
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border rounded-lg p-4 opacity-60 cursor-not-allowed'>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-blue-600 dark:text-blue-400'
                  >
                    <path d='M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z' />
                    <path d='M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' />
                    <path d='M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z' />
                    <path d='M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z' />
                    <path d='M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z' />
                    <path d='M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z' />
                    <path d='M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z' />
                    <path d='M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-medium'>Slack</h3>
                  <p className='text-xs text-muted-foreground'>Update sharing and notifications</p>
                </div>
              </div>
            </div>
            <div className='border rounded-lg p-4 opacity-60 cursor-not-allowed'>
              <div className='flex items-center gap-3'>
                <div className='bg-slate-100 dark:bg-slate-900/50 p-2 rounded-md'>
                  <svg
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-slate-600 dark:text-slate-400'
                  >
                    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                  </svg>
                </div>
                <div>
                  <h3 className='text-sm font-medium'>GitHub</h3>
                  <p className='text-xs text-muted-foreground'>Code repository connection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  )
}
