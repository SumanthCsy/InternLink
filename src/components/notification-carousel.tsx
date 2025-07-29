"use client"

import type { NotificationWithId } from "@/types/notification"
import { Megaphone } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import React from "react"
import { cn } from "@/lib/utils"

type NotificationCarouselProps = {
    notifications: NotificationWithId[]
}

export function NotificationCarousel({ notifications }: NotificationCarouselProps) {
    if (!notifications || notifications.length === 0) {
        return null
    }

    // Calculate animation duration based on number of notifications
    const animationDuration = `${notifications.length * 3}s`;

    return (
        <Card className="w-full max-w-lg mx-auto overflow-hidden">
            <style>
                {`
                @keyframes scroll-up {
                    0% {
                        transform: translateY(100%);
                    }
                    100% {
                        transform: translateY(-100%);
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
            <CardContent className="p-0 h-48 flex flex-col items-center justify-center overflow-hidden relative">
                 <div 
                    className="animate-scroll-up absolute w-full"
                    style={{ animationDuration }}
                  >
                    <div className="flex flex-col gap-4 py-4">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="w-full px-4 text-center">
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
