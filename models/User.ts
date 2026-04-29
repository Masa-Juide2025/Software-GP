import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "يرجى إدخال الاسم الكامل"],
    },
    email: {
      type: String,
      required: [true, "يرجى إدخال البريد الإلكتروني"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // إضافة حقل رقم الهاتف هنا لكي يقبله النظام ويخزنه
    phone: {
      type: String,
      required: false, // اجعله true إذا كان إجبارياً
      trim: true,
    },
    password: {
      type: String,
      required: [true, "يرجى إدخال كلمة المرور"],
    },
    role: {
      type: String,
      enum: ["subscriber", "trainer", "nutritionist", "admin"],
      default: "subscriber",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", 
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
    },
    sportClubId: {
      type: Schema.Types.ObjectId,
      ref: "SportsClub",
      default: null,
    },
  },
  { 
    timestamps: true 
  }
);

const User = models.User || mongoose.model("User", UserSchema, "User");

export default User;