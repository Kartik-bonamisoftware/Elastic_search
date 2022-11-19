import { Client } from "@elastic/elasticsearch";
import { promisify } from "util";

const sleep = promisify(setTimeout);

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

async function* generator() {
  const dataset = [
    { user: "john", age: 16 },
    { user: "bruce", age: 18 },
    { user: "tony", age: 23 },
    { user: "tom", age: 20 },
    { user: "will", age: 22 },
    { user: "sam", age: 25 },
  ];

  for (const doc of dataset) {
    await sleep(100);
    yield doc;
  }
}

async function index() {
  const result = await client.helpers.bulk({
    datasource: generator(),
    flushInterval: 1000,
    onDocument(doc) {
      return {
        index: { _index: "game-of-thrones" },
      };
    },
    onDrop(doc) {
      console.log(`can't index document ${doc.document.id}`, doc.error);
      process.exit(1);
    },
    refreshOnCompletion: "game-of-thrones",
  });
  console.log(result);
}

prepare()
  .then(index)
  .catch((err) => {
    console.log("Error 1111", err);
    process.exit(1);
  });
