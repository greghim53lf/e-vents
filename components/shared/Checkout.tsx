import { checkoutOrder } from "@/lib/actions/order.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Button } from "../ui/button";

type Props = {
  event: IEvent;
  userId: string;
};

export default function Checkout({ event, userId }: Props) {
  const router = useRouter();

  const onCheckout = async (e: FormEvent) => {
    e.preventDefault();

    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };
    const paystackPaymentURL = await checkoutOrder(order);
    paystackPaymentURL && router.push(paystackPaymentURL);
  };

  return (
    <form onSubmit={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button md:w-fit">
        {event.isFree ? "Get Ticket" : "Buy Ticket"}
      </Button>
    </form>
  );
}
