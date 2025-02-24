import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  fetchTotalCustomersCount,
  fetchTotalEventsCount,
  getReviews,
  getCustomers,
} from "@/lib/api";

export function AdditionalMetrics() {
  const [metrics, setMetrics] = useState({
    customers: 0,
    events: 0,
    reviews: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const [customers, events, reviews, allCustomers] = await Promise.all([
        fetchTotalCustomersCount(),
        fetchTotalEventsCount(),
        getReviews().then((r) => r.length),
        getCustomers(),
      ]);

      const revenue = allCustomers.reduce(
        (acc, customer) => acc + parseFloat(customer.totalSpent!),
        0
      );

      setMetrics({
        customers,
        events,
        reviews,
        revenue,
      });
    };

    fetchMetrics();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 h-full">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 ">
        <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Customers
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.customers}
          </p>
        </div>
        <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Events
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.events}
          </p>
        </div>
        <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Reviews
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {metrics.reviews}
          </p>
        </div>
        <div className="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Total Revenue
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${metrics.revenue.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
