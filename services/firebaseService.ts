
import type { Customer } from '../types';

// --- PLACEHOLDER FOR FIREBASE AUTH ---

export const loginWithEmail = async (email: string, pass: string) => {
  console.log(`Attempting login for ${email}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, this would call Firebase Auth
  if (email === "test@business.com" && pass === "password123") {
    return {
      uid: "xyz123",
      email: email,
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

export const logout = async () => {
  console.log("Logging out");
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would call Firebase Auth signout
  return;
};


// --- PLACEHOLDER FOR FIREBASE FIRESTORE ---

const mockCustomers: Customer[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', enrollmentDate: '2023-01-15', stamps: 8, rewardsRedeemed: 2 },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', phone: '555-0102', enrollmentDate: '2023-02-20', stamps: 3, rewardsRedeemed: 0 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-0103', enrollmentDate: '2023-03-10', stamps: 10, rewardsRedeemed: 5 },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', phone: '555-0104', enrollmentDate: '2023-04-05', stamps: 5, rewardsRedeemed: 1 },
  { id: '5', name: 'Ethan Hunt', email: 'ethan@example.com', phone: '555-0105', enrollmentDate: '2023-05-22', stamps: 7, rewardsRedeemed: 3 },
];

export const getCustomers = async (): Promise<Customer[]> => {
    console.log("Fetching customers...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would fetch from a Firestore collection
    return mockCustomers;
};

export const updateCardSettings = async (settings: { name: string; reward: string; color: string }) => {
    console.log("Updating card settings:", settings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would update a document in Firestore
    return { success: true, settings };
};
