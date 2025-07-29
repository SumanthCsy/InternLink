"use client"

import type { NotificationWithId } from "@/types/notification"
import { Megaphone } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import React from "react"
import { Badge } from "./ui/badge"

type NotificationCarouselProps = {
    notifications: NotificationWithId[]
}

export function NotificationCarousel({ notifications }: NotificationCarouselProps) {
    if (!notifications || notifications.length === 0) {
        return null
    }

    const duplicatedNotifications = [...notifications, ...notifications];
    const animationDuration = `${notifications.length * 5}s`;

    return (
        <Card className="w-full max-w-lg mx-auto overflow-hidden">
            <style>
                {`
                @keyframes scroll-up {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(-50%);
                    }
                }
                .animate-scroll-up {
                    animation: scroll-up linear infinite;
                }
                `}
            </style>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    What's New?
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-48 flex flex-col items-center justify-start overflow-hidden relative">
                 <div 
                    className="animate-scroll-up absolute w-full"
                    style={{ animationDuration }}
                  >
                    <div className="flex flex-col gap-4 py-4">
                        {duplicatedNotifications.map((notification, index) => (
                            <div key={`${notification.id}-${index}`} className="w-full px-4 text-center">
                                <div className="flex justify-center items-center gap-2">
                                     {notification.isNew && (
                                        <Badge className="animate-blink">New</Badge>
                                     )}
                                    {notification.link ? (
                                        <Link href={notification.link} className="font-medium hover:underline">
                                            {notification.title}
                                        </Link>
                                    ) : (
                                        <p className="font-medium">{notification.title}</p>
                                    )}
                                </div>
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
