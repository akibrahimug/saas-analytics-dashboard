// This is a mock implementation for demonstration purposes
// In a real app, you would use the Contentful SDK to fetch data

export interface Announcement {
  id: string
  content: string
  date: string
  author: {
    name: string
    avatar: string
  }
  link?: {
    text: string
    url: string
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  // In a real app, you would fetch this data from Contentful
  // This is mock data for demonstration purposes
  return [
    {
      id: "1",
      content: "We've just released a new version of our product with improved analytics features!",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder-user.jpg",
      },
      link: {
        text: "View release notes",
        url: "#",
      },
    },
    {
      id: "2",
      content: "Team meeting scheduled for tomorrow at 10:00 AM. Please prepare your weekly updates.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      author: {
        name: "Michael Chen",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: "3",
      content: "New training materials on remote collaboration are now available in the knowledge base.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      author: {
        name: "Emily Rodriguez",
        avatar: "/placeholder-user.jpg",
      },
      link: {
        text: "Access training",
        url: "#",
      },
    },
    {
      id: "4",
      content: "Reminder: Please complete your quarterly performance reviews by the end of this week.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      author: {
        name: "David Wilson",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: "5",
      content: "We're excited to announce that we've reached 10,000 users! Thanks for all your hard work.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      author: {
        name: "Jessica Lee",
        avatar: "/placeholder-user.jpg",
      },
    },
  ]
}
