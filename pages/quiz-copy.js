// pages/quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/api/admin');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error.message);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>
      {quizzes.map((quiz, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2"><span className='text-yellow-800'>Quiz Title: </span>{quiz.title}</h2>

          <p><span className='text-xl'>Timer:</span> {quiz.duration} minutes</p>
          <p><span className='text-xl'>Total Marks:</span> {quiz.totalMarks}</p>
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4">
              <p className="font-medium">{`Q${qIndex + 1}: ${question.questionText} (Marks: ${question.marks})`}</p>
              <ul className="list-disc ml-8">
                {question.options.map((option, oIndex) => (
                  <li key={oIndex} className={oIndex === question.correctOptionIndex ? 'text-green-600' : ''}>
                    {option.inputType === 'richText' ? (
                      <div dangerouslySetInnerHTML={{ __html: option.title }} />
                    ) : (
                      option.title
                    )}
                  </li>
                ))}
              </ul>
              <p className="font-medium text-zinc-600"> <span className='text-violet-600'>Explaination: </span>{question.paragraph}</p>
              <br /><hr className='border-2 border-green-950' />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizPage;
