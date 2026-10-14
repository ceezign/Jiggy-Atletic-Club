import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ---------- Activities ----------
  const activitiesData = [
    {
      name: "Strength Training",
      slug: "strength-training",
      description:
        "Build raw power with barbell and free-weight fundamentals — squats, deadlifts, presses — coached for safe, progressive overload.",
      imageUrl: "/images/activities/strength-training.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 60,
      suitableFor: "Anyone wanting to build muscle and functional strength",
    },
    {
      name: "Weightlifting",
      slug: "weightlifting",
      description:
        "Technical Olympic lifting — the snatch and clean & jerk — developed under close coaching for speed, mobility, and precision.",
      imageUrl: "/images/activities/weightlifting.svg",
      difficultyLevel: "INTERMEDIATE" as const,
      typicalDurationMinutes: 75,
      suitableFor: "Lifters with basic barbell experience",
    },
    {
      name: "Cardio",
      slug: "cardio",
      description:
        "Row, bike, and run-based conditioning designed to build endurance and torch calories without wrecking your joints.",
      imageUrl: "/images/activities/cardio.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 45,
      suitableFor: "All fitness levels welcome",
    },
    {
      name: "HIIT",
      slug: "hiit",
      description:
        "High-intensity interval circuits that pair short, explosive efforts with brief recovery for maximum calorie burn.",
      imageUrl: "/images/activities/hiit.svg",
      difficultyLevel: "INTERMEDIATE" as const,
      typicalDurationMinutes: 30,
      suitableFor: "Best for those with a base level of fitness",
    },
    {
      name: "Boxing",
      slug: "boxing",
      description:
        "Pad work, footwork, and combinations that build coordination and cardio while teaching real technique.",
      imageUrl: "/images/activities/boxing.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 50,
      suitableFor: "No prior boxing experience required",
    },
    {
      name: "Functional Training",
      slug: "functional-training",
      description:
        "Movement patterns pulled from everyday life — carries, crawls, throws — to build strength that transfers outside the gym.",
      imageUrl: "/images/activities/functional-training.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 50,
      suitableFor: "Great for general fitness and injury prevention",
    },
    {
      name: "Yoga",
      slug: "yoga",
      description:
        "Breath-led flows that build flexibility, balance, and a calmer mind — a natural complement to heavier training days.",
      imageUrl: "/images/activities/yoga.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 60,
      suitableFor: "Suitable for every fitness level",
    },
    {
      name: "Personal Training",
      slug: "personal-training",
      description:
        "One-to-one coaching built entirely around your goals, schedule, and starting point.",
      imageUrl: "/images/activities/personal-training.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 60,
      suitableFor: "Anyone who wants a plan built specifically for them",
    },
    {
      name: "Bodybuilding",
      slug: "bodybuilding",
      description:
        "Hypertrophy-focused programming with an emphasis on muscle isolation, volume, and mind-muscle connection.",
      imageUrl: "/images/activities/bodybuilding.svg",
      difficultyLevel: "INTERMEDIATE" as const,
      typicalDurationMinutes: 75,
      suitableFor: "Lifters focused on building muscle size",
    },
    {
      name: "Group Fitness",
      slug: "group-fitness",
      description:
        "Energetic, coach-led classes that combine strength and conditioning in a motivating group setting.",
      imageUrl: "/images/activities/group-fitness.svg",
      difficultyLevel: "ALL_LEVELS" as const,
      typicalDurationMinutes: 45,
      suitableFor: "All fitness levels welcome",
    },
  ];

  const activities = [];
  for (const a of activitiesData) {
    activities.push(
      await prisma.activity.upsert({ where: { slug: a.slug }, update: a, create: a })
    );
  }
  const byName = (n: string) => activities.find((a) => a.name === n)!;

  // ---------- Coaches ----------
  const coachesData = [
    {
      firstName: "David",
      lastName: "Johnson",
      title: "Strength & Conditioning Coach",
      bio: "David has spent eight years helping lifters of all levels build serious, sustainable strength through smart programming and hands-on coaching.",
      photoUrl: "/images/coaches/david-johnson.svg",
      yearsExperience: 8,
      specialties: ["Strength Training", "Weightlifting", "Functional Fitness"],
      certifications: ["NSCA-CSCS", "USAW Level 1"],
      instagramUrl: "https://instagram.com/",
    },
    {
      firstName: "Maria",
      lastName: "Torres",
      title: "Boxing & HIIT Coach",
      bio: "A former amateur boxer, Maria brings real technique and relentless energy to every class she runs.",
      photoUrl: "/images/coaches/maria-torres.svg",
      yearsExperience: 6,
      specialties: ["Boxing", "HIIT", "Cardio"],
      certifications: ["USA Boxing Coach", "ACE-CPT"],
      instagramUrl: "https://instagram.com/",
    },
    {
      firstName: "James",
      lastName: "Okafor",
      title: "Bodybuilding & Personal Training Coach",
      bio: "James specializes in hypertrophy programming and one-to-one coaching tailored to each client's physique goals.",
      photoUrl: "/images/coaches/james-okafor.svg",
      yearsExperience: 10,
      specialties: ["Bodybuilding", "Personal Training", "Strength Training"],
      certifications: ["NASM-CPT", "Precision Nutrition L1"],
      instagramUrl: "https://instagram.com/",
    },
    {
      firstName: "Sophie",
      lastName: "Bennett",
      title: "Yoga & Mobility Coach",
      bio: "Sophie teaches breath-led yoga that restores mobility and balances out the demands of heavy training.",
      photoUrl: "/images/coaches/sophie-bennett.svg",
      yearsExperience: 7,
      specialties: ["Yoga", "Functional Training"],
      certifications: ["RYT-500", "FRC Mobility Specialist"],
      instagramUrl: "https://instagram.com/",
    },
    {
      firstName: "Marcus",
      lastName: "Lee",
      title: "Group Fitness Coach",
      bio: "Marcus runs the gym's most energetic group sessions, blending strength and conditioning into workouts people actually look forward to.",
      photoUrl: "/images/coaches/marcus-lee.svg",
      yearsExperience: 5,
      specialties: ["Group Fitness", "HIIT", "Cardio"],
      certifications: ["ACE-CPT", "TRX Certified"],
      instagramUrl: "https://instagram.com/",
    },
  ];

  const coaches = [];
  for (const c of coachesData) {
    const existing = await prisma.coach.findFirst({
      where: { firstName: c.firstName, lastName: c.lastName },
    });
    coaches.push(
      existing
        ? await prisma.coach.update({ where: { id: existing.id }, data: c })
        : await prisma.coach.create({ data: c })
    );
  }
  const coachByName = (n: string) => coaches.find((c) => `${c.firstName} ${c.lastName}` === n)!;

  // ---------- Classes ----------
  const classesData = [
    { name: "Morning Strength", dayOfWeek: "MONDAY" as const, startTime: "06:30", endTime: "07:30", capacity: 16, coach: "David Johnson", activity: "Strength Training" },
    { name: "HIIT Training", dayOfWeek: "MONDAY" as const, startTime: "18:00", endTime: "18:45", capacity: 20, coach: "Marcus Lee", activity: "HIIT" },
    { name: "Boxing", dayOfWeek: "TUESDAY" as const, startTime: "07:00", endTime: "07:50", capacity: 14, coach: "Maria Torres", activity: "Boxing" },
    { name: "Yoga Flow", dayOfWeek: "TUESDAY" as const, startTime: "19:00", endTime: "20:00", capacity: 18, coach: "Sophie Bennett", activity: "Yoga" },
    { name: "Olympic Lifting", dayOfWeek: "WEDNESDAY" as const, startTime: "17:30", endTime: "18:45", capacity: 10, coach: "David Johnson", activity: "Weightlifting" },
    { name: "Cardio Blast", dayOfWeek: "WEDNESDAY" as const, startTime: "12:15", endTime: "13:00", capacity: 20, coach: "Marcus Lee", activity: "Cardio" },
    { name: "Functional Fitness", dayOfWeek: "THURSDAY" as const, startTime: "06:30", endTime: "07:20", capacity: 16, coach: "Sophie Bennett", activity: "Functional Training" },
    { name: "Boxing Conditioning", dayOfWeek: "THURSDAY" as const, startTime: "18:30", endTime: "19:20", capacity: 14, coach: "Maria Torres", activity: "Boxing" },
    { name: "Bodybuilding Fundamentals", dayOfWeek: "FRIDAY" as const, startTime: "17:00", endTime: "18:15", capacity: 12, coach: "James Okafor", activity: "Bodybuilding" },
    { name: "Group Fitness Circuit", dayOfWeek: "FRIDAY" as const, startTime: "18:30", endTime: "19:15", capacity: 22, coach: "Marcus Lee", activity: "Group Fitness" },
    { name: "Saturday Strength", dayOfWeek: "SATURDAY" as const, startTime: "09:00", endTime: "10:00", capacity: 16, coach: "David Johnson", activity: "Strength Training" },
    { name: "Weekend HIIT", dayOfWeek: "SATURDAY" as const, startTime: "10:30", endTime: "11:15", capacity: 20, coach: "Marcus Lee", activity: "HIIT" },
    { name: "Restorative Yoga", dayOfWeek: "SUNDAY" as const, startTime: "10:00", endTime: "11:00", capacity: 18, coach: "Sophie Bennett", activity: "Yoga" },
  ];

  for (const c of classesData) {
    const coach = coachByName(c.coach);
    const activity = byName(c.activity);
    const existing = await prisma.class.findFirst({
      where: { name: c.name, dayOfWeek: c.dayOfWeek, startTime: c.startTime },
    });
    const data = {
      name: c.name,
      dayOfWeek: c.dayOfWeek,
      startTime: c.startTime,
      endTime: c.endTime,
      capacity: c.capacity,
      coachId: coach.id,
      activityId: activity.id,
    };
    if (existing) {
      await prisma.class.update({ where: { id: existing.id }, data });
    } else {
      await prisma.class.create({ data });
    }
  }

  // ---------- Membership plans ----------
  const plansData = [
    {
      name: "BASIC",
      slug: "basic",
      monthlyPrice: 29,
      features: ["Gym access", "Cardio equipment", "Weight training", "Locker access"],
      isRecommended: false,
      displayOrder: 1,
    },
    {
      name: "STANDARD",
      slug: "standard",
      monthlyPrice: 49,
      features: ["Everything in Basic", "Group classes", "Fitness assessment", "Workout guidance"],
      isRecommended: false,
      displayOrder: 2,
    },
    {
      name: "PREMIUM",
      slug: "premium",
      monthlyPrice: 79,
      features: [
        "Everything in Standard",
        "Personal training sessions",
        "Personalized workout plan",
        "Progress tracking",
      ],
      isRecommended: true,
      displayOrder: 3,
    },
    {
      name: "ELITE",
      slug: "elite",
      monthlyPrice: 119,
      features: [
        "Everything in Premium",
        "Priority personal training",
        "Nutrition guidance",
        "Advanced progress tracking",
      ],
      isRecommended: false,
      displayOrder: 4,
    },
  ];

  for (const p of plansData) {
    await prisma.membershipPlan.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // ---------- Blog posts ----------
  const postsData = [
    {
      title: "Beginner's Guide to Strength Training",
      slug: "beginners-guide-to-strength-training",
      excerpt: "Everything you need to know before your first strength session — form, frequency, and realistic expectations.",
      content:
        "Strength training rewards consistency more than intensity when you're starting out. Focus on learning the core movement patterns — squat, hinge, push, pull, carry — before adding significant weight. Two to three sessions a week is plenty to start seeing progress, and recovery matters just as much as the work itself.",
      coverImageUrl: "/images/blog/strength-training-guide.svg",
      category: "Strength",
      authorName: "David Johnson",
    },
    {
      title: "How to Build a Consistent Workout Routine",
      slug: "how-to-build-a-consistent-workout-routine",
      excerpt: "Consistency beats intensity. Here's how to build a training habit that actually sticks.",
      content:
        "The biggest predictor of results isn't your program, it's whether you show up. Start with a schedule you can realistically keep, attach your workouts to an existing habit, and track your sessions somewhere visible. Small, repeatable wins build the identity of someone who trains — and that's what carries you through the weeks motivation runs low.",
      coverImageUrl: "/images/blog/consistent-routine.svg",
      category: "Habits",
      authorName: "Marcus Lee",
    },
    {
      title: "The Importance of Recovery",
      slug: "the-importance-of-recovery",
      excerpt: "Growth happens between sessions, not during them. Here's how to recover properly.",
      content:
        "Training breaks your body down; recovery is where it adapts and grows stronger. Prioritize seven to nine hours of sleep, keep at least one full rest day a week, and don't be afraid to lower intensity when you're consistently fatigued. Recovery isn't a break from progress — it's part of it.",
      coverImageUrl: "/images/blog/recovery.svg",
      category: "Recovery",
      authorName: "Sophie Bennett",
    },
    {
      title: "Beginner Cardio Guide",
      slug: "beginner-cardio-guide",
      excerpt: "Build your aerobic base without burning out — a practical approach to starting cardio.",
      content:
        "Cardio doesn't need to mean punishing yourself on a treadmill. Start with low-intensity steady state work you can hold a conversation through, two to three times a week, and layer in intervals once that feels easy. Your engine improves faster than you'd expect when you build it gradually.",
      coverImageUrl: "/images/blog/cardio-guide.svg",
      category: "Cardio",
      authorName: "Maria Torres",
    },
    {
      title: "Healthy Nutrition Basics",
      slug: "healthy-nutrition-basics",
      excerpt: "The fundamentals of eating to support your training, without the fads.",
      content:
        "Prioritize protein at every meal, build plates around whole foods, and hydrate more than you think you need to. Nutrition doesn't have to be complicated to work — most people see meaningful change just from getting the basics right consistently, long before any advanced strategy matters.",
      coverImageUrl: "/images/blog/nutrition-basics.svg",
      category: "Nutrition",
      authorName: "James Okafor",
    },
    {
      title: "How to Set Fitness Goals",
      slug: "how-to-set-fitness-goals",
      excerpt: "Turn a vague wish to 'get fit' into a goal you can actually train towards.",
      content:
        "Vague goals produce vague effort. Instead of 'get in shape,' pick a specific, measurable target with a timeline — a weight to lift, a distance to run, a number of sessions per week. Then work backward into the weekly actions that get you there. Clear goals make it obvious what to do on your worst days.",
      coverImageUrl: "/images/blog/fitness-goals.svg",
      category: "Habits",
      authorName: "David Johnson",
    },
  ];

  for (const p of postsData) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  // ---------- Testimonials ----------
  const testimonialsData = [
    {
      memberName: "Rachel Kim",
      profileImageUrl: "/images/testimonials/rachel-kim.svg",
      review:
        "Joining this gym completely changed how I approach training. The coaches are supportive and the environment keeps me motivated.",
      membershipType: "PREMIUM",
    },
    {
      memberName: "Tom Whitfield",
      profileImageUrl: "/images/testimonials/tom-whitfield.svg",
      review:
        "I'd tried gyms before and never stuck with it. The structure here and the way the coaches actually know your name made the difference.",
      membershipType: "STANDARD",
    },
    {
      memberName: "Priya Nair",
      profileImageUrl: "/images/testimonials/priya-nair.svg",
      review:
        "The personal training sessions gave me a plan I actually understood. Six months in and I've hit goals I didn't think were realistic.",
      membershipType: "ELITE",
      fitnessGoal: "Strength",
    },
    {
      memberName: "Ben Ortiz",
      profileImageUrl: "/images/testimonials/ben-ortiz.svg",
      review: "Boxing with Maria is the best hour of my week. Great cardio, and I've actually learned real technique.",
      membershipType: "BASIC",
    },
  ];

  for (const t of testimonialsData) {
    const existing = await prisma.testimonial.findFirst({ where: { memberName: t.memberName } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // ---------- Gallery ----------
  const galleryCaptions = ["Free Weights", "Cardio Zone", "Group Class", "Boxing Ring", "Yoga Studio", "Locker Rooms", "Functional Area", "Reception"];
  for (let i = 0; i < galleryCaptions.length; i++) {
    const imageUrl = `/images/gallery/${i + 1}.svg`;
    const existing = await prisma.galleryImage.findFirst({ where: { imageUrl } });
    if (!existing) {
      await prisma.galleryImage.create({ data: { imageUrl, caption: galleryCaptions[i], displayOrder: i } });
    }
  }

  // ---------- Admin account ----------
  // Change these in backend/.env (ADMIN_EMAIL / ADMIN_PASSWORD) BEFORE seeding, or change the password after login.
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@jiggyathletic.club").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", isActive: true },
    create: { email: adminEmail, passwordHash, firstName: "Jiggy", lastName: "Admin", role: "ADMIN" },
  });
  console.log(`Admin account ready: ${adminEmail}`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
