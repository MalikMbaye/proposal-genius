import { useParams, Link, Navigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { getArticleBySlug, learnArticles } from "@/lib/learnContent";
import ReactMarkdown from "react-markdown";

export default function LearnArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return <Navigate to="/learn" replace />;
  }

  // Get next and previous articles
  const currentIndex = learnArticles.findIndex(a => a.slug === slug);
  const prevArticle = currentIndex > 0 ? learnArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < learnArticles.length - 1 ? learnArticles[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-12 pt-24 max-w-3xl">
        {/* Back link */}
        <Link 
          to="/learn" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learning Hub
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{article.icon}</span>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              {article.readTime} read
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {article.title}
          </h1>
          <p className="text-lg text-slate-600">
            {article.description}
          </p>
        </div>

        {/* Article Content */}
        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-strong:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-slate-100 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border prose-th:border">
          <ReactMarkdown
            components={{
              // Custom link handling for internal links
              a: ({ href, children }) => {
                if (href?.startsWith('/')) {
                  return (
                    <Link to={href} className="text-primary hover:underline">
                      {children}
                    </Link>
                  );
                }
                return (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
              // Style code blocks
              code: ({ children }) => (
                <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">
                  {children}
                </code>
              ),
              // Style blockquotes
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic text-slate-600">
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </article>

        {/* Navigation */}
        <div className="border-t border-slate-200 mt-12 pt-8 flex items-center justify-between">
          {prevArticle ? (
            <Link 
              to={`/learn/${prevArticle.slug}`}
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">{prevArticle.title}</span>
            </Link>
          ) : (
            <div />
          )}
          
          {nextArticle ? (
            <Link 
              to={`/learn/${nextArticle.slug}`}
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <span className="text-sm">{nextArticle.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              to="/learn"
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
              <span className="text-sm">Back to all articles</span>
              <BookOpen className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-xl p-8 mt-12 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Ready to apply this?
          </h3>
          <p className="text-slate-400 mb-6">
            Generate a proposal and put these frameworks into practice.
          </p>
          <Link 
            to="/generate"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Generate Proposal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
