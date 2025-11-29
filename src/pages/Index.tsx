import { FeedbackForm } from "@/components/FeedbackForm";
import { LatestFeedback } from "@/components/LatestFeedback";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Feedback App
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your thoughts and see what others are saying
          </p>
        </header>

        <FeedbackForm />
        
        <LatestFeedback />
      </div>
    </div>
  );
};

export default Index;
