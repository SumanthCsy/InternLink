"use client"

import type { NotificationWithId } from "@/types/notification"
import { Megaphone } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import React from "react"

type NotificationCarouselProps = {
    notifications: NotificationWithId[]
}

export function NotificationCarousel({ notifications }: NotificationCarouselProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    React.useEffect(() => {
        if (notifications.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % notifications.length)
            }, 3000) // Change notification every 3 seconds
            return () => clearInterval(interval)
        }
    }, [notifications.length])

    if (!notifications || notifications.length === 0) {
        return null
    }

    const currentNotification = notifications[currentIndex]

    return (
        <Card className="w-full max-w-lg mx-auto overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    What's New?
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-24 flex items-center justify-center">
                 <div className="w-full px-4 text-center transition-all duration-500">
                     {currentNotification.link ? (
                        <Link href={currentNotification.link} className="font-medium hover:underline">
                            {currentNotification.title}
                        </Link>
                    ) : (
                        <p className="font-medium">{currentNotification.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                        {new Date(currentNotification.createdAt as string).toLocaleDateString()}
                    </p>
                 </div>
            </CardContent>
        </Card>
    )
}