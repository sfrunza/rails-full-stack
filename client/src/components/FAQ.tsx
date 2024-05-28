import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const data = [
  {
    id: "faq-1",
    question: "How much do movers cost in Boston?",
    answer:
      "The average charge for a local move in Metro Boston area is about $100 to $130 per hour for a 2 men crew and a moving truck, with all furniture protection materials included (shrink wrap, moving blankets, tape, mattress covers). This cost will vary based on specific moving needs and service days.",
  },
  {
    id: "faq-2",
    question: "Should I buy moving insurance?",
    answer:
      "While most moving companies offer only basic option of $0.60 per pound for a damaged or lost item, Brave Movers offer value protection up to $10,000 in household goods coverage.",
  },
  {
    id: "faq-3",
    question: "Are we fully licensed and insured?",
    answer:
      "Brave Movers are fully licensed and insured moving company that can legally operate across the lengths and breadths of The United States of America.Please call our office for more details about our licenses and insurance information.",
  },
  {
    id: "faq-4",
    question: "How can I get moving boxes in Boston?",
    answer:
      "You can try nearest home improvement stores or order a Full Packing Services. Our experienced movers will have all necessary packing materials to pack everything safe and professionally.",
  },
  {
    id: "faq-5",
    question: "How many movers do I need for my move?",
    answer:
      "It depends on the size of your move and amount of stairs. Most 1 or 2 bedroom apartment moves can be easily done with 2 or 3 movers crew.",
  },
  {
    id: "faq-6",
    question: "Do I need a parking permit for my moving truck in Boston?",
    answer:
      "Moving permit is not required in Boston, however it is the only legal way to reserve the space for the moving van. The cost for a one-day moving truck parking permit is $110, according to the website for the city of Boston.",
  },
  {
    id: "faq-7",
    question: "How far in advance should you schedule movers?",
    answer:
      "As early as you can, especially if you are planning to move in a peak moving season. Typically 2-3 weeks is enough to reserve the date you want. We also accept early and last minute bookings.",
  },
];

export default function FAQ() {
  return (
    <div>
      <p className="text-base font-semibold">F.A.Q</p>
      <Accordion type="single" collapsible className="w-full">
        {data.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
