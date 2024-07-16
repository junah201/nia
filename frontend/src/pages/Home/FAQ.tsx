import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import faq from '@/constants/faq';

const FAQ = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faq.map(({ question, answer }, index) => (
        <AccordionItem key={question} value={`item-${index}`}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ;
