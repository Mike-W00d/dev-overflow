import Link from "next/link";

import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { api } from "@/lib/api";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";

const questions = [
  {
    _id: "1",
    title: "How to learn react",
    description: "I want to learn react, can someone help me with that?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "3", name: "web development" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2021-09-01"),
  },
  {
    _id: "2",
    title: "How to learn JavaScript",
    description: "I want to learn react, can someone help me with that?",
    tags: [
      { _id: "1", name: "javascript" },
      { _id: "2", name: "javascript" },
      { _id: "3", name: "web development" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "https://cdn-icons-png.flaticon.com/512/6858/6858578.png",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2024-11-29"),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const session = await auth();

  console.log("Session: ", session);

  // by default the query to an empty string to show all the questions
  const { query = "", filter = "" } = await searchParams;
  // filter the questions based on the search and filter
  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query?.toLowerCase());
    const matchesFilter = filter
      ? question.tags.some(
          (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
        )
      : true;
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <section
        className="flex w-full flex-col-reverse 
      justify-between gap-4 sm:flex-row sm:items-center"
      >
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask A Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions ..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
