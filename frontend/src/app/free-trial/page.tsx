import FreeTrialForm from "@/components/FreeTrialForm";

export const metadata = { title: "Book a Free Trial" };

export default function FreeTrialPage() {
  return (
    <div className="container-x py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="font-display text-5xl lg:text-6xl text-ivory leading-tight">
            BOOK YOUR FREE SESSION
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed max-w-md">
            One session, no obligation. Come meet the coaches, see the space, and find the activity
            that fits your goals.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ivory/85">
            <li>· No payment required</li>
            <li>· Guided by one of our certified coaches</li>
            <li>· Choose the activity and time that works for you</li>
          </ul>
        </div>
        <FreeTrialForm />
      </div>
    </div>
  );
}
