import mongoose from 'mongoose';

// Check if the model has already been defined, if so, delete it
if (mongoose.models && mongoose.models.Quiz) {
  delete mongoose.models.Quiz;
}

const optionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  inputType: {
    type: String, // 'math' or 'richText'
    default: 'richText',
  },
  // Add field for base64 representation of the cropped image
  croppedImage: {
    type: String,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  paragraph: {
    type: String,
  },
  options: [optionSchema],
  correctOptionIndex: {
    type: Number,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  // Add input type field for questions
  inputType: {
    type: String, // 'math' or 'richText'
    default: 'richText',
  },
  // Add input type field for explanation of answer
  explanationInputType: {
    type: String, // 'math' or 'richText'
    default: 'richText',
  },
  // Add field for base64 representation of the cropped image for the question
  croppedImage: {
    type: String,
  },
  // Add field for base64 representation of the cropped image for the explanation
  explanationCroppedImage: {
    type: String,
  },
});

// New Schema for description section
const descriptionSectionSchema = new mongoose.Schema({
  description: String,
  descriptionType: String,
  // Add any other fields for description section as needed
});

// New schema for title section
const titleSectionSchema = new mongoose.Schema({
  title: String,
  description: [String],
  titleType: String,
  // Add any other fields for title section as needed
  // Add input type field for title
  titleType: {
    type: String, // 'math' or 'richText'
    default: 'richText',
  },
  descriptions: [
    {
      text: {
        type: String,
      },
      // Add input type field for descriptions
      type: {
        type: String, // 'math' or 'richText'
        default: 'richText',
      },
    },
  ],
});

const quizSchema = new mongoose.Schema({
  titleSections: [titleSectionSchema], // Use the new titleSectionSchema
  questions: [questionSchema],
  duration: {
    type: Number,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
