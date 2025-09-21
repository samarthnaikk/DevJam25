export interface User {
  id: string
  name: string
  email: string
  image: string
  role: "admin" | "user" | "ADMIN" | "USER" // Support both uppercase and lowercase
  username?: string
}

// Hardcoded role mapping for demo purposes
const ADMIN_EMAILS = [
  "admin@example.com",
  "demo@admin.com",
  "your-email@gmail.com", // Replace with your actual email for demo
  "admin@hackathon.com",
  "test@admin.com",
]

export function getUserRole(email: string): "admin" | "user" {
  return ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user"
}

export function createUserFromGoogleProfile(profile: any): User {
  return {
    id: profile.sub,
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    role: getUserRole(profile.email),
  }
}

// Mock Google OAuth for demo (in real app, use next-auth or similar)
export class GoogleAuth {
  private static instance: GoogleAuth
  private currentUser: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  static getInstance(): GoogleAuth {
    if (!GoogleAuth.instance) {
      GoogleAuth.instance = new GoogleAuth()
    }
    return GoogleAuth.instance
  }

  async signIn(): Promise<User> {
    // Simulate Google OAuth flow
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAdmin = Math.random() > 0.5
        const mockProfile = {
          sub: "123456789",
          name: isAdmin ? "Admin User" : "Demo User",
          email: isAdmin ? "admin@hackathon.com" : "user@example.com",
          picture: "/placeholder.svg?height=40&width=40",
        }

        const user = createUserFromGoogleProfile(mockProfile)
        this.currentUser = user
        this.notifyListeners()
        resolve(user)
      }, 1500) // Simulate network delay
    })
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    this.notifyListeners()
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback)
    // Call immediately with current state
    callback(this.currentUser)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }
}
