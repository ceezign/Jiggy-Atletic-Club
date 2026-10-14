import { Router, Request } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { clearCache } from "../middleware/cache";
import { ok, created } from "../utils/apiResponse";
import { AppError } from "../utils/AppError";

const router = Router();
router.use(requireAuth, requireAdmin);

type FieldType = "string" | "text" | "int" | "float" | "bool" | "list" | "enum";
interface FieldSpec {
  type: FieldType;
  required?: boolean;
  values?: readonly string[];
}
interface ResourceSpec {
  model: string;
  fields: Record<string, FieldSpec>;
  orderBy: Record<string, "asc" | "desc"> | Record<string, "asc" | "desc">[];
  include?: Record<string, unknown>;
  select?: Record<string, boolean>;
  canCreate?: boolean;
  canDelete?: boolean;
}

const DIFFICULTY = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"] as const;
const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;

// Every editable table is described here. Only the fields listed can be written,
// so nothing sensitive (like password hashes) is ever exposed or editable.
const RESOURCES: Record<string, ResourceSpec> = {
  activities: {
    model: "activity",
    orderBy: { name: "asc" },
    fields: {
      name: { type: "string", required: true },
      slug: { type: "string", required: true },
      description: { type: "text", required: true },
      imageUrl: { type: "string", required: true },
      difficultyLevel: { type: "enum", values: DIFFICULTY, required: true },
      typicalDurationMinutes: { type: "int", required: true },
      suitableFor: { type: "string", required: true },
      isActive: { type: "bool" },
    },
  },
  coaches: {
    model: "coach",
    orderBy: { firstName: "asc" },
    fields: {
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      title: { type: "string", required: true },
      bio: { type: "text", required: true },
      photoUrl: { type: "string", required: true },
      yearsExperience: { type: "int", required: true },
      specialties: { type: "list" },
      certifications: { type: "list" },
      instagramUrl: { type: "string" },
      isActive: { type: "bool" },
    },
  },
  classes: {
    model: "class",
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    include: { coach: true, activity: true },
    fields: {
      name: { type: "string", required: true },
      dayOfWeek: { type: "enum", values: DAYS, required: true },
      startTime: { type: "string", required: true },
      endTime: { type: "string", required: true },
      capacity: { type: "int", required: true },
      coachId: { type: "string", required: true },
      activityId: { type: "string", required: true },
      isActive: { type: "bool" },
    },
  },
  plans: {
    model: "membershipPlan",
    orderBy: { displayOrder: "asc" },
    fields: {
      name: { type: "string", required: true },
      slug: { type: "string", required: true },
      monthlyPrice: { type: "float", required: true },
      features: { type: "list" },
      isRecommended: { type: "bool" },
      displayOrder: { type: "int" },
      isActive: { type: "bool" },
    },
  },
  gallery: {
    model: "galleryImage",
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    fields: {
      imageUrl: { type: "string", required: true },
      caption: { type: "string" },
      displayOrder: { type: "int" },
      isActive: { type: "bool" },
    },
  },
  testimonials: {
    model: "testimonial",
    orderBy: { createdAt: "desc" },
    fields: {
      memberName: { type: "string", required: true },
      profileImageUrl: { type: "string" },
      review: { type: "text", required: true },
      membershipType: { type: "string" },
      isPublished: { type: "bool" },
    },
  },
  trials: {
    model: "freeTrialBooking",
    orderBy: { createdAt: "desc" },
    canCreate: false,
    fields: {
      status: { type: "enum", values: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] },
    },
  },
  messages: {
    model: "contactMessage",
    orderBy: { createdAt: "desc" },
    canCreate: false,
    fields: { isRead: { type: "bool" } },
  },
  members: {
    model: "user",
    orderBy: { createdAt: "desc" },
    canCreate: false,
    canDelete: false,
    select: {
      id: true, firstName: true, lastName: true, email: true, phone: true,
      role: true, isActive: true, fitnessGoal: true, createdAt: true,
    },
    fields: {
      isActive: { type: "bool" },
      role: { type: "enum", values: ["MEMBER", "ADMIN"] },
    },
  },
};

function getSpec(name: string): ResourceSpec {
  const spec = RESOURCES[name];
  if (!spec) throw new AppError(404, `Unknown resource: ${name}`);
  return spec;
}

// Convert and validate a request body against a resource's field list.
function buildData(spec: ResourceSpec, body: Record<string, unknown>, partial: boolean) {
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const [key, f] of Object.entries(spec.fields)) {
    const raw = body[key];
    const missing = raw === undefined || raw === null || raw === "";

    if (missing) {
      if (f.required && !partial) errors[key] = "This field is required";
      // allow clearing optional strings on update
      if (!f.required && raw === "" && (f.type === "string" || f.type === "text")) data[key] = null;
      continue;
    }

    switch (f.type) {
      case "string":
      case "text":
        data[key] = String(raw).trim();
        break;
      case "int": {
        const n = Number(raw);
        if (!Number.isInteger(n)) errors[key] = "Must be a whole number";
        else data[key] = n;
        break;
      }
      case "float": {
        const n = Number(raw);
        if (Number.isNaN(n)) errors[key] = "Must be a number";
        else data[key] = n;
        break;
      }
      case "bool":
        data[key] = raw === true || raw === "true";
        break;
      case "list":
        data[key] = Array.isArray(raw)
          ? raw.map((v) => String(v).trim()).filter(Boolean)
          : String(raw).split(",").map((v) => v.trim()).filter(Boolean);
        break;
      case "enum":
        if (!f.values!.includes(String(raw))) errors[key] = `Must be one of: ${f.values!.join(", ")}`;
        else data[key] = String(raw);
        break;
    }
  }

  if (Object.keys(errors).length) throw new AppError(400, "Please fix the highlighted fields.", errors);
  return data;
}

const delegate = (spec: ResourceSpec) => (prisma as any)[spec.model];
const param = (req: Request, key: string) => String(req.params[key]);

// ---------- Overview stats ----------
router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [members, coaches, activities, classes, pendingTrials, unreadMessages, bookings] = await Promise.all([
      prisma.user.count({ where: { role: "MEMBER" } }),
      prisma.coach.count({ where: { isActive: true } }),
      prisma.activity.count({ where: { isActive: true } }),
      prisma.class.count({ where: { isActive: true } }),
      prisma.freeTrialBooking.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.classBooking.count({ where: { status: "BOOKED" } }),
    ]);
    return ok(res, { members, coaches, activities, classes, pendingTrials, unreadMessages, bookings });
  })
);

// ---------- Generic CRUD ----------
router.get(
  "/:resource",
  asyncHandler(async (req, res) => {
    const spec = getSpec(param(req, "resource"));
    const rows = await delegate(spec).findMany({
      orderBy: spec.orderBy,
      ...(spec.include ? { include: spec.include } : {}),
      ...(spec.select ? { select: spec.select } : {}),
    });
    return ok(res, rows);
  })
);

router.post(
  "/:resource",
  asyncHandler(async (req, res) => {
    const spec = getSpec(param(req, "resource"));
    if (spec.canCreate === false) throw new AppError(405, "Creating this item is not allowed.");
    const row = await delegate(spec).create({ data: buildData(spec, req.body ?? {}, false) });
    clearCache();
    return created(res, row);
  })
);

router.put(
  "/:resource/:id",
  asyncHandler(async (req, res) => {
    const name = param(req, "resource");
    const spec = getSpec(name);
    const data = buildData(spec, req.body ?? {}, true);

    if (name === "members" && param(req, "id") === req.userId && ("role" in data || "isActive" in data)) {
      throw new AppError(400, "You can't change your own role or deactivate your own account.");
    }

    const row = await delegate(spec).update({ where: { id: param(req, "id") }, data });
    clearCache();
    return ok(res, row);
  })
);

router.delete(
  "/:resource/:id",
  asyncHandler(async (req, res) => {
    const spec = getSpec(param(req, "resource"));
    if (spec.canDelete === false) throw new AppError(405, "Deleting this item is not allowed.");
    await delegate(spec).delete({ where: { id: param(req, "id") } });
    clearCache();
    return ok(res, { deleted: true });
  })
);

export default router;
