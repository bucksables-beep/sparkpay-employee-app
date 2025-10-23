/**
 * This file provides functions to connect to backend APIs.
 */

type ApiResponse<T> = {
  data: T;
  meta?: {
    total: number;
    perPage: number;
    pageCount: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, unknown> | null = null
  ) {
    super(message);
  }
}

type HTTPConfig = {
  params?: Record<string, string>;
  headers?: Record<string, string>;
};

export class $api {
  private static readonly baseUrl = process.env.API_URL;

  private static getUrl(endpoint: string, config?: HTTPConfig): string {
    let url = `${this.baseUrl}/${endpoint}`;
    if (config?.params) {
      url += `?${new URLSearchParams(config.params).toString()}`;
    }
    return url;
  }

  private static handleResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    if (!response.ok) {
      return response
        .json()
        .then((data) => {
          throw new ApiError(data.message, response.status, data.errors);
        })
        .catch((err) => {
          if (err instanceof ApiError) {
            throw err;
          }

          throw new ApiError("Failed to fetch data", response.status);
        });
    }

    return response.json().then(({ data, meta }) => ({ data, meta }));
  }

  private static handleRequest<T>(
    url: string,
    method: string,
    data?: unknown,
    config?: HTTPConfig
  ): Promise<ApiResponse<T>> {
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: JSON.stringify(data),
    }).then(this.handleResponse<T>);
  }

  static async get<T>(
    endpoint: string,
    config?: HTTPConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(
      this.getUrl(endpoint, config),
      "GET",
      undefined,
      config
    );
  }

  static async post<T>(
    endpoint: string,
    data?: unknown,
    config?: HTTPConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(
      this.getUrl(endpoint, config),
      "POST",
      data,
      config
    );
  }

  static async put<T>(
    endpoint: string,
    data?: unknown,
    config?: HTTPConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(
      this.getUrl(endpoint, config),
      "PUT",
      data,
      config
    );
  }

  static async delete<T>(
    endpoint: string,
    config?: HTTPConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>(
      this.getUrl(endpoint, config),
      "DELETE",
      undefined,
      config
    );
  }
}

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
