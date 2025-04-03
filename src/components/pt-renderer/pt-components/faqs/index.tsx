import Question from './question';
import Answer from './answer';
import PtRenderer from '../..';
import { CircleHelp } from 'lucide-react';

const faqsComponent = (props: any) => {
  const { title = '', questions = [] } = props;

  return (
    <div className="pt-4">
      <div className="">
        <div className="mb-5">
          <div className="flex items-center text-2xl">
            <CircleHelp className="text-primaryColor mr-2 h-3 w-3 md:h-8 md:w-8" />
            <h2>{title}</h2>
          </div>
        </div>

        <div className="flex flex-col gap-1 pb-8">
          {questions.map((question: any, index: any) => (
            <Question
              key={index}
              isActive={index === 0}
              question={question.title}
            >
              <Answer>
                <PtRenderer body={question.answer} />
              </Answer>
            </Question>
          ))}
        </div>
      </div>
    </div>
  );
};

export default faqsComponent;
