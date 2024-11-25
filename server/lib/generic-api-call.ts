import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios";

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
