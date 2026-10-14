// Describes every section of the admin panel. Add a new entry here (and the
// matching resource in backend/src/routes/adminRoutes.ts) to manage a new table.

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "list" | "relation";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  relation?: { resource: string; label: (row: any) => string };
  help?: string;
}

export interface ResourceConfig {
  key: string;
  title: string;
  singular: string;
  description: string;
  fields: FieldDef[];
  columns: { label: string; value: (row: any) => string }[];
  canCreate?: boolean;
  canDelete?: boolean;
}

const yesNo = (v: boolean) => (v ? "Yes" : "No");

export const RESOURCES: ResourceConfig[] = [
  {
    key: "activities",
    title: "Activities",
    singular: "activity",
    description: "The training styles shown on the Activities page.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true, help: "Lowercase with dashes, e.g. strength-training" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "imageUrl", label: "Image URL", type: "text", required: true, help: "e.g. /images/activities/yoga.svg or a full https:// link" },
      { name: "difficultyLevel", label: "Difficulty", type: "select", required: true, options: ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] },
      { name: "typicalDurationMinutes", label: "Duration (minutes)", type: "number", required: true },
      { name: "suitableFor", label: "Suitable for", type: "text", required: true },
      { name: "isActive", label: "Visible on website", type: "checkbox" },
    ],
    columns: [
      { label: "Name", value: (r) => r.name },
      { label: "Level", value: (r) => r.difficultyLevel.replace("_", " ") },
      { label: "Minutes", value: (r) => String(r.typicalDurationMinutes) },
      { label: "Visible", value: (r) => yesNo(r.isActive) },
    ],
  },
  {
    key: "coaches",
    title: "Coaches",
    singular: "coach",
    description: "Trainer profiles shown on the Coaches page.",
    fields: [
      { name: "firstName", label: "First name", type: "text", required: true },
      { name: "lastName", label: "Last name", type: "text", required: true },
      { name: "title", label: "Job title", type: "text", required: true },
      { name: "bio", label: "Bio", type: "textarea", required: true },
      { name: "photoUrl", label: "Photo URL", type: "text", required: true },
      { name: "yearsExperience", label: "Years of experience", type: "number", required: true },
      { name: "specialties", label: "Specialties", type: "list", help: "Separate with commas" },
      { name: "certifications", label: "Certifications", type: "list", help: "Separate with commas" },
      { name: "instagramUrl", label: "Instagram link", type: "text" },
      { name: "isActive", label: "Visible on website", type: "checkbox" },
    ],
    columns: [
      { label: "Name", value: (r) => `${r.firstName} ${r.lastName}` },
      { label: "Title", value: (r) => r.title },
      { label: "Years", value: (r) => String(r.yearsExperience) },
      { label: "Visible", value: (r) => yesNo(r.isActive) },
    ],
  },
  {
    key: "classes",
    title: "Classes",
    singular: "class",
    description: "The weekly timetable members can book into.",
    fields: [
      { name: "name", label: "Class name", type: "text", required: true },
      { name: "dayOfWeek", label: "Day", type: "select", required: true, options: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] },
      { name: "startTime", label: "Start time", type: "text", required: true, help: "24-hour, e.g. 07:00" },
      { name: "endTime", label: "End time", type: "text", required: true, help: "24-hour, e.g. 08:00" },
      { name: "capacity", label: "Capacity (spaces)", type: "number", required: true },
      { name: "coachId", label: "Coach", type: "relation", required: true, relation: { resource: "coaches", label: (r) => `${r.firstName} ${r.lastName}` } },
      { name: "activityId", label: "Activity", type: "relation", required: true, relation: { resource: "activities", label: (r) => r.name } },
      { name: "isActive", label: "Visible on schedule", type: "checkbox" },
    ],
    columns: [
      { label: "Class", value: (r) => r.name },
      { label: "Day", value: (r) => r.dayOfWeek },
      { label: "Time", value: (r) => `${r.startTime}–${r.endTime}` },
      { label: "Coach", value: (r) => (r.coach ? `${r.coach.firstName} ${r.coach.lastName}` : "") },
      { label: "Spaces", value: (r) => String(r.capacity) },
    ],
  },
  {
    key: "plans",
    title: "Membership Plans",
    singular: "plan",
    description: "Prices and features shown on the Membership page.",
    fields: [
      { name: "name", label: "Plan name", type: "text", required: true },
      { name: "slug", label: "URL slug", type: "text", required: true },
      { name: "monthlyPrice", label: "Monthly price", type: "number", required: true },
      { name: "features", label: "Features", type: "list", help: "Separate with commas" },
      { name: "isRecommended", label: "Mark as Most Popular", type: "checkbox" },
      { name: "displayOrder", label: "Display order", type: "number", help: "1 shows first" },
      { name: "isActive", label: "Visible on website", type: "checkbox" },
    ],
    columns: [
      { label: "Plan", value: (r) => r.name },
      { label: "Price / month", value: (r) => `$${r.monthlyPrice}` },
      { label: "Popular", value: (r) => yesNo(r.isRecommended) },
      { label: "Visible", value: (r) => yesNo(r.isActive) },
    ],
  },
  {
    key: "gallery",
    title: "Gallery",
    singular: "image",
    description: "Photos shown on the Gallery page.",
    fields: [
      { name: "imageUrl", label: "Image URL", type: "text", required: true, help: "e.g. /images/gallery/1.svg or a full https:// link" },
      { name: "caption", label: "Caption", type: "text" },
      { name: "displayOrder", label: "Display order", type: "number" },
      { name: "isActive", label: "Visible on website", type: "checkbox" },
    ],
    columns: [
      { label: "Caption", value: (r) => r.caption || "(none)" },
      { label: "Image", value: (r) => r.imageUrl },
      { label: "Visible", value: (r) => yesNo(r.isActive) },
    ],
  },
  {
    key: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    description: "Member reviews shown on the home page.",
    fields: [
      { name: "memberName", label: "Member name", type: "text", required: true },
      { name: "review", label: "Review", type: "textarea", required: true },
      { name: "membershipType", label: "Membership type", type: "text" },
      { name: "profileImageUrl", label: "Photo URL", type: "text" },
      { name: "isPublished", label: "Visible on website", type: "checkbox" },
    ],
    columns: [
      { label: "Member", value: (r) => r.memberName },
      { label: "Plan", value: (r) => r.membershipType || "" },
      { label: "Visible", value: (r) => yesNo(r.isPublished) },
    ],
  },
  {
    key: "trials",
    title: "Free Trial Requests",
    singular: "trial request",
    description: "People who booked a free session. Update the status as you follow up.",
    canCreate: false,
    fields: [{ name: "status", label: "Status", type: "select", options: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] }],
    columns: [
      { label: "Name", value: (r) => r.fullName },
      { label: "Contact", value: (r) => `${r.email} · ${r.phone}` },
      { label: "Wants", value: (r) => `${r.preferredActivity}, ${new Date(r.preferredDate).toLocaleDateString()} ${r.preferredTime}` },
      { label: "Status", value: (r) => r.status },
    ],
  },
  {
    key: "messages",
    title: "Contact Messages",
    singular: "message",
    description: "Messages sent from the Contact page.",
    canCreate: false,
    fields: [{ name: "isRead", label: "Marked as read", type: "checkbox" }],
    columns: [
      { label: "From", value: (r) => `${r.name} (${r.email})` },
      { label: "Subject", value: (r) => r.subject },
      { label: "Message", value: (r) => r.message },
      { label: "Read", value: (r) => yesNo(r.isRead) },
    ],
  },
  {
    key: "members",
    title: "Members",
    singular: "member",
    description: "Everyone who registered. You can deactivate an account or make someone an admin.",
    canCreate: false,
    canDelete: false,
    fields: [
      { name: "role", label: "Role", type: "select", options: ["MEMBER", "ADMIN"] },
      { name: "isActive", label: "Account active", type: "checkbox" },
    ],
    columns: [
      { label: "Name", value: (r) => `${r.firstName} ${r.lastName}` },
      { label: "Email", value: (r) => r.email },
      { label: "Role", value: (r) => r.role },
      { label: "Active", value: (r) => yesNo(r.isActive) },
      { label: "Joined", value: (r) => new Date(r.createdAt).toLocaleDateString() },
    ],
  },
];

export const getResource = (key: string) => RESOURCES.find((r) => r.key === key);
