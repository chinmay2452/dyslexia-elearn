
import React, { useState } from 'react';
import { Button } from "../components/button";
import { RadioGroup, RadioGroupItem } from "../components/radio-group";
import { useToast } from "../hooks/use-toast";
import { AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import TestResults from '../components/TestResults';

const questions = [
  {
    id: 'q1',
    question: 'Do you find it hard to read words that are similar but in a different order (like "was" and "saw")?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  },
  {
    id: 'q2',
    question: 'Do letters sometimes appear to move or jump around when you read?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  },
  {
    id: 'q3',
    question: 'Do you find it difficult to remember the correct spelling of common words?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  },
  {
    id: 'q4',
    question: 'Is it hard for you to read out loud in class or in front of others?',
    options: [
      { value: '0', label: 'No, not at all' },
      { value: '1', label: 'A little bit' },
      { value: '2', label: 'Yes, quite difficult' },
      { value: '3', label: 'Yes, extremely difficult' }
    ]
  },
  {
    id: 'q5',
    question: 'Do you mix up the order of numbers or dates (like 57 instead of 75)?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  },
  {
    id: 'q6',
    question: 'Do you have trouble remembering instructions or directions?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  },
  {
    id: 'q7',
    question: 'Do you find it hard to take notes during class?',
    options: [
      { value: '0', label: 'No, not at all' },
      { value: '1', label: 'A little bit' },
      { value: '2', label: 'Yes, quite difficult' },
      { value: '3', label: 'Yes, extremely difficult' }
    ]
  },
  {
    id: 'q8',
    question: 'Do you need more time than others to complete reading or writing tasks?',
    options: [
      { value: '0', label: 'No, never' },
      { value: '1', label: 'Sometimes' },
      { value: '2', label: 'Yes, often' },
      { value: '3', label: 'Yes, all the time' }
    ]
  }
];

const DyslexiaTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before continuing.",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    
    // Calculate total score
    Object.values(answers).forEach(value => {
      totalScore += parseInt(value);
    });
    
    const maxPossibleScore = totalQuestions * 3; // 3 is the max value per question
    const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);
    
    setScore(percentageScore);
    setTestCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {!testCompleted ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-pop">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Dyslexia Screening Test</h1>
              <ReadingText>
                Answer these questions to help identify if you might have signs of dyslexia. 
                This is not a formal diagnosis but can help you understand if you should seek further assessment.
              </ReadingText>
            </div>
            
            <div className="relative mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-pastel-purple h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 mt-1 block text-right">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            
            <div className="mb-8 p-4 bg-pastel-peach/30 rounded-xl">
              <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>
              
              <RadioGroup 
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleOptionSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 bg-white p-3 rounded-lg hover:bg-pastel-blue/10 transition">
                    <RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} />
                    <label 
                      htmlFor={`${currentQuestion.id}-${option.value}`}
                      className="text-base flex-grow cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>Next <ArrowRight className="h-4 w-4" /></>
                ) : (
                  <>Finish <Check className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <TestResults score={score} />
        )}
      </main>
    </div>
  );
};

export default DyslexiaTest;
