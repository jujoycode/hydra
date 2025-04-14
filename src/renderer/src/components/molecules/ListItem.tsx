import { Link } from 'react-router'
import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@/atoms/NavigationMenu'

// NavigationMenu 아이템을 위한 ListItem 컴포넌트
interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string
  href: string
  imageUrl?: string
  children?: React.ReactNode
}

export function ListItem({ title, href, imageUrl, children, className, ...props }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0'>
              {imageUrl ? (
                <img src={imageUrl} alt={title} className='h-8 w-8 rounded-md object-cover' />
              ) : (
                <div className='h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center'>
                  <span className='text-sm font-medium text-primary'>{title.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className='space-y-1'>
              <div className='text-sm font-medium leading-none'>{title}</div>
              <p className='line-clamp-2 text-sm leading-snug text-muted-foreground text-ellipsis'>{children}</p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
