import mongoose, { Schema, Document } from "mongoose";

interface ICategory extends Document {
  categoryName: string;
}

const categorySchema: Schema = new Schema({
  categoryName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
