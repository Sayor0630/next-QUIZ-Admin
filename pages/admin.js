import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import 'mathquill/build/mathquill.css';
import 'react-quill/dist/quill.snow.css';
import { AiTwotoneDelete } from 'react-icons/ai';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';
import { PiMathOperationsBold } from 'react-icons/pi';
import { RiInputMethodFill } from 'react-icons/ri';
import { FaSave, FaUndo, FaTrash } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa'; // Import the desired icon
import { FaCropSimple } from "react-icons/fa6";
import Select from 'react-select';

const MathQuillEditor = dynamic(() => import('react-mathquill'), { ssr: false });
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Admin = () => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFab = () => {
    setIsFabOpen((prev) => !prev);
  };

  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Inside your component function, before the return statement
  const [titleSections, setTitleSections] = useState([
    { title: '', titleType: 'richText', descriptions: [] },
  ]);



  // Inside your component function
  const addTitleSection = () => {
    setTitleSections((prevTitleSections) => [
      ...prevTitleSections,
      { title: '', titleType: 'richText' },
    ]);
  };

  const removeTitleSection = (sectionIndex) => {
    const updatedTitleSections = [...titleSections];
    updatedTitleSections.splice(sectionIndex, 1);
    setTitleSections(updatedTitleSections);
  };

  const toggleTitleInputType = (sectionIndex) => {
    const updatedTitleSections = [...titleSections];
    updatedTitleSections[sectionIndex].titleType =
      titleSections[sectionIndex].titleType === 'math' ? 'richText' : 'math';
    setTitleSections(updatedTitleSections);
  };

  // Inside your component function
  const toggleDescInputType = (sectionIndex, descIndex) => {
    const updatedTitleSections = [...titleSections];
    const currentDescType = updatedTitleSections[sectionIndex].descriptions[descIndex].type;
    updatedTitleSections[sectionIndex].descriptions[descIndex].type =
      currentDescType === 'math' ? 'richText' : 'math';
    setTitleSections(updatedTitleSections);
  };


  // Inside your component function
  const addDesc = (sectionIndex) => {
    const updatedTitleSections = [...titleSections];

    if (!updatedTitleSections[sectionIndex].descriptions) {
      updatedTitleSections[sectionIndex].descriptions = [];
    }

    if (updatedTitleSections[sectionIndex].descriptions.length === 0) {
      updatedTitleSections[sectionIndex].descriptions.push({ text: '', type: 'richText' });
      setTitleSections(updatedTitleSections);
    }
  };


  const removeDesc = (sectionIndex, descIndex) => {
    const updatedTitleSections = [...titleSections];
    updatedTitleSections[sectionIndex].descriptions.splice(descIndex, 1);
    setTitleSections(updatedTitleSections);
  };




  const [inputTitleType, setInputTitleType] = useState("richtext");


  // Inside your component function, before the return statement
  const [inputDescriptionType, setInputDescriptionType] = useState('richText');
  // Inside your component function, before the return statement
  const [descriptions, setDescriptions] = useState([]);


  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: [{ title: '' }],
      correctOptionIndex: 0,
      marks: 0,
      paragraph: '',
      imagePreview: null,
      croppedImage: null,
    },
  ]);

  const [inputTypes, setInputTypes] = useState(Array(questions.length).fill("richtext"));
  const [optionsInputTypes, setOptionsInputTypes] = useState(Array(questions.length).fill(Array(1).fill("richtext")));
  const [explanationInputTypes, setExplanationInputTypes] = useState(Array(questions.length).fill("richtext"));
  const [duration, setDuration] = useState(0);
  // Inside your component function
  const toggleDescriptionInputType = () => {
    setInputDescriptionType(inputDescriptionType === 'math' ? 'richText' : 'math');
  };


  useEffect(() => {
    import('mathquill/build/mathquill.css');
    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout();
  }, []);


  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        questionText: '',
        options: [{ title: '' }],
        correctOptionIndex: 0,
        marks: 0,
        paragraph: '',
      },
    ]);

    setInputTypes((prevInputTypes) => [...prevInputTypes, "richtext"]);
    setOptionsInputTypes((prevOptionsInputTypes) => [...prevOptionsInputTypes, ["richtext"]]);
    setExplanationInputTypes((prevExplanationInputTypes) => [...prevExplanationInputTypes, "richtext"]);
  };


  // Inside your component function
  const removeQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);

    const updatedInputTypes = [...inputTypes];
    updatedInputTypes.splice(questionIndex, 1);
    setInputTypes(updatedInputTypes);

    const updatedOptionsInputTypes = [...optionsInputTypes];
    updatedOptionsInputTypes.splice(questionIndex, 1);
    setOptionsInputTypes(updatedOptionsInputTypes);

    const updatedExplanationInputTypes = [...explanationInputTypes];
    updatedExplanationInputTypes.splice(questionIndex, 1);
    setExplanationInputTypes(updatedExplanationInputTypes);
  };


  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ title: '' });
    setQuestions(updatedQuestions);

    const updatedOptionsInputTypes = [...optionsInputTypes];
    updatedOptionsInputTypes[questionIndex].push("richtext"); // Change "math" to "richtext"
    setOptionsInputTypes(updatedOptionsInputTypes);
  };

  const toggleOptionInputType = (questionIndex, optionIndex) => {
    const updatedOptionsInputTypes = [...optionsInputTypes];
    const currentInputType = updatedOptionsInputTypes[questionIndex][optionIndex];

    // Toggle input type (math or text)
    updatedOptionsInputTypes[questionIndex][optionIndex] =
      currentInputType === "math" ? "richText" : "math";

    // Clear image-related properties when switching input types
    const updatedQuestions = [...questions];
    const currentOption = updatedQuestions[questionIndex].options[optionIndex];
    currentOption.imagePreview = null;
    currentOption.croppedImage = null;

    setOptionsInputTypes(updatedOptionsInputTypes);
    setQuestions(updatedQuestions);
  };


  const toggleExplanationInputType = (questionIndex) => {
    const updatedExplanationInputTypes = [...explanationInputTypes];
    updatedExplanationInputTypes[questionIndex] =
      updatedExplanationInputTypes[questionIndex] === "math" ? "richText" : "math";
    setExplanationInputTypes(updatedExplanationInputTypes);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const { correctOptionIndex } = updatedQuestions[questionIndex];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    if (correctOptionIndex >= optionIndex && correctOptionIndex > 0) {
      updatedQuestions[questionIndex].correctOptionIndex -= 1;
    }
    setQuestions(updatedQuestions);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const isValid = questions.every(
        (question) => question.correctOptionIndex >= 0 && question.correctOptionIndex < question.options.length
      );

      if (!isValid) {
        console.error('Invalid correctOptionIndex');
        return;
      }

      const totalMarks = questions.reduce((total, question) => total + question.marks, 0);

      const questionsWithValidMarks = questions.map((question, questionIndex) => ({
        ...question,
        marks: isNaN(question.marks) ? 0 : parseInt(question.marks, 10),
        // Include input type for the question
        inputType: inputTypes[questionIndex],
        options: question.options.map((option, optionIndex) => ({
          ...option,
          // Include input type for the option
          inputType: optionsInputTypes[questionIndex][optionIndex],
        })),
        // Include input type for the explanation
        explanationInputType: explanationInputTypes[questionIndex],
      }));

      const payload = {
        titleSections,
        questions: questions.map((question) => {
          return {
            ...question,
            // Include base64 representation of the cropped image in the payload
            croppedImage: question.croppedImage,
            explanationImage: questions.map(question => question.explanationCroppedImage),
            optionImages: questions.map(question => question.options.map(option => option.croppedImage)),
          };
        }),
        duration,
        totalMarks,
      };

      console.log('Payload to be sent:', payload);

      // Assuming an API endpoint '/api/admin' for saving the quiz
      const response = await axios.post('/api/admin', payload);

      const savedQuiz = response.data;

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      setShowSuccessMessage(true);

      console.log('Quiz saved successfully:', savedQuiz);
    } catch (error) {
      console.error('Error saving quiz:', error.message);
      // Show error message
      setShowErrorMessage(true);
    } finally {
      // Reset loading state
      setIsLoading(false);

      // Automatically hide success and error messages after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 10000);
    }
  };

  const ReactQuillStyles = {
    backgroundColor: '#f8f8f8', // Example background color
    color: '#333', // Example text color
    fontFamily: 'Arial, sans-serif', // Example font family
    // Add more styles as needed
  };

  const inputRefs = useRef([]);

  // Function to handle image upload for a specific question
  const handleImageUpload = (files, questionIndex) => {
    const file = files[0];

    if (file) {
      // Convert the cropped image to base64
      convertImageToBase64(file, (base64Image) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].croppedImage = base64Image;
        updatedQuestions[questionIndex].imagePreview = URL.createObjectURL(file);
        setQuestions(updatedQuestions);
      });
    }
  };

  // Function to handle image cropping for a specific question
  const handleImageCrop = (questionIndex) => {
    if (inputRefs.current[questionIndex] && inputRefs.current[questionIndex].current) {
      const croppedImageData = inputRefs.current[questionIndex].current.cropper.getCroppedCanvas().toDataURL();
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex].croppedImage = croppedImageData;
        updatedQuestions[questionIndex].imagePreview = null;
        return updatedQuestions;
      });
    }
  };

  // Function to handle recropping for a specific question
  const handleRecrop = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].imagePreview = updatedQuestions[questionIndex].croppedImage;
      return updatedQuestions;
    });
  };

  const [inputKeys, setInputKeys] = useState({});

  // Function to handle image deletion for a specific question
  const handleDeleteImage = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].imagePreview = null;
      updatedQuestions[questionIndex].croppedImage = null;

      // Reset the input key for the specific question
      setInputKeys((prevKeys) => ({
        ...prevKeys,
        [questionIndex]: Math.random().toString(36).substring(7),
      }));

      return updatedQuestions;
    });
  };

  const generateUniqueKey = () => {
    return Math.random().toString(36).substring(7);
  };

  const convertImageToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result.split(',')[1];
      callback(base64Image);
    };

    reader.onerror = (error) => {
      console.error('Error converting image to base64:', error);
    };
  };

  const explanationInputRefs = useRef([]);

  // Function to handle image upload for a specific explanation
  const handleExplanationImageUpload = (files, questionIndex) => {
    const file = files[0];

    if (file) {
      // Convert the cropped image to base64
      convertImageToBase64(file, (base64Image) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].explanationCroppedImage = base64Image;
        updatedQuestions[questionIndex].explanationImagePreview = URL.createObjectURL(file);
        setQuestions(updatedQuestions);
      });
    }
  };

  // Function to handle image cropping for a specific explanation
  const handleExplanationImageCrop = (questionIndex) => {
    if (explanationInputRefs.current[questionIndex] && explanationInputRefs.current[questionIndex].current) {
      const croppedImageData = explanationInputRefs.current[questionIndex].current.cropper.getCroppedCanvas().toDataURL();
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex].explanationCroppedImage = croppedImageData;
        updatedQuestions[questionIndex].explanationImagePreview = null;
        return updatedQuestions;
      });
    }
  };

  // Function to handle recropping for a specific explanation
  const handleExplanationRecrop = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].explanationImagePreview = updatedQuestions[questionIndex].explanationCroppedImage;
      return updatedQuestions;
    });
  };

  const [explanationInputKeys, setExplanationInputKeys] = useState({});

  // Function to handle image deletion for a specific explanation
  const handleExplanationDeleteImage = (questionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].explanationImagePreview = null;
      updatedQuestions[questionIndex].explanationCroppedImage = null;

      // Reset the input key for the specific explanation
      setExplanationInputKeys((prevKeys) => ({
        ...prevKeys,
        [questionIndex]: generateUniqueKey(),
      }));

      return updatedQuestions;
    });
  };

  const optionInputRefs = useRef([]);
  const [optionInputKeys, setOptionInputKeys] = useState({});

  // Function to handle image upload for a specific option
  const handleOptionImageUpload = (files, questionIndex, optionIndex) => {
    const file = files[0];

    if (file) {
      // Convert the cropped image to base64
      convertImageToBase64(file, (base64Image) => {
        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[questionIndex].options[optionIndex].croppedImage = base64Image;
          updatedQuestions[questionIndex].options[optionIndex].imagePreview = URL.createObjectURL(file);
          return updatedQuestions;
        });
      });
    }
  };

  // Function to handle image cropping for a specific option
  const handleOptionImageCrop = (questionIndex, optionIndex) => {
    if (
      optionInputRefs.current[questionIndex] &&
      optionInputRefs.current[questionIndex][optionIndex] &&
      optionInputRefs.current[questionIndex][optionIndex].current
    ) {
      const croppedImageData = optionInputRefs.current[questionIndex][optionIndex].current.cropper.getCroppedCanvas().toDataURL();
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[questionIndex].options[optionIndex].croppedImage = croppedImageData;
        updatedQuestions[questionIndex].options[optionIndex].imagePreview = null;
        return updatedQuestions;
      });
    }
  };

  // Function to handle recropping for a specific option
  const handleOptionRecrop = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex].imagePreview =
        updatedQuestions[questionIndex].options[optionIndex].croppedImage;
      return updatedQuestions;
    });
  };

  // Function to handle image deletion for a specific option
  const handleOptionDeleteImage = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].options[optionIndex].imagePreview = null;
      updatedQuestions[questionIndex].options[optionIndex].croppedImage = null;

      // Reset the input key for the specific option
      setOptionInputKeys((prevKeys) => ({
        ...prevKeys,
        [`${questionIndex}-${optionIndex}`]: Math.random().toString(36).substring(7),
      }));

      return updatedQuestions;
    });
  };

  const [explanationImages, setExplanationImages] = useState([]);
  const [optionImages, setOptionImages] = useState([]);



  // Function to determine the content to be displayed in the select menu option
  const getOptionContent = (option, index) => {
    return {
      value: `${index}_${option.title}`, // Use a combination of index and title as a unique identifier
      label: (
        <div className="custom-select-option">
          {option.croppedImage && (
            <img
              src={option.croppedImage}
              alt={`Cropped for Option`}
              className="rounded-lg border"
              style={{ maxWidth: '100%', height: 'auto', marginRight: '8px' }}
            />
          )}
          {option.title}
        </div>
      ),
    };
  };


  return (
    <>
      <Head>
        <title>Admin :: QUIZ MAKING SYSTEM</title>
      </Head>

      <div className="container mx-auto p-4 flex flex-col items-center animate-fadeIn">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <div className='mb-4'>
          <div className="border border-[#dadce0] mt-4 bg-[#ffffff] p-8 md:p-8 rounded-3xl w-[95dvw] md:w-[80dvw] lg:w-[768px]">
            <label className="block mb-4">
              <div className='flex flex-col md:flex-row lg:flex-row items-center'>
                <p className='mb-3 md:mb-0 md:mr-2 font-black text-xl'>Quiz Duration (minutes):</p>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="border border-[#808080] p-2 w-full rounded-md mt-3 md:mt-0 lg:mt-0 bg-[#f1f3f4]"
                />
              </div>
            </label>

            {(duration === 0 || duration === null || isNaN(duration)) && (
              <p className="text-red-600 font-bold mb-2">
                Warning: Quiz duration must be a valid number greater than 0.
              </p>
            )}
          </div>

          {titleSections.map((titleSection, sectionIndex) => (
            <div key={sectionIndex} className="border border-[#dadce0] mt-4 bg-[#ffffff] p-8 md:p-8 rounded-3xl w-[95dvw] md:w-[80dvw] lg:w-[768px]">
              <label className="mb-2 flex flex-col">
                <p className='pb-3 font-black text-xl'>Title Section {sectionIndex + 1}:</p>
                <div className="flex flex-col md:flex-row lg:flex-row">
                  <div className='w-full'>
                    {titleSection.titleType === 'math' ? (
                      // Use MathQuillEditor for title
                      <MathQuillEditor
                        latex={titleSection.title}
                        onChange={(mathField) => {
                          const updatedTitleSections = [...titleSections];
                          updatedTitleSections[sectionIndex].title = mathField.latex();
                          setTitleSections(updatedTitleSections);
                        }}
                        className="border p-2 w-full min-h-12 rounded-md bg-[#f1f3f4]"
                      />
                    ) : (
                      // Use ReactQuill for title
                      <ReactQuill
                        value={titleSection.title}
                        onChange={(value) => {
                          const updatedTitleSections = [...titleSections];
                          updatedTitleSections[sectionIndex].title = value;
                          setTitleSections(updatedTitleSections);
                        }}
                        style={ReactQuillStyles} // Apply custom styles
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link'],
                            ['clean'],
                          ],
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'bullet',
                          'link',
                        ]}
                        className="mb-2 w-full bg-[#f1f3f4] rounded-b-xl"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTitleInputType(sectionIndex)}
                    className="ml-0 md:ml-4 lg:ml-4 mt-2 md:mt-0 lg:mt-0 btn btn-active btn-neutral"
                  >
                    {titleSection.titleType === 'math' ? (
                      <RiInputMethodFill className="text-3xl" />
                    ) : (
                      <PiMathOperationsBold className="text-3xl" />
                    )}
                  </button>
                </div>
              </label>
              {titleSection.descriptions && titleSection.descriptions.map((desc, descIndex) => (
                <div key={descIndex} className="mb-2 flex flex-col">
                  <p className="my-2 font-semibold text-lg">Description:</p>
                  <div className="flex flex-col md:flex-row lg:flex-row items-center">
                    {desc.type === 'math' ? (
                      // Use MathQuillEditor for description
                      <MathQuillEditor
                        latex={desc.text}
                        onChange={(mathField) => {
                          const updatedTitleSections = [...titleSections];
                          updatedTitleSections[sectionIndex].descriptions[descIndex].text = mathField.latex();
                          setTitleSections(updatedTitleSections);
                        }}
                        className="border p-2 w-full min-h-12 rounded-md bg-[#f1f3f4]"
                      />
                    ) : (
                      // Use ReactQuill for description
                      <ReactQuill
                        value={desc.text}
                        onChange={(value) => {
                          const updatedTitleSections = [...titleSections];
                          updatedTitleSections[sectionIndex].descriptions[descIndex].text = value;
                          setTitleSections(updatedTitleSections);
                        }}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link'],
                            ['clean'],
                          ],
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'bullet',
                          'link',
                        ]}
                        className="mb-2 w-full bg-[#f1f3f4] rounded-b-xl"
                      />
                    )}
                    <div className='flex flex-row items-center'>
                      <button
                        type="button"
                        onClick={() => toggleDescInputType(sectionIndex, descIndex)}
                        className="ml-0 md:ml-4 lg:ml-4 mt-0 md:mt-0 lg:mt-0 btn btn-active btn-neutral"
                      >
                        {desc.type === 'math' ? (
                          <RiInputMethodFill className="text-3xl" />
                        ) : (
                          <PiMathOperationsBold className="text-3xl" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDesc(sectionIndex, descIndex)}
                        className="ml-4 btn btn-active btn-error"
                      >
                        <AiTwotoneDelete className="text-3xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!titleSection.descriptions || titleSection.descriptions.length === 0 ? (
                <button
                  type="button"
                  onClick={() => addDesc(sectionIndex)}
                  className="btn btn-active btn-neutral w-full"
                >
                  <IoIosAddCircleOutline className="text-3xl" /> Add Description
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => removeTitleSection(sectionIndex)}
                className="mt-6 btn btn-active btn-error"
              >
                <p>Remove This Title</p>
                <AiTwotoneDelete className="text-3xl" />
              </button>
            </div>
          ))}
        </div>


        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="border border-[#dadce0] mb-4 bg-[#ffffff] p-8 md:p-8 rounded-3xl w-[95dvw] md:w-[80dvw] lg:w-[768px]">
            <label className="mb-2 flex flex-col">
              <div className='flex flex-col'>
                <p className='pb-3 font-black text-xl'>Question {questionIndex + 1}:</p>
                <div className='flex flex-col md:flex-row lg:flex-row items-center'>
                  <div className='w-full'>
                    {inputTypes[questionIndex] === "math" ? (

                      // Use MathQuillEditor for questionText
                      <MathQuillEditor
                        latex={question.questionText}
                        onChange={(mathField) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].questionText = mathField.latex();
                          setQuestions(updatedQuestions);
                        }}
                        className="border p-2 w-full min-h-12 rounded-md bg-[#f1f3f4]"
                      />
                    ) : (
                      // Use ReactQuill for questionText
                      <ReactQuill
                        value={question.questionText}
                        onChange={(value) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].questionText = value;
                          setQuestions(updatedQuestions);
                        }}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link'],
                            ['clean'],
                          ],
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'bullet',
                          'link',
                        ]}
                        className="mb-2 w-full bg-[#f1f3f4] rounded-b-xl"
                      />
                    )}
                  </div>

                  <div className='flex flex-row'>
                    {/* Toggle button for each question */}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedInputTypes = [...inputTypes];
                        updatedInputTypes[questionIndex] =
                          inputTypes[questionIndex] === "math" ? "richText" : "math";
                        setInputTypes(updatedInputTypes);
                      }}
                      className="ml-0 md:ml-4 lg:ml-4 btn btn-active btn-neutral"
                    >
                      {inputTypes[questionIndex] === "math" ? (
                        <RiInputMethodFill className='text-3xl' />
                      ) : (
                        <PiMathOperationsBold className='text-3xl' />
                      )}
                    </button>
                    <label className="btn btn-active btn-primary ml-2">
                      <FaImage className="text-3xl" />
                      <input
                        ref={(ref) => (inputRefs.current[questionIndex] = ref)}
                        key={inputKeys[questionIndex] || `input-${questionIndex}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e.target.files, questionIndex)}
                      />

                    </label>
                  </div>
                </div>
              </div>
              <div key={questionIndex} className="">
                {question.imagePreview && (
                  <div className="mt-2">
                    {/* Cropper for image cropping */}
                    <Cropper
                      ref={inputRefs.current[questionIndex]}
                      src={question.imagePreview}
                      style={{ height: 300, width: '100%' }}
                    // Add any cropper options as needed
                    />

                    {/* Buttons for cropping, recropping, and deleting */}
                    <div className="flex mt-2">
                      <button
                        onClick={() => handleImageCrop(questionIndex)}
                        className="btn btn-active btn-primary mr-2"
                      >
                        Crop & Save Image
                      </button>
                      {question.croppedImage && (
                        <>
                          {!question.imagePreview && (
                            <button
                              onClick={() => handleRecrop(questionIndex)}
                              className="btn btn-active btn-secondary mr-2"
                            >
                              <FaCropSimple className='text-3xl' />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteImage(questionIndex)}
                            className="btn btn-active btn-error"
                          >
                            <AiTwotoneDelete className="text-3xl" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview of cropped image with delete button */}
                {question.croppedImage && !question.imagePreview && (
                  <div className="mt-2">
                    <img
                      src={question.croppedImage}
                      alt={`Cropped for Question ${questionIndex + 1}`}
                      className="rounded-lg border"
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
                    <div className="flex mt-2">
                      <button
                        onClick={() => handleRecrop(questionIndex)}
                        className="btn btn-active btn-secondary mr-2"
                      >
                        <FaCropSimple className='text-3xl' />
                      </button>
                      <button
                        onClick={() => handleDeleteImage(questionIndex)}
                        className="btn btn-active btn-error"
                      >
                        <AiTwotoneDelete className="text-3xl" />
                      </button>
                    </div>
                  </div>
                )}


                {/* ... (other question inputs) */}
              </div>
            </label>

            <div className="mb-2 flex flex-col">
              <p className='my-2 font-semibold text-lg'>Options:</p>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex flex-col md:flex-row lg:flex-row items-center">
                  {!option.imagePreview && !option.croppedImage ? (
                    // If there is no imagePreview, render the MathQuill or ReactQuill input
                    <>
                      {/* MathQuill input for option title */}
                      {optionsInputTypes[questionIndex][optionIndex] === "math" ? (
                        <MathQuillEditor
                          latex={option.title}
                          onChange={(mathField) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[optionIndex].title = mathField.latex();
                            setQuestions(updatedQuestions);
                          }}
                          className="border p-2 w-full min-h-12 rounded-md my-1 bg-[#f1f3f4]"
                        />
                      ) : (
                        <ReactQuill
                          value={option.title}
                          onChange={(value) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[questionIndex].options[optionIndex].title = value;
                            setQuestions(updatedQuestions);
                          }}
                          modules={{
                            toolbar: [
                              ['bold', 'italic', 'underline', 'strike'],
                              ['link'],
                              ['clean'],
                            ],
                          }}
                          formats={[
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            'link',
                          ]}
                          className="mb-2 w-full bg-[#f1f3f4] rounded-b-xl"
                        />
                      )}
                    </>
                  ) : null}

                  {/* Option image preview and cropping */}
                  {option.imagePreview && (
                    <div className="mt-2">
                      {/* Cropper for image cropping */}
                      <Cropper
                        ref={optionInputRefs.current[questionIndex][optionIndex]}
                        src={option.imagePreview}
                        style={{ height: 300, width: '100%' }}
                      // Add any cropper options as needed
                      />

                      {/* Buttons for cropping, recropping, and deleting */}
                      <div className="flex mt-2">
                        <button
                          onClick={() => handleOptionImageCrop(questionIndex, optionIndex)}
                          className="btn btn-active btn-primary mr-2"
                        >
                          Crop & Save Image
                        </button>
                        {option.croppedImage && (
                          <>
                            {!option.imagePreview && (
                              <button
                                onClick={() => handleOptionRecrop(questionIndex, optionIndex)}
                                className="btn btn-active btn-secondary mr-2"
                              >
                                <FaCropSimple className='text-3xl' />
                              </button>
                            )}
                            <button
                              onClick={() => handleOptionDeleteImage(questionIndex, optionIndex)}
                              className="btn btn-active btn-error"
                            >
                              <AiTwotoneDelete className="text-3xl" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Preview of cropped image with delete button */}
                  {option.croppedImage && !option.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={option.croppedImage}
                        alt={`Cropped for Option ${optionIndex + 1}`}
                        className="rounded-lg border"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      <div className="flex my-2">
                        {!option.imagePreview && (
                          <button
                            onClick={() => handleOptionRecrop(questionIndex, optionIndex)}
                            className="btn btn-active btn-secondary mr-2"
                          >
                            <FaCropSimple className='text-3xl' />
                          </button>
                        )}
                        <button
                          onClick={() => handleOptionDeleteImage(questionIndex, optionIndex)}
                          className="btn btn-active btn-error"
                        >
                          <AiTwotoneDelete className="text-3xl" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Toggle button for each option */}
                  <div className='flex flex-row mb-1'>
                    <button
                      type="button"
                      onClick={() => {
                        toggleOptionInputType(questionIndex, optionIndex);
                        handleOptionDeleteImage(questionIndex, optionIndex);
                      }}
                      className="ml-4 btn btn-active btn-neutral"
                    >
                      {optionsInputTypes[questionIndex][optionIndex] === "math" ? (
                        <RiInputMethodFill className='text-3xl' />
                      ) : (
                        <PiMathOperationsBold className='text-3xl' />
                      )}
                    </button>

                    <label className="btn btn-active btn-primary ml-2">
                      <FaImage className="text-3xl" />
                      <input
                        ref={(ref) => (optionInputRefs.current[questionIndex] = optionInputRefs.current[questionIndex] || [])[optionIndex] = ref}
                        key={optionInputKeys[`${questionIndex}-${optionIndex}`] || `option-input-${questionIndex}-${optionIndex}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleOptionImageUpload(e.target.files, questionIndex, optionIndex)}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      className="ml-2 btn btn-active btn-error"
                    >
                      <AiTwotoneDelete className="text-3xl" />
                    </button>
                  </div>

                </div>
              ))}
              <button type="button" onClick={() => addOption(questionIndex)}
                className="mt-1 mb-4 btn btn-active btn-neutral">
                <IoIosAddCircleOutline className="text-3xl" /> Add Option
              </button>
            </div>


            <label className="block mb-2">
              <div className='flex flex-col'>
                <p className='font-semibold text-lg'>Correct Option:</p>
                <Select
                  options={questions[questionIndex].options.map((option, index) => getOptionContent(option, index))}
                  value={getOptionContent(
                    questions[questionIndex].options[questions[questionIndex].correctOptionIndex],
                    questions[questionIndex].correctOptionIndex
                  )}
                  onChange={(selectedOption) => {
                    const selectedValue = selectedOption ? selectedOption.value : null;
                    const [selectedIndex] = selectedValue.split('_').map(Number);
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].correctOptionIndex = selectedIndex;
                    setQuestions(updatedQuestions);
                  }}
                />
              </div>
            </label>


            <label className="block mb-2">
              <div className='flex flex-col'>
                <p className='mt-5 font-semibold text-lg'>Explanation of this answer:</p>
                <div className='flex flex-col md:flex-row lg:flex-row items-center'>
                  {explanationInputTypes[questionIndex] === "math" ? (
                    // Use MathQuillEditor for explanation
                    <MathQuillEditor
                      latex={question.paragraph}
                      onChange={(mathField) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].paragraph = mathField.latex();
                        setQuestions(updatedQuestions);
                      }}
                      className="border border-[#808080] p-2 w-full h-12 rounded-md my-3 bg-[#f1f3f4]"
                    />
                  ) : (

                    // Use ReactQuill for explanation
                    <ReactQuill
                      value={question.paragraph}
                      onChange={(value) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[questionIndex].paragraph = value;
                        setQuestions(updatedQuestions);
                      }}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['link'],
                          ['clean'],
                        ],
                      }}
                      formats={[
                        'header',
                        'bold',
                        'italic',
                        'underline',
                        'strike',
                        'list',
                        'bullet',
                        'link',
                      ]}
                      className="w-full rounded-md my-3 bg-[#f1f3f4]"
                    />

                  )}

                  <div className='flex flex-row ml-0 md:ml-4 lg:ml-4 mt-0'>
                    {/* Toggle button for explanation */}
                    <button
                      type="button"
                      onClick={() => toggleExplanationInputType(questionIndex)}
                      className="btn btn-active btn-neutral"
                    >
                      {explanationInputTypes[questionIndex] === "math" ? (
                        <RiInputMethodFill className='text-3xl' />
                      ) : (
                        <PiMathOperationsBold className='text-3xl' />
                      )}
                    </button>
                    <label className="btn btn-active btn-primary ml-2">
                      <FaImage className="text-3xl" />
                      <input
                        ref={(ref) => (explanationInputRefs.current[questionIndex] = ref)}
                        key={explanationInputKeys[questionIndex] || `explanation-input-${questionIndex}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleExplanationImageUpload(e.target.files, questionIndex)}
                      />
                    </label>
                  </div>
                </div>
                <div key={questionIndex} className="">
                  {question.explanationImagePreview && (
                    <div className="mt-2">
                      {/* Cropper for image cropping */}
                      <Cropper
                        ref={explanationInputRefs.current[questionIndex]}
                        src={question.explanationImagePreview}
                        style={{ height: 300, width: '100%' }}
                      // Add any cropper options as needed
                      />

                      {/* Buttons for cropping, recropping, and deleting */}
                      <div className="flex mt-2">
                        <button
                          onClick={() => handleExplanationImageCrop(questionIndex)}
                          className="btn btn-active btn-primary mr-2"
                        >
                          Crop & Save Image
                        </button>
                        {question.explanationCroppedImage && (
                          <>
                            {!question.explanationImagePreview && (
                              <button
                                onClick={() => handleExplanationRecrop(questionIndex)}
                                className="btn btn-active btn-secondary mr-2"
                              >
                                <FaCropSimple className='text-3xl' />
                              </button>
                            )}
                            <button
                              onClick={() => handleExplanationDeleteImage(questionIndex)}
                              className="btn btn-active btn-error"
                            >
                              <AiTwotoneDelete className="text-3xl" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Preview of cropped image with delete button */}
                  {question.explanationCroppedImage && !question.explanationImagePreview && (
                    <div className="mt-2">
                      <img
                        src={question.explanationCroppedImage}
                        alt={`Cropped for Explanation ${questionIndex + 1}`}
                        className="rounded-lg border"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      <div className="flex mt-2">
                        {!question.explanationImagePreview && (
                          <button
                            onClick={() => handleExplanationRecrop(questionIndex)}
                            className="btn btn-active btn-secondary mr-2"
                          >
                            <FaCropSimple className='text-3xl' />
                          </button>
                        )}
                        <button
                          onClick={() => handleExplanationDeleteImage(questionIndex)}
                          className="btn btn-active btn-error"
                        >
                          <AiTwotoneDelete className="text-3xl" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </label>

            <label className="block mb-2">
              <div>
                <p className='font-semibold text-lg'>Marks:</p>
                <input
                  type="number"
                  value={question.marks}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[questionIndex].marks = parseInt(e.target.value, 10);
                    setQuestions(updatedQuestions);
                  }}
                  className="border border-[#808080] p-2 w-[50%]  rounded-md mt-3 bg-[#f1f3f4]"
                />
              </div>

              {/* Warning for individual question marks */}
              {(question.marks === 0 || question.marks === null || isNaN(question.marks)) && (
                <p className="text-red-600 font-bold mt-2">
                  Warning: Marks must be a valid number greater than 0 for question {questionIndex + 1}.
                </p>
              )}
            </label>
            {/* Add the delete button for each question */}
            <button
              type="button"
              onClick={() => removeQuestion(questionIndex)}
              className="mt-6 btn btn-active btn-error"
            >
              Delete Question
              <AiTwotoneDelete className="text-3xl" />
            </button>
          </div>
        ))}
        <div className='flex flex-col'>
          {(titleSections.length < 1 || questions.length < 1 || duration === 0 || duration === null || isNaN(duration) ||
            questions.some((question) => question.marks === 0 || question.marks === null || isNaN(question.marks))) && (
              <p className="text-neutral font-bold border border-[#dadce0] mb-4 bg-[#d2384a] px-8 py-2 rounded-3xl w-[95dvw] md:w-[80dvw] lg:w-[768px]">
                Warning: You must create at least one title, one question, and provide valid values for quiz duration and marks.
              </p>
            )}
          {/* <button
          onClick={handleSave}
          className={`btn btn-active btn-neutral ${titleSections.length < 1 || questions.length < 1 || duration === 0 || duration === null || isNaN(duration) ||
              questions.some((question) => question.marks === 0 || question.marks === null || isNaN(question.marks)) ? 'disabled' : ''
            }`}
          disabled={
            titleSections.length < 1 || questions.length < 1 || duration === 0 || duration === null || isNaN(duration) ||
            questions.some((question) => question.marks === 0 || question.marks === null || isNaN(question.marks))
          }
        >
          <FaSave className="text-3xl" /> Save Quiz
        </button> */}

        </div>
        <button
          onClick={handleSave}
          className={`btn btn-active btn-neutral ${isLoading || titleSections.length < 1 || questions.length < 1 || duration === 0 || duration === null || isNaN(duration) ||
            questions.some((question) => question.marks === 0 || question.marks === null || isNaN(question.marks)) ? 'disabled' : ''
            }`}
          disabled={
            isLoading || titleSections.length < 1 || questions.length < 1 || duration === 0 || duration === null || isNaN(duration) ||
            questions.some((question) => question.marks === 0 || question.marks === null || isNaN(question.marks))
          }
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <FaSave className="text-3xl mr-2" />
          )}
          Save Quiz
        </button>


        {/* Floating action button (FAB) */}
        <div className="fixed bottom-4 right-4 flex flex-col items-end">
          <button
            onClick={toggleFab}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`btn btn-active btn-accent text-3xl animate-fadeIn transition-transform duration-300 transform-gpu ${isFabOpen || isHovered ? '' : 'animate-bounce'
              }`}
          >
            {isFabOpen ? <IoIosCloseCircleOutline /> : <IoIosAddCircleOutline />}
          </button>

          {/* Expanded options when FAB is open */}
          {isFabOpen && (
            <div className="absolute bottom-14 right-24 flex flex-col space-y-2 animate-fadeInRight">
              <button
                onClick={addTitleSection}
                className="btn btn-active btn-primary w-[200%] animate-none"
              >
                <IoIosAddCircleOutline className="text-2xl" /> Add Title Section
              </button>
              <button
                onClick={addQuestion}
                className="btn btn-active btn-primary w-[200%] animate-none"
              >
                <IoIosAddCircleOutline className="text-2xl" /> Add Question
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Success message */}
      {showSuccessMessage && (
        <div className="bg-green-500 text-white p-4 fixed top-4 right-4 rounded-md shadow-md">
          Quiz saved successfully!
        </div>
      )}
      {/* Error message */}
      {showErrorMessage && (
        <div className="bg-red-500 text-white p-4 fixed top-4 right-4 rounded-md shadow-md">
          Quiz failed to save. Please try again.
        </div>
      )}
    </>
  );
};

export default Admin;