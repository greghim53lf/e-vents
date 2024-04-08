import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs";

export default function CreateEvent() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <h3 className="wrapper h3-bold text-left md:text-center">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
}
