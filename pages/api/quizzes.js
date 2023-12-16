import dbConnect from '../../utils/dbConnect';
import Quiz from '../../models/quiz';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
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
