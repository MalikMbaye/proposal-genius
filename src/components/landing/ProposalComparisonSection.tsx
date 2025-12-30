// Proposal comparison cards section - side by side display
const proposalCards = [
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We will provide marketing strategy and execution services to help grow your business."',
    value: '$5,000',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your brand is stuck at $15K/month not because your product isn\'t good enough, but because you\'re missing three critical components..."',
    value: '$50,000',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"Our team will help optimize your sales funnel and improve conversions."',
    value: '$3,500',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"You\'re leaving $2M on the table annually because your checkout flow has 3 friction points killing conversions..."',
    value: '$75,000',
  },
  {
    type: 'generic',
    label: '❌ Generic Proposal',
    quote: '"We offer comprehensive consulting services tailored to your needs."',
    value: '$8,000',
  },
  {
    type: 'strategic',
    label: '✓ Strategic Proposal',
    quote: '"Your competitor just raised $10M and is outspending you 4:1 on acquisition. Here\'s the 90-day plan to win anyway..."',
    value: '$120,000',
  },
];

function ProposalCard({ card }: { card: typeof proposalCards[0] }) {
  const isStrategic = card.type === 'strategic';
  
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isStrategic ? 'border-primary/20' : 'border-slate-200'
    }`}>
      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-slate-400 font-mono">proposal.md</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col min-h-[180px]">
        <div className={`text-xs uppercase tracking-wider mb-3 font-semibold ${
          isStrategic ? 'text-green-600' : 'text-red-500'
        }`}>
          {card.label}
        </div>
        <p className="text-sm leading-relaxed text-slate-700 flex-1">
          {card.quote}
        </p>
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className={`text-2xl font-bold ${
              isStrategic ? 'text-primary' : 'text-slate-400'
            }`}>
              {card.value}
            </div>
            <div className="text-xs text-slate-400">Project Value</div>
          </div>
          {isStrategic && (
            <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
              <span className="text-green-600 font-semibold text-xs">+900% ROI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProposalComparisonSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            See the <span className="text-primary">10x Difference</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generic proposals get ignored. Strategic proposals close deals. Here's what separates the two.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {proposalCards.map((card, index) => (
            <ProposalCard key={index} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
