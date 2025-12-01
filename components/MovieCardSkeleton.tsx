import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full rounded-none" />
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </CardContent>
      <CardFooter className="gap-2 p-4 pt-0">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </CardFooter>
    </Card>
  )
}
