"use client";
import { IEvent } from "@/lib/database/models/event.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import Checkout from "./Checkout";

type Props = {
  event: IEvent;
};

export default function CheckoutButton({ event }: Props) {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventEnded = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {hasEventEnded ? (
        <p className="p-2 text-red-400">Tickets are no longer available.</p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Get Tickets</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
}
