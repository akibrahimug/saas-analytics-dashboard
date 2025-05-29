"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Phone, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Conversation = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
  messages?: Message[];
};

type Message = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isMe: boolean;
};

// Loading fallback component
function MessagesLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      <div className="flex flex-col mb-4 gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="px-4 py-3 flex-none">
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="space-y-1 p-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex gap-3 mb-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 flex items-center justify-center p-8">
          <Skeleton className="h-5 w-64" />
        </Card>
      </div>
    </div>
  );
}

// Define a client component for the messages UI
export function MessagesUI({
  initialConversations,
}: {
  initialConversations: Conversation[];
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data with a small delay to prevent UI blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(initialConversations || []);
      setActiveConversation(
        initialConversations?.length > 0 ? initialConversations[0] : null
      );
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [initialConversations]);

  // Find active conversation messages or use an empty array
  const activeMessages = activeConversation?.messages || [];

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeConversation) return;

    // In a real app, you would send this to your backend
    console.log("Sending message:", messageInput);

    // Clear the input
    setMessageInput("");
  };

  if (isLoading) {
    return <MessagesLoading />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      <div className="flex flex-col mb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Messages</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Communicate with your team members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Conversations List */}
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="px-4 py-3 flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="divide-y">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer ${
                    activeConversation?.id === conversation.id
                      ? "bg-muted/50"
                      : ""
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback>
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.role}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Conversation */}
        {activeConversation ? (
          <Card className="md:col-span-2 flex flex-col">
            <CardHeader className="px-6 py-4 border-b flex-none">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                    />
                    <AvatarFallback>
                      {activeConversation.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {activeConversation.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${
                          activeConversation.online
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      {activeConversation.online ? "Online" : "Offline"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="space-y-4">
                {activeMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!message.isMe && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage
                          src={activeConversation.avatar}
                          alt={message.sender}
                        />
                        <AvatarFallback>
                          {message.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] ${
                        message.isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 ${
                          message.isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 border-t flex-none">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="md:col-span-2 flex items-center justify-center">
            <p className="text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

// Server component to load the initial data
import { getUserData } from "@/lib/auth";

export default async function MessagesPage() {
  const userData = await getUserData();
  const userConversations = userData?.conversations || [];

  // Generate more fake conversations for testing
  const additionalConversations = Array.from({ length: 4 }, (_, i) => ({
    id: i + 2,
    name: `Team Member ${i + 1}`,
    avatar: "/avatar-placeholder.png",
    role: ["Developer", "Designer", "Project Manager", "QA Engineer"][i % 4],
    lastMessage: "Thanks for the update!",
    timestamp: "Yesterday",
    unread: i % 3,
    online: i % 2 === 0,
    messages: [],
  }));

  const allConversations = [
    ...userConversations,
    ...additionalConversations,
  ].map((conversation: any, index) => {
    // Only add messages to the first conversation
    if (index === 0) {
      return {
        ...conversation,
        messages: [
          {
            id: 1,
            sender: conversation.name,
            content: "Hi there! How's the dashboard project coming along?",
            timestamp: "10:15 AM",
            isMe: false,
          },
          {
            id: 2,
            sender: "Me",
            content:
              "It's going well! I've completed most of the KPI cards and am working on the charts now.",
            timestamp: "10:17 AM",
            isMe: true,
          },
          {
            id: 3,
            sender: conversation.name,
            content:
              "That sounds great! Can we discuss the new dashboard features?",
            timestamp: "10:20 AM",
            isMe: false,
          },
          {
            id: 4,
            sender: conversation.name,
            content: "I'm thinking we should add a team performance view.",
            timestamp: "10:21 AM",
            isMe: false,
          },
          {
            id: 5,
            sender: "Me",
            content:
              "Definitely! I was planning to work on that next. I'll create a mockup and share it with you later today.",
            timestamp: "10:25 AM",
            isMe: true,
          },
          {
            id: 6,
            sender: conversation.name,
            content:
              "Perfect! Also, can we schedule a call this afternoon to go over the requirements in more detail?",
            timestamp: "10:30 AM",
            isMe: false,
          },
        ],
      };
    }
    // For other conversations, just add an empty messages array
    return {
      ...conversation,
      messages: [],
    };
  });

  return <MessagesUI initialConversations={allConversations} />;
}
