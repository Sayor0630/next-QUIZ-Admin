// pages/quiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/api/admin');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error.message);
      } finally {
        setLoading(false); // Set loading to false whether the request succeeds or fails
      }
    };

    fetchQuizzes();
  }, []);

  const displayBase64Image = (base64String) => {
    return `${base64String}`;
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Questions</h1>
      {loading && (
        <div className="flex items-center justify-center">

          <span className="loading loading-spinner loading-lg"></span>

        </div>
      )}
      {!loading &&
        quizzes.map((quiz, index) => (
        <div key={index} className="mb-8">
          <p><span className='text-xl'>Timer:</span> {quiz.duration} minutes</p>
          <p><span className='text-xl'>Total Marks:</span> {quiz.totalMarks}</p>
          {quiz.titleSections.map((titleSection, tsIndex) => (
            <div key={tsIndex} className="mb-4">
              <h2 className='text-2xl mb-2 font-semibold'>
                <span className='text-yellow-800'>{`Quiz Title Section ${tsIndex + 1}`}: </span>
              </h2>
              <p className="font-medium">
                <span className='text-violet-600'>Title : </span>{titleSection.title} (Input Type: {titleSection.titleType})
              </p>
              {titleSection.descriptions.map((description, dIndex) => (
                <div key={dIndex} className="mb-2">
                  <p className="font-medium">
                    {/* <span className='text-violet-600'>{`Description ${dIndex + 1}: `}</span>{description.text} (Input Type: {description.type}) */}
                    <span className='text-violet-600'>Description:</span>{description.text} (Input Type: {description.type})
                  </p>
                </div>
              ))}
            </div>
          ))}
          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4">
              <p className="font-medium">
                {`Q${qIndex + 1}: ${question.questionText} (Marks: ${question.marks}) (Input Type: ${question.inputType})`}
              </p>
              {question.croppedImage && (
                <div className="mb-4">
                  <img
                    src={displayBase64Image(question.croppedImage)}
                    alt={`Question ${qIndex + 1} Image`}
                    className="max-w-full h-auto"
                    width={600}
                  />
                </div>
              )}
              <ul className="list-disc ml-8">
                {question.options.map((option, oIndex) => (
                  <li key={oIndex} className={oIndex === question.correctOptionIndex ? 'text-green-600' : ''}>
                    {option.croppedImage ? (
                      <div className="mb-4 ml-4">
                        <img
                          src={displayBase64Image(option.croppedImage)}
                          alt={`Option ${oIndex + 1} Image`}
                          className="max-w-full h-auto"
                          width={400}
                        />
                      </div>
                    ) : (
                      `${option.title} (Input Type: ${option.inputType})`
                    )}
                  </li>
                ))}
              </ul>
              <p className="font-medium text-zinc-600">
                <span className='text-violet-600'>Explanation: </span>{question.paragraph} (Input Type: {question.explanationInputType})
                {question.explanationCroppedImage && (
                  <div className="mt-4">
                    <img
                      src={displayBase64Image(question.explanationCroppedImage)}
                      alt={`Explanation Image for Question ${qIndex + 1}`}
                      className="max-w-full h-auto"
                      width={600}
                    />
                  </div>
                )}
              </p>
              <br /><hr className='border-2 border-green-950' />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizPage;
