"use client";

import { verifyOrder } from "@/lib/actions/order.actions";
import { SearchParamProps } from "@/types";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyOrder({ params: { id } }: SearchParamProps) {
  const router = useRouter();

  useEffect(() => {
    const orderVerification = async () => {
      await verifyOrder(id);
      router.push("/profile");
    };

    orderVerification();
  }, [id, router]);

  return (
    <div className="flex-center h-full">
      <LoaderCircle className="text-primary-500" height={24} width={24} />
    </div>
  );
}
