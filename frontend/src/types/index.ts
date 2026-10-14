export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  fitnessGoal: string | null;
  emergencyContact: string | null;
  profilePhotoUrl: string | null;
  role?: string;
  createdAt?: string;
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  photoUrl: string;
  yearsExperience: number;
  specialties: string[];
  certifications: string[];
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  difficultyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  typicalDurationMinutes: number;
  suitableFor: string;
}

export interface GymClass {
  id: string;
  name: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity: number;
  spacesAvailable: number;
  coach: { id: string; firstName: string; lastName: string; photoUrl?: string };
  activity: { id: string; name: string; slug: string };
}

export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  monthlyPrice: string;
  features: string[];
  isRecommended: boolean;
}

export interface Membership {
  id: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startDate: string;
  expiryDate: string;
  plan: MembershipPlan;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  category: string;
  authorName: string;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  MemberName: string;
  profileImageUrl?: string | null;
  review: string;
  MembershipType?: string | null;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}
export interface ApiFailure {
  success: false;
  error: { message: string; details?: unknown };
}
