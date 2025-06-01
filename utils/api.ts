import axios, { AxiosInstance } from "axios";
import {
  camelCase,
  snakeCase,
  isArray,
  isObject,
  mapKeys,
  mapValues,
} from "lodash";

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL_PROD; // PROD URL

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthTokenHeader = (token: string | null) => {
  let t: string | null = `Bearer ${token}`;

  if (token === null) t = null;
  instance.defaults.headers.common["Authorization"] = t;
};

const toCamelCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (isObject(obj)) {
    return mapValues(
      mapKeys(obj, (_value, key) => camelCase(key)),
      (value) => toCamelCase(value),
    );
  } else {
    return obj;
  }
};

const toSnakeCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map((v) => toSnakeCase(v));
  } else if (isObject(obj)) {
    return mapValues(
      mapKeys(obj, (_value, key) => snakeCase(key)),
      (value) => toSnakeCase(value),
    );
  } else {
    return obj;
  }
};

instance.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;

  if (!isFormData && config.data) {
    config.data = toSnakeCase(config.data);
    config.headers["Content-Type"] = "application/json"; // jen pro JSON
  } else {
    delete config.headers["Content-Type"]; // nech Axios nastavit sám
  }

  return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamelCase(response.data);
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const api = instance;
