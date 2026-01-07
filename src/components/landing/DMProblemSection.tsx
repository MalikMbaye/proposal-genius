import { TrendingDown, MessageSquareX, Clock, DollarSign } from "lucide-react";

const problemStats = [
  {
    icon: MessageSquareX,
    number: "67%",
    title: "of DM leads go cold",
    description: "Because you took too long to respond or said the wrong thing at the wrong time.",
  },
  {
    icon: Clock,
    number: "4.2 hrs",
    title: "average response time",
    description: "By then, they've already messaged three other freelancers who responded faster.",
  },
  {
    icon: DollarSign,
    number: "$50K+",
    title: "left on the table yearly",
    description: "For the average freelancer who doesn't have a system for qualifying and closing in DMs.",
  },
];

export function DMProblemSection() {
  return (
    <section className="py-24 bg-[#0a0f14] border-t border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Visual Graph */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              {/* Window controls */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/30">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-slate-400 font-mono">dm-funnel-analysis.svg</span>
              </div>
              
              {/* Leaky Funnel Visualization */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  Your DM Funnel (Without a System)
                </div>
                
                {/* Funnel bars with leak indicators */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="h-10 bg-emerald-500/80 rounded-lg flex items-center px-4 justify-between">
                      <span className="text-sm font-medium text-white">Inbound DMs</span>
                      <span className="text-sm font-bold text-white">100</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-red-400 pl-4">
                    <span>↓ 40% never responded to in time</span>
                  </div>
                  
                  <div className="relative">
                    <div className="h-10 bg-yellow-500/80 rounded-lg flex items-center px-4 justify-between" style={{ width: '60%' }}>
                      <span className="text-sm font-medium text-slate-900">Responded</span>
                      <span className="text-sm font-bold text-slate-900">60</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-red-400 pl-4">
                    <span>↓ 50% sent wrong message, killed the deal</span>
                  </div>
                  
                  <div className="relative">
                    <div className="h-10 bg-orange-500/80 rounded-lg flex items-center px-4 justify-between" style={{ width: '30%' }}>
                      <span className="text-sm font-medium text-white">Qualified</span>
                      <span className="text-sm font-bold text-white">30</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-red-400 pl-4">
                    <span>↓ 60% ghosted before call booked</span>
                  </div>
                  
                  <div className="relative">
                    <div className="h-10 bg-red-500/80 rounded-lg flex items-center px-4 justify-between" style={{ width: '12%' }}>
                      <span className="text-sm font-medium text-white">Calls</span>
                      <span className="text-sm font-bold text-white">12</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom stat */}
                <div className="mt-6 pt-4 border-t border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-500">Conversion Rate</span>
                    <span className="text-lg font-bold text-red-400">12%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">88 potential deals lost in DMs every month</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            {/* Header */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              You're Losing Deals in the <span className="text-red-400">DMs</span>
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              Before you can send a proposal, you need to book a call.
              Before you book a call, you need to qualify the lead.
              That all happens in DMs—and most freelancers are bleeding money there.
            </p>
            
            {/* Problem Stats */}
            <div className="space-y-8">
              {problemStats.map((item) => (
                <div key={item.title} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold text-red-400">
                        {item.number}
                      </span>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
