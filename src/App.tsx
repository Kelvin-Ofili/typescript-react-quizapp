import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./Api";
import { QuestionState, Difficulty } from "./Api";
import { GlobalStyle } from "./App.styles";
import { Wrapper } from "./App.styles";

export type AnswerObject = {
	question: string;
	answer: string;
	correct: boolean;
	correctAnswer: string;
};

const totalQuestions = 10;

const App = () => {
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionState[]>([]);
	const [number, setNumber] = useState(0);
	const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);

	console.log(questions);
	const startTrivia = async () => {
		setLoading(true);
		setGameOver(false);
		const newQuestions = await fetchQuizQuestions(
			totalQuestions,
			Difficulty.EASY
		);
		setQuestions(newQuestions);
		setScore(0);
		setUserAnswers([]);
		setNumber(0);
		setLoading(false);
	};
	const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!gameOver) {
			const before = e.currentTarget;
			const answer = e.currentTarget.innerText;
			const correct = questions[number].correct_answer === answer;
			if (correct) setScore((prev) => prev + 1);
			console.log(before);
			console.log(answer);
			console.log(correct);
			console.log(score);
			const answerObject = {
				question: questions[number].question,
				answer,
				correct,
				correctAnswer: questions[number].correct_answer,
			};
			setUserAnswers((prev) => [...prev, answerObject]);
		}
	};
	const nextQuestion = () => {
		const nextQuestion = number + 1;

		if (nextQuestion === totalQuestions) {
			setGameOver(true);
		} else {
			setNumber(nextQuestion);
		}
	};
	return (
		<>
			<GlobalStyle />
			<Wrapper>
				<h1>REACT QUIZ</h1>
				{gameOver || userAnswers.length === totalQuestions ? (
					<button className="start" onClick={startTrivia}>
						Start
					</button>
				) : null}
				{!gameOver ? <p className="score">Score: {score}</p> : null}
				{loading && <p>Loading Questions...</p>}
				{!loading && !gameOver && (
					<QuestionCard
						question={questions[number].question}
						answers={questions[number].answers}
						callback={checkAnswer}
						userAnswer={userAnswers ? userAnswers[number] : undefined}
						questionNr={number + 1}
						totalQuestions={totalQuestions}
					/>
				)}
				{!gameOver &&
				!loading &&
				userAnswers.length === number + 1 &&
				number !== totalQuestions - 1 ? (
					<button className="next" onClick={nextQuestion}>
						Next Question
					</button>
				) : null}
			</Wrapper>
		</>
	);
};

export default App;
