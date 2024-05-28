import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: localStorage.token,
  },
});

function createAxiosResponse() {
  if (localStorage.token) {
    return axios.create({
      baseURL: '/api/v1',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: localStorage.token,
      },
    });
  }
}

export const fetcher = (url: string) => createAxiosResponse()!.get(url).then(async (res) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  return res.data
});