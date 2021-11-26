import mongoose, {Schema} from "mongoose";

export const orderSchema = new mongoose.Schema({
    customerId: Schema.Types.String,
    orderName: Schema.Types.String,
    dateOfOrder: {type:Schema.Types.Date, default: new Date()}
})