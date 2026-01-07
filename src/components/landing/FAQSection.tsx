import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is this different from proposal templates?",
    answer: "Templates give you fill-in-the-blank structure. We give you proven patterns—the language, pricing frameworks, and positioning strategies that actually win contracts.",
  },
  {
    question: "Can I customize the proposals?",
    answer: "Yes! Every proposal is fully editable. We generate the first draft, then you customize it for your specific client.",
  },
  {
    question: "What if I don't like the output?",
    answer: "Regenerate with different inputs. Most users get what they need quickly, but you can iterate as needed.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. Your proposals are private. We use industry-standard encryption and never sell or share your data.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Cancel anytime. No long-term contracts. Lifetime access is yours forever.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes. 30-day money-back guarantee. If you're not satisfied, we'll refund you in full.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 section-light relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-light-foreground">
            Questions? We've Got Answers.
          </h2>
        </div>
        
        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-light-card border border-light-border rounded-xl px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-light-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-light-muted leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
