import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";

export const takeOneOrThrow =
    (message: string) =>
    <T>(values: T[]): T => {
        if (values.length < 1)
            throw new Error(`Found non unique or inexistent value: ${message}`);
        return values[0]!;
    };

export const takeUnique = <T>(values: T[]) => values[0];

export const getRequest = <T>(
    endpoint: string,
    headers: AxiosRequestConfig<any>["headers"]
) =>
    axios
        .get<T>(endpoint, {
            headers,
        })
        .then((res) => res.data);

export const postRequest = <R, D>(
    endpoint: string,
    body: D,
    headers: AxiosHeaders
) =>
    axios
        .post<R>(endpoint, body, {
            headers,
        })
        .then((res) => res.data);
