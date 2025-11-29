import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  message: string;
  rating: number;
}

export const FeedbackForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    rating: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            rating: formData.rating,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Thank you for your feedback!",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
        rating: 0,
      });
      setErrors({});
      
      // Trigger a custom event to notify LatestFeedback to refresh
      window.dispatchEvent(new Event('feedbackSubmitted'));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, rating });
    if (errors.rating) {
      setErrors({ ...errors, rating: undefined });
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Share Your Feedback</CardTitle>
        <CardDescription>
          We'd love to hear your thoughts! Please fill out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Share your feedback here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="transition-[var(--transition-smooth)] hover:scale-110 focus:outline-none focus:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating
                        ? "fill-accent text-accent"
                        : "fill-none text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
