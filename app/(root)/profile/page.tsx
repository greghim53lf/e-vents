import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

export default async function Profile() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organizedEvents = await getEventsByUser({
    userId,
    page: 1,
  });

  return (
    <>
      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex items-center justify-center md:justify-between">
          <h3 className="h3-bold text-center md:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">More Events</Link>
          </Button>
        </div>
      </section>

      {/* <section className="wrapper my-8">
        <Collection
          data={events?.data}
          emptyTitle="No event ticket purchased"
          emptyStateSubtext="Keep exploring events"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          totalPages={2}
          urlParamName="ordersPage"
        />
      </section> */}

      <section className="bg-primary-50 py-5 md:py-10">
        <div className="wrapper flex items-center justify-center md:justify-between">
          <h3 className="h3-bold text-center md:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No event created"
          emptyStateSubtext="Create a new events"
          collectionType="Events_Organized"
          limit={6}
          page={1}
          totalPages={2}
          urlParamName="eventsPage"
        />
      </section>
    </>
  );
}
