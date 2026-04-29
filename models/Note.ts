import mongoose, { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscriber", // أو "Subscriber" حسب ربطك
      required: true,
    },
    nutritionistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "nutritionist",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    collection: 'notes' // اسم الكوليكشن في قاعدة البيانات (الملاحظات)
  }
);

const Note = models.Note || model("Note", NoteSchema);
export default Note;