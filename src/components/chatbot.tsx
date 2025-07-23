"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { answerQuestions } from "@/ai/flows/answer-questions";
import { cn } from "@/lib/utils";

type Message = {
  text: string;
  sender: "user" | "bot";
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const helpPopupTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Show popup on initial load
    helpPopupTimerRef.current = setTimeout(() => setShowHelpPopup(true), 2000); // Show after 2s
    
    // Hide after 20 seconds total
    const hideTimer = setTimeout(() => {
        setShowHelpPopup(false);
    }, 22000); // 2s delay + 20s visible

    return () => {
        clearTimeout(helpPopupTimerRef.current);
        clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
    // When opening chat, show the help popup for a few seconds
    if (!isOpen) {
      setShowHelpPopup(true);
      clearTimeout(helpPopupTimerRef.current); // Clear any existing timers
      helpPopupTimerRef.current = setTimeout(() => {
        setShowHelpPopup(false);
      }, 5000); // Hide after 5 seconds
    } else {
        // if closing, hide it immediately
        setShowHelpPopup(false);
        clearTimeout(helpPopupTimerRef.current);
    }
  };


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await answerQuestions({ question: input });
      const botMessage: Message = { text: response.answer, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting answer from AI:", error);
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <div className={cn("absolute bottom-full right-0 mb-2 transition-all duration-300", showHelpPopup ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none")}>
            <div className="bg-primary text-primary-foreground text-sm rounded-lg px-3 py-1 shadow-lg whitespace-nowrap">
                How can I help you?
            </div>
        </div>
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg animate-bounce" onClick={handleToggleChat}>
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          <span className="sr-only">Toggle Chatbot</span>
        </Button>
      </div>
        <div className={cn("fixed bottom-20 right-4 z-50 w-full max-w-sm shadow-xl transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
               <Avatar>
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <CardTitle className="font-headline text-lg">AI Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted">
                        <p>Hello! How can I help you with internships, applications, or community guidelines today?</p>
                    </div>
                </div>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${
                      message.sender === "user" ? "justify-end" : ""
                    }`}
                  >
                    {message.sender === "bot" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg p-3 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted">
                            <div className="flex items-center space-x-1">
                                <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-foreground rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <div className="relative w-full">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        </div>
    </>
  );
}
