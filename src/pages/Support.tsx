import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Contact Support</CardTitle>
            <CardDescription>
              Have a question, feedback, or need help? Reach out to us through any of the channels below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <Mail className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <a 
                  href="mailto:support@pitchgenius.com" 
                  className="text-primary hover:underline"
                >
                  support@pitchgenius.com
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <MessageCircle className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Direct Message</h3>
                <a 
                  href="https://twitter.com/pitchgenius" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  @pitchgenius on X (Twitter)
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  For quick questions and updates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
