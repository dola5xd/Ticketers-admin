import { getSanityClient } from "./sanity";
import { v4 as uuidv4 } from "uuid";
import { NewCinemaTypes } from "@/components/NewCinemaForm";
import { NewCustomer } from "@/components/NewCustomerForm";
import { NewReviewTypes } from "@/components/NewReviewForm";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/*────────────────────────────────────────────────────────────────────
  Utility Functions
────────────────────────────────────────────────────────────────────*/
const uploadImageToSanity = async (image: File) => {
  try {
    const client = getSanityClient(); // Get the dynamic client here
    const uploadedImage = await client.assets.upload("image", image, {
      filename: image.name,
    });
    return uploadedImage.url;
  } catch (error) {
    if (error instanceof Error)
      throw new Error("Error uploading image: " + error.message);
    else throw new Error("Error uploading image");
  }
};

/*────────────────────────────────────────────────────────────────────
  CUSTOMER: Types & Functions
────────────────────────────────────────────────────────────────────*/
export interface Customer {
  _id: string;
  _type: string;
  name: string;
  age: string | number;
  image: string;
  city: string;
  dateJoin: string;
  totalSpent: string;
}

export const getCustomers = async (page?: number): Promise<Customer[]> => {
  try {
    const client = getSanityClient();
    let query;
    if (page) {
      const pageSize = 10;
      const start = (page - 1) * pageSize;
      query = `*[_type == "customer"] | order(dateJoin desc) [${start}...${
        start + pageSize
      }]`;
    } else {
      query = `*[_type == "customer"] | order(dateJoin desc)`;
    }
    const response = await client.fetch(query);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error("Error fetching customers: " + error.message);
    else throw new Error("Error fetching customers");
  }
};

export const fetchTotalCustomersCount = async (): Promise<number> => {
  try {
    const client = getSanityClient();
    const query = `count(*[_type == "customer"])`;
    const totalCount = await client.fetch<number>(query);
    return totalCount;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error("Error fetching total customer count: " + error.message);
    else throw new Error("Error fetching total customer count");
  }
};

export const addNewCustomer = async (customer: NewCustomer): Promise<void> => {
  try {
    const imageUrl = await uploadImageToSanity(customer.image as File);
    const customerWithUniqueId = {
      ...customer,
      _type: "customer",
      _id: `customer_${uuidv4()}`,
      image: imageUrl,
    };
    const client = getSanityClient();
    await client.createOrReplace(customerWithUniqueId);
  } catch (error) {
    if (error instanceof Error)
      throw new Error("Error adding new customer: " + error.message);
    else throw new Error("Error adding new customer");
  }
};

export const getCustomerImageById = async (id: string) => {
  try {
    const client = getSanityClient();
    const query = `*[_type == "customer" && _id == $id]{image}`;
    const response = await client.fetch(query, { id });
    return response.at(0).image;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error fetching customer image: " + error.message);
    } else {
      throw new Error("Error fetching customer image");
    }
  }
};

/*────────────────────────────────────────────────────────────────────
  CINEMA: Types & Functions
────────────────────────────────────────────────────────────────────*/
export interface Cinema {
  _id: string;
  _type: string;
  name: string;
  location: string;
  capacity: number;
  image: File | string;
  executivePrice: number;
  premierPrice: number;
  classicPrice: number;
}

export const addNewCinema = async (cinema: NewCinemaTypes): Promise<Cinema> => {
  try {
    const imageUrl = await uploadImageToSanity(cinema.image as File);
    const cinemaWithUniqueId = {
      ...cinema,
      _type: "cinema",
      _id: `cinema_${uuidv4()}`,
      image: imageUrl,
      executivePrice: 0,
      premierPrice: 0,
      classicPrice: 0,
    };
    const client = getSanityClient();
    const response = await client.createOrReplace(cinemaWithUniqueId);
    return response;
  } catch (error) {
    if (error instanceof Error)
      throw new Error("Error adding cinema: " + error.message);
    else throw new Error("Error adding cinema");
  }
};

export const getCinemas = async () => {
  try {
    const client = getSanityClient();
    const query = `*[_type == "cinema"] | order(dateJoin desc)`;
    const response = await client.fetch(query);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error fetching cinemas: " + error.message);
    } else {
      throw new Error("Error fetching cinemas");
    }
  }
};

export const EditCinema = async (cinema: Cinema) => {
  try {
    const imageUrl =
      cinema.image && typeof cinema.image === "object"
        ? await uploadImageToSanity(cinema.image as File)
        : cinema.image;
    if (!cinema._id) {
      throw new Error("Cinema must have an _id to update.");
    }
    const updatedCinema = {
      ...cinema,
      image: imageUrl,
    };
    const client = getSanityClient();
    await client.createOrReplace(updatedCinema);
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? "Error updating cinema: " + error.message
        : "Error updating cinema"
    );
  }
};

/*────────────────────────────────────────────────────────────────────
  EVENT: Types & Functions
────────────────────────────────────────────────────────────────────*/
export interface Events {
  _id: string;
  _type: string;
  title: string;
  dateTime: string;
  cinema: {
    _type: "reference";
    _ref: string;
  };
  description: string;
}

export const getEvents = async (page?: number): Promise<Events[]> => {
  try {
    const client = getSanityClient();
    let query;
    if (page) {
      const eventsPerPage = 10;
      const start = (page - 1) * eventsPerPage;
      const end = start + eventsPerPage;
      query = `*[_type == "event"] | order(dateTime asc) [${start}...${end}]`;
    } else {
      query = `*[_type == "event"] | order(dateTime asc)`;
    }
    const response: Events[] = await client.fetch(query);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching events: ${error.message}`);
    }
    throw new Error("Error fetching events: Unknown error");
  }
};

export const fetchTotalEventsCount = async (): Promise<number> => {
  try {
    const client = getSanityClient();
    const query = `count(*[_type == "event"])`;
    const totalCount = await client.fetch<number>(query);
    return totalCount;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error("Error fetching total events count: " + error.message);
    else throw new Error("Error fetching total events count");
  }
};

export const addEvent = async (newEvent: Events): Promise<void> => {
  try {
    const submitEvent = {
      ...newEvent,
      _id: `event_${uuidv4()}`,
    };
    const client = getSanityClient();
    await client.create(submitEvent);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error adding event: ${error.message}`);
    }
    throw new Error("Error adding event: Unknown error");
  }
};

export const EditEvent = async (updatedEvent: Events): Promise<void> => {
  try {
    if (!updatedEvent._id) {
      throw new Error("Event must have an _id to update.");
    }
    const client = getSanityClient();
    await client.createOrReplace(updatedEvent);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error updating event: " + error.message);
    } else {
      throw new Error("Error updating event");
    }
  }
};

/*────────────────────────────────────────────────────────────────────
  REVIEW: Functions
────────────────────────────────────────────────────────────────────*/
export const getReviews = async (): Promise<NewReviewTypes[]> => {
  try {
    const client = getSanityClient();
    const query = `*[_type == "review"] | order(_createdAt desc)`;
    const response = await client.fetch(query);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error)
      throw new Error("Error fetching reviews: " + error.message);
    else throw new Error("Error fetching reviews");
  }
};

export const addNewReview = async (review: NewReviewTypes): Promise<void> => {
  try {
    if (!review) throw new Error("No review provided");
    const newReview = {
      ...review,
      _type: "review",
      _id: `review_${uuidv4()}`,
    };
    const client = getSanityClient();
    await client.createOrReplace(newReview);
  } catch (error) {
    if (error instanceof Error)
      throw new Error("Error adding new review: " + error.message);
    else throw new Error("Error adding new review");
  }
};

/*────────────────────────────────────────────────────────────────────
  User Functions
────────────────────────────────────────────────────────────────────*/
export interface User {
  uid: string;
  email: string;
  role: "admin" | "preview";
  token?: string; // Only present for admin
}

export const loginUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const auth = getAuth();

    // 1. Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    const userData = userDoc.data();

    // 3. Verify role structure
    if (!userData.role || !["admin", "preview"].includes(userData.role)) {
      throw new Error("Invalid user role");
    }

    // 4. Verify admin token if needed
    if (userData.role === "admin" && !userData.Token) {
      throw new Error("Admin account missing token");
    }

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email || "",
      role: userData.role,
      token: userData.Token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};
