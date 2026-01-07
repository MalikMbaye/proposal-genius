import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, ArrowLeft } from "lucide-react";
import { learnArticles } from "@/lib/learnContent";

export default function Learn() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Back link */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            The PitchGenius Methodology
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Learn to Close Bigger Deals
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            The frameworks and psychology behind $1.5M+ in closed deals. 
            <span className="font-medium"> These aren't tips — they're systems.</span>
          </p>
        </div>

        {/* Expectation Setting */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12 max-w-3xl mx-auto">
          <h3 className="font-semibold text-amber-900 mb-2">Before you dive in:</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            You'll get 7 deliverables with every generation — proposal, deck prompt, contract, emails, invoice, one-pager.
            <br /><br />
            <strong>That's not overkill. That's options.</strong>
            <br /><br />
            Pitching a solopreneur? Use pages 1-2. Pitching an enterprise? Send the full package.
            <strong> You decide what fits.</strong>
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {learnArticles.map((article, index) => (
            <Link key={article.slug} to={`/learn/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/30 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{article.icon}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Read article
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 pb-8">
          <p className="text-slate-600 mb-4">Ready to put these frameworks into practice?</p>
          <Link 
            to="/generate"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Generate Your First Proposal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
