import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getReviews } from "@/lib/api";
import { ScrollArea } from "./ui/scroll-area";

export type NewReviewTypes = {
  _id?: string;
  _type: string;
  userId: string;
  name: string;
  rating: number;
  message: string;
  EventName: string;
};

export function LatestReviewsCard() {
  const [reviews, setReviews] = useState<NewReviewTypes[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allReviews = await getReviews();
      // Limit to the latest 5 reviews.
      setReviews(allReviews.slice(0, 5));
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-tuna-50 dark:bg-gray-800 h-[60vh]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Latest 5 Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reviews.map((review) => (
              <li key={review._id} className="py-2">
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  {review.name}
                  <span className="text-sm">({review.rating} ★)</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {review.message}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Event: {review.EventName}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
