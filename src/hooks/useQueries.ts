import { NewCinemaTypes } from "@/components/NewCinemaForm";
import { NewCustomer } from "@/components/NewCustomerForm";
import { NewReviewTypes } from "@/components/NewReviewForm";
import {
  addEvent,
  addNewCinema,
  addNewCustomer,
  addNewReview,
  Cinema,
  Customer,
  EditCinema,
  EditEvent,
  Events,
  fetchTotalCustomersCount,
  fetchTotalEventsCount,
  getCinemas,
  getCustomerImageById,
  getCustomers,
  getEvents,
  getReviews,
  loginUser,
  User,
} from "@/lib/api";
import { client } from "@/lib/sanity";
import { queryClient } from "@/Root";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

// ─── MUTATION HOOKS ────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation<User, Error, LoginCredentials, unknown>({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const user = await loginUser(email, password);
      if (!user) {
        throw new Error("Invalid credentials");
      }
      return user;
    },
    onSuccess: (userData) => {
      console.log("User logged in successfully:", userData);
      toast.success("User logged in successfully!");
    },
    onError: (error) => {
      console.error(
        "Error logging in user:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error logging in user");
    },
  });
};

export const useAddCinemas = () => {
  return useMutation<Cinema, Error, NewCinemaTypes, unknown>({
    mutationFn: addNewCinema,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cinemas"],
        refetchType: "active",
      });
      toast.success("Cinema added successfully!");
    },
    onError: (error) => {
      console.error("Error adding Cinema:", error);
      toast.error("Error adding Cinema");
    },
  });
};

export const useDeleteCinema = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Cinema ID is required for deletion.");
      await client.delete(id);
      console.log(`Cinema with ID ${id} deleted.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cinemas"],
        refetchType: "active",
      });
      toast.success("Cinema deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting cinema:", error);
      toast.error("Error deleting cinema");
      throw new Error(
        `Error deleting cinema: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useDeleteCustomer = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Customer ID is required for deletion.");
      await client.delete(id);
      console.log(`Customer with ID ${id} deleted.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["customersCount"],
        refetchType: "active",
      });
      toast.success("Customer deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer");
      throw new Error(
        `Error deleting customer: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useDeleteReview = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Review ID is required for deletion.");
      await client.delete(id);
      console.log(`Review with ID ${id} deleted.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
        refetchType: "active",
      });
      toast.success("Review deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting Review:", error);
      toast.error("Error deleting Review");
      throw new Error(
        `Error deleting Review: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (!id) throw new Error("Event ID is required for deletion.");
      await client.delete(id);
      console.log(`Event with ID ${id} deleted.`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "active",
      });
      toast.success("Event deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting Event:", error);
      toast.error("Error deleting Event");
      throw new Error(
        `Error deleting Event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });
};

export const useEditEvent = () => {
  return useMutation<void, Error, Events>({
    mutationFn: EditEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "active",
      });
      toast.success("Event updated successfully!");
    },
    onError: (error) => {
      console.error(
        "Error updating event:",
        error instanceof Error ? error.message : "Unknown error"
      );
      toast.error("Error updating event");
    },
  });
};

export const useEditCinema = () => {
  return useMutation<void, Error, Cinema, unknown>({
    mutationFn: (cinema: Cinema) => EditCinema(cinema),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cinemas"],
        refetchType: "active",
      });
      toast.success("Cinema updated successfully!");
    },
    onError: (error) => {
      console.error(
        "Error editing Cinema:",
        error instanceof Error ? error.message : "Unknown error"
      );
      toast.error("Error editing Cinema");
    },
  });
};

export const useAddCustomer = (totalPages: number) => {
  return useMutation<void, Error, NewCustomer>({
    mutationFn: (newCustomer) => addNewCustomer(newCustomer),
    onSuccess: () => {
      for (let page = 1; page <= totalPages; page++) {
        queryClient.invalidateQueries({
          queryKey: ["customers", page],
          refetchType: "active",
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["customersCount"],
        refetchType: "active",
      });
      toast.success("Customer added successfully!");
    },
    onError: (error) => {
      console.error(
        "Error adding Customer:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error adding Customer");
    },
  });
};

export const useAddEvent = (totalPages: number) => {
  return useMutation<void, Error, Events>({
    mutationFn: (newEvent) => addEvent(newEvent),
    onSuccess: () => {
      for (let page = 1; page <= totalPages; page++) {
        queryClient.invalidateQueries({
          queryKey: ["events", page],
          refetchType: "active",
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["eventsCount"],
        refetchType: "active",
      });
      toast.success("Event added successfully!");
    },
    onError: (error) => {
      console.error(
        "Error adding event:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error adding event");
    },
  });
};

// ─── QUERY HOOKS ──────────────────────────────────────────────────

export const useFetchCustomers = (page?: number) => {
  return useQuery<Customer[], Error>({
    queryKey: page ? ["customers", page] : ["customers"],
    queryFn: async () => {
      const customers = await getCustomers(page);
      return customers.sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useFetchCinemas = () => {
  return useQuery<Cinema[], Error>({
    queryKey: ["cinemas"],
    queryFn: () => getCinemas(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useFetchEvents = (page?: number) => {
  return useQuery<Events[], Error>({
    queryKey: page ? ["events", page] : ["events"],
    queryFn: async () => {
      const events = await getEvents(page);
      return events.sort(
        (a, b) =>
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      );
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useGetCustomerLength = () => {
  return useQuery({
    queryFn: fetchTotalCustomersCount,
    queryKey: ["customersCount"],
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetEventsLength = () => {
  return useQuery({
    queryFn: fetchTotalEventsCount,
    queryKey: ["eventsCount"],
    staleTime: 1000 * 60 * 10,
  });
};

export const useGetReviews = () => {
  return useQuery({
    queryFn: async () => {
      const reviews = await getReviews();
      // Sort reviews by rating (highest rated first)
      return reviews.sort((a, b) => b.rating - a.rating);
    },
    queryKey: ["reviews"],
    staleTime: 1000 * 60 * 10,
  });
};

export const useAddReview = () => {
  return useMutation<void, Error, NewReviewTypes>({
    mutationFn: (review) => addNewReview(review),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["customers"],
        refetchType: "active",
      });
      toast.success("Review added successfully!");
    },
    onError: (error) => {
      console.error(
        "Error adding Review:",
        error instanceof Error ? error.message : error
      );
      toast.error("Error adding Review");
    },
  });
};

export const useGetCustomerImageById = (userId: string, userName: string) => {
  return useQuery({
    queryFn: () => getCustomerImageById(userId),
    queryKey: [userName],
    staleTime: 1000 * 60 * 100,
  });
};
