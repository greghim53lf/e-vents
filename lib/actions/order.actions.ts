"use server";

import {
  CheckoutOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { Paystack } from "paystack-sdk";
import { dbConnection } from "../database";
import Order from "../database/models/order.model";
import User from "../database/models/user.model";
import { handleError } from "../utils";
import { ObjectId } from "mongodb";
import Event from "../database/models/event.model";

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const amount = order.isFree ? 0 : Number(order.price) * 100;

  try {
    await dbConnection();

    const user = await User.findById(order.buyerId);
    if (!user) throw new Error("User not recognized");

    const orderObject = {
      event: order.eventId,
      buyer: order.buyerId,
      totalAmount: order.price,
      createdAt: new Date(),
    };

    const newOrder = await Order.create(orderObject);

    const transaction = await paystack.transaction.initialize({
      email: user.email,
      amount: amount.toString(),
      callback_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/verify/${newOrder._id}`,
    });

    if (!transaction) {
      await Order.findByIdAndDelete(newOrder._id);
      throw new Error("Unable to initialize paystack transaction");
    }

    await Order.findByIdAndUpdate(newOrder._id, {
      paystackRef: transaction.data?.reference,
    });

    return transaction.data?.authorization_url!;
  } catch (error) {
    handleError(error);
  }
};

export const verifyOrder = async (orderId: string) => {
  try {
    await dbConnection();

    const orderToVerify = await Order.findById(orderId);
    if (!orderToVerify) throw new Error("Order not found");

    const transactionVerification = await paystack.transaction.verify(
      orderToVerify.paystackRef
    );

    if (transactionVerification.data?.status === "success") {
      await Order.findByIdAndUpdate(orderToVerify._id, { paid: true });
    }

    return;
  } catch (error) {
    handleError(error);
  }
};

export const getOrdersByEvent = async ({
  eventId,
  searchString,
}: GetOrdersByEventParams) => {
  try {
    await dbConnection();

    if (!eventId) throw new Error("Event ID is required");

    const eventObjectId = new ObjectId(eventId);
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      { $unwind: "$buyer" },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          eventId: "$event._id",
          eventTitle: "$event.title",
          buyer: {
            $concat: ["$buyer.firstName", " ", "$buyer.lastName"],
          },
        },
      },
      {
        $match: {
          $and: [
            { event: eventObjectId },
            { buyer: { $regex: RegExp(searchString, "i") } },
          ],
        },
      },
    ]);

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    handleError(error);
  }
};

export const getOrdersByUser = async ({
  userId,
  limit = 3,
  page,
}: GetOrdersByUserParams) => {
  try {
    await dbConnection();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    const orders = await Order.distinct("event._id")
      .find(conditions)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "event",
        model: Event,
        populate: {
          path: "organizer",
          model: User,
          select: "_id firstName lastName",
        },
      });

    const ordersCount = await Order.distinct("event._id").countDocuments(
      conditions
    );

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(ordersCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
};
