import { Client } from "@elastic/elasticsearch";

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

async function run() {
  const response = await client.search({
    index: "stackoverflow",
    body: {
      query: {
        match: { title: "suscipit" },
      },
    },
  });

  const response2 = await client.search({
    index: "stackoverflow",
    body: {
      query: {
        bool: {
          must: [
            { match: { title: "suscipit" } },
            {
              term: { body: "parturient" },
            },
          ],
          filter: [
            {
              exists: { field: "favourite_count" },
            },
          ],
        },
      },
      sort: "answer_count",
    },
  });

  console.log(
    response?.hits?.hits.map((doc) => [doc._source?.title, doc._source?.body])
  );
}

run().catch((err) => {
  console.log(err);
  process.exit(1);
});
