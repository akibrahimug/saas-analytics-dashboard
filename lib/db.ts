// Mock database client for preview
export const mockDb = {
  user: {
    findMany: async () => {
      return [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          image: "/abstract-geometric-shapes.png",
          role: "admin",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          image: "/abstract-geometric-shapes.png",
          role: "manager",
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          image: "/abstract-geometric-shapes.png",
          role: "member",
        },
        {
          id: "4",
          name: "Alice Williams",
          email: "alice@example.com",
          image: "/abstract-geometric-shapes.png",
          role: "viewer",
        },
      ]
    },
    findUnique: async () => {
      return {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "/abstract-geometric-shapes.png",
        role: "admin",
      }
    },
    update: async (data: any) => {
      console.log("Mock update:", data)
      return data.data
    },
    create: async (data: any) => {
      console.log("Mock create:", data)
      return {
        id: "new-user",
        ...data.data,
      }
    },
  },
  // Add other mock models as needed
}

// Export mockDb directly instead of trying to use PrismaClient
export const db = mockDb
