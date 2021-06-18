import axios from "axios";
import moment from "moment";
import { checkElasticConnection, esclient } from "./elastic";

const bucketId = "aw-watcher-window_Victor-PC";
const API = axios.create({
  baseURL: "http://localhost:5600/api/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function errorHandler(error) {
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

async function forEachHalfDay(startDate, callback) {
  const start = new Date(startDate);
  const end = new Date();
  for (
    let loop = new Date(start);
    loop <= end;
    loop.setHours(loop.getHours() + 12)
  ) {
    await callback(loop);
  }
}

async function getBucketInfo() {
  try {
    const res = await API.get(`/0/buckets/${bucketId}`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

async function getEvents({ start, end }) {
  const params = {
    start,
    end,
    // limit: 10,
  };

  try {
    const res = await API.get(`/0/buckets/${bucketId}/events`, { params });
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

(async function main() {
  if (!checkElasticConnection()) process.exit(1);

  const bucket = await getBucketInfo();
  forEachHalfDay(bucket.created, async (currentDate) => {
    const events = await getEvents({
      start: moment(currentDate).format(),
      end: moment(currentDate).add(12, "hours").format(),
    });

    console.log(currentDate, events.length);
    events.forEach(async (event) => {
      await esclient.index({
        index: bucketId.toLowerCase(),
        body: event,
      });
    });
  });
})();
