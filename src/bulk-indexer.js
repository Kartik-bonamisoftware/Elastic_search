import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import path from "path";
import split from "split2";

const __dirname = path.resolve();

const client = new Client({
  cloud: {
    id: "Testing:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDljZDFhMjkwOTdiZTQxOWVhNTg3NjZhOTk2MDQ3OGI0JGQ2MTVjMTRkOTI5MjQ3YzhiNThiMTA0YmM0ZTcwMjE2",
  },
  auth: {
    apiKey: "UElGZFlJUUJWMzkxOWZVUnNyS1g6c3VNWDRqam5TWGlVTlllTFU4eXlDdw==",
    // username: "elastic",
    // password: "U8xNZYuuzZfNngBG2pdoBVRE",
  },
});

async function prepare() {
  const { body: exists } = await client.indices.exists({
    index: "stackoverflow",
  });

  if (exists) {
    return await client.indices.create({
      index: "stackoverflow",
      body: {
        mappings: {
          dynamic: "strict",
          properties: {
            id: { type: "keyword" },
            title: { type: "text" },
            body: { type: "text" },
            answer_count: { type: "integer" },
            comment_count: { type: "integer" },
            favourite_count: { type: "integer" },
          },
        },
      },
    });
  }
}

async function index() {
  const datasetPath = path.join(
    __dirname,
    "..",
    "fixtures",
    "stackoverflow.ndjson"
  );
  const datasource = fs.createReadStream(datasetPath).pipe(split(JSON.parse));

  const result = await client.helpers.bulk({
    datasource,
    retries: 10,
    wait: 10000,
    concurrency: 10,
    flushBytes: 5000000,
    flushInterval: 1000,
    onDocument(doc) {
      console.log(typeof doc); // object
      return {
        index: { _index: "stackoverflow", _id: doc.id },
      };
    },
    onDrop(doc) {
      console.log(`can't index document ${doc.document.id}`, doc.error);
      process.exit(1);
    },
    refreshOnCompletion: "stackoverflow",
  });
  console.log(result);
}

prepare()
  .then(index)
  .catch((err) => {
    console.log("Error 1111", err);
    process.exit(1);
  });
