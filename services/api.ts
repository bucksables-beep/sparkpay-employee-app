/**
 * This file provides functions to connect to backend APIs.
 */

// 1. Using the fetch API for a generic REST API
/**
 * Fetches data from a generic REST API endpoint.
 *
 * @param endpoint The API endpoint to fetch data from.
 * @returns A promise that resolves with the JSON data, or null if an error occurs.
 */
export const fetchData = async (endpoint: string) => {
  try {
    // Replace with your actual API base URL
    const response = await fetch(`https://api.sparkpayhq.com/${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
};

// 2. Using the existing Firebase connection
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../firebase"; // Assuming firebase.ts is in the root

/**
 * Fetches data from a Firestore collection.
 *
 * @param collectionName The name of the collection to fetch data from.
 * @returns A promise that resolves with an array of documents, or an empty array if an error occurs.
 */
export const getFirestoreData = async <T extends { id: string }>(
  collectionName: string
): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: T[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() } as T);
    });
    return data;
  } catch (error) {
    console.error("Failed to get data from Firestore:", error);
    return [];
  }
};
