import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revokedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, expires: "30d" },
  },
  { timestamps: true }
);

refreshTokenSchema
  .virtual("isRevoked")
  .get(() => this.revokedAt && this.revokedAt < new Date());

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
