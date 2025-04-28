// models/item.js
import { Schema, model } from 'mongoose';

const itemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing spaces
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price must be a positive number
    },
    category: {
      type: String,
      enum: ['starter', 'main course', 'beverage', 'dessert'],
      required: true,
    },
    image: {
      type: String,
      default: '',
      validate: {
        validator: (v) =>
          v === '' || /^https?:\/\/.+$/i.test(v), // This just checks if the URL starts with http or https
        message: (props) => `${props.value} is not a valid URL`,
      },
    },    
    description: {
      type: String,
      default: '',
      maxlength: 500, // Limit description length
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default model('Item', itemSchema);
