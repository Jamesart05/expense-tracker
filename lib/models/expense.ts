import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    note: {
      type: String,
      trim: true,
      default: ""
    },
    paymentMethod: {
      type: String,
      required: true
    },
    spentAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ userId: 1, spentAt: -1 });

export type ExpenseDocument = InferSchemaType<typeof expenseSchema> & {
  _id: Types.ObjectId;
};

export const Expense: Model<ExpenseDocument> =
  models.Expense || model<ExpenseDocument>("Expense", expenseSchema);
