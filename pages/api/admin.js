import dbConnect from '../../utils/dbConnect';
import Quiz from '../../models/quiz';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Increase the size limit as needed
    },
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { titleSections, questions, duration } = req.body;

      // Calculate total marks for the quiz
      const totalMarks = questions.reduce((total, question) => total + question.marks, 0);

      // Ensure options is an array of objects and add inputType field for options
      const formattedQuestions = questions.map((question) => {
        const formattedOptions = question.options.map((option) => {
          const formattedOption = {
            inputType: option.inputType || 'richText', // Default to 'richText' if not provided
            croppedImage: option.croppedImage, // Add croppedImage field for option
          };

          // Add title field only if croppedImage is not present
          if (!option.croppedImage) {
            formattedOption.title = option.title;
          }

          return formattedOption;
        });

        return {
          ...question,
          options: formattedOptions,
          inputType: question.inputType || 'richText', // Add inputType for questions, default to 'richText'
          explanationInputType: question.explanationInputType || 'richText', // Add inputType for explanation, default to 'richText'
          croppedImage: question.croppedImage, // Add croppedImage field for question
          explanationCroppedImage: question.explanationCroppedImage, // Add explanationCroppedImage field for question
        };
      });

      // Add inputType for title and descriptions
      const formattedTitleSections = titleSections.map((titleSection) => {
        const formattedDescriptions = titleSection.descriptions.map((description) => ({
          text: description.text,
          type: description.type || 'richText', // Default to 'richText' if not provided
        }));
        return {
          ...titleSection,
          titleType: titleSection.titleType || 'richText', // Default to 'richText' if not provided
          descriptions: formattedDescriptions,
        };
      });

      const quiz = new Quiz({ titleSections: formattedTitleSections, questions: formattedQuestions, duration, totalMarks });
      const savedQuiz = await quiz.save();
      res.status(201).json(savedQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to create quiz' });
    }
  } else if (req.method === 'GET') {
    try {
      const quizzes = await Quiz.find({});
      res.status(200).json(quizzes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch quizzes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
