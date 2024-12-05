// src/models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    orderDate: Date;
    quantity: number;
}

const OrderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    orderDate: { type: Date, default: Date.now },
    quantity: { type: Number, required: true },
});

OrderSchema.index({ userId: 1 });
OrderSchema.index({ productId: 1 });
OrderSchema.index({ orderDate: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);
