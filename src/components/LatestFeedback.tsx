import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Feedback {
  name: string;
  email: string;
  message: string;
  rating: number;
}

export const LatestFeedback = () => {
  const [latestFeedback, setLatestFeedback] = useState<Feedback | null>(null);

  const fetchLatestFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setLatestFeedback(data);
      }
    } catch (error) {
      console.error('Error fetching latest feedback:', error);
    }
  };

  useEffect(() => {
    fetchLatestFeedback();
    
    // Listen for new feedback submissions
    const handleFeedbackSubmitted = () => {
      fetchLatestFeedback();
    };
    
    window.addEventListener('feedbackSubmitted', handleFeedbackSubmitted);
    
    return () => {
      window.removeEventListener('feedbackSubmitted', handleFeedbackSubmitted);
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Latest Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {latestFeedback ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{latestFeedback.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="text-base">{latestFeedback.message}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${
                      star <= latestFeedback.rating
                        ? "fill-accent text-accent"
                        : "fill-none text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No feedback submitted yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to share your thoughts!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
