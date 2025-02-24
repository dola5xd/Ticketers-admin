import { useQuery } from "@tanstack/react-query";
import { getEvents, getCustomers, getReviews } from "@/lib/api";
import { format, parseISO } from "date-fns";
import React from "react";

export function useDashboardData() {
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useQuery({ queryKey: ["events"], queryFn: () => getEvents() });
  const {
    data: customers,
    isLoading: customersLoading,
    error: customersError,
  } = useQuery({ queryKey: ["customers"], queryFn: () => getCustomers() });
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({ queryKey: ["reviews"], queryFn: () => getReviews() });

  const eventsByMonth = React.useMemo(() => {
    if (!events) return [];
    const map: Record<string, number> = {};
    events.forEach((event) => {
      const month = format(parseISO(event.dateTime), "MMM");
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [events]);

  const customersByMonth = React.useMemo(() => {
    if (!customers) return [];
    const map: Record<string, number> = {};
    customers.forEach((customer) => {
      const month = format(new Date(customer.dateJoin), "MMM");
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [customers]);

  const reviewsByRating = React.useMemo(() => {
    if (!reviews) return [];
    const map: Record<string, number> = {};
    reviews.forEach((review) => {
      const rating = String(review.rating);
      map[rating] = (map[rating] || 0) + 1;
    });
    return Object.entries(map).map(([rating, count]) => ({ rating, count }));
  }, [reviews]);

  return {
    eventsData: eventsByMonth,
    customersData: customersByMonth,
    reviewsData: reviewsByRating,
    isLoading: eventsLoading || customersLoading || reviewsLoading,
    error: eventsError || customersError || reviewsError,
  };
}
