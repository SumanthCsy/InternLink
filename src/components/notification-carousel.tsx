"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import type { NotificationWithId } from "@/types/notification"
import { Megaphone } from "lucide-react"
import Link from "next/link"

type NotificationCarouselProps = {
    notifications: NotificationWithId[]
}

export function NotificationCarousel({ notifications }: NotificationCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent>
        {notifications.map((notification) => (
          <CarouselItem key={notification.id}>
            <div className="p-1">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Megaphone className="h-4 w-4 text-primary"/>
                {notification.link ? (
                    <Link href={notification.link} className="font-medium hover:underline">
                        {notification.title}
                    </Link>
                ) : (
                    <span className="font-medium">{notification.title}</span>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
