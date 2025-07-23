"use client"

import type { NotificationWithId } from "@/types/notification"
import { Megaphone } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type NotificationCarouselProps = {
    notifications: NotificationWithId[]
}

export function NotificationCarousel({ notifications }: NotificationCarouselProps) {
    // We need to duplicate the notifications to create a seamless loop
    const duplicatedNotifications = [...notifications, ...notifications];

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary"/>
                What's New?
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
           <div className="h-48 overflow-hidden relative">
             <div className="absolute top-0 animate-scroll-up">
                {duplicatedNotifications.map((notification, index) => (
                     <div key={`${notification.id}-${index}`} className="p-4 border-b">
                         {notification.link ? (
                            <Link href={notification.link} className="font-medium hover:underline">
                                {notification.title}
                            </Link>
                        ) : (
                            <p className="font-medium">{notification.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground pt-1">
                            {new Date(notification.createdAt as string).toLocaleDateString()}
                        </p>
                    </div>
                ))}
             </div>
           </div>
        </CardContent>
    </Card>
  )
}
