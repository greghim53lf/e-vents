import { Document, model } from "mongoose";
import { Schema, models } from "mongoose";

export interface IOrder extends Document {
  totalAmount: string;
  event: {
    _id: string;
    title: string;
  };
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  paid: boolean;
  paystackRef: string;
  createdAt: Date;
}

const OrderSchema = new Schema({
  totalAmount: {
    type: String,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  paid: {
    type: Boolean,
    default: false,
  },
  paystackRef: {
    type: String,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
