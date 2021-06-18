import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5600/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

async function getEvents() {
  const params = {
    start: "2020-05-15T00:00:00",
    end: "2020-05-15T23:59:59",
    // limit: 10,
  };

  try {
    const res = await API.get("0/buckets/aw-watcher-window_Victor-PC/events", {
      params,
    });
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
}

(async function main() {
  const events = await getEvents();
  console.log(events);
})();
