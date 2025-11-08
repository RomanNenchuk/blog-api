export const mongooseJsonTransform = {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    if (ret._id) {
      ret.id = ret._id.toString();
      delete ret._id;
    }
    if (ret.__v !== undefined) delete ret.__v;
    return ret;
  },
};
