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
  const response = await client.index({
    index: "test-demo",
    id: "1",
    refresh: true,
    body: {
      foo: "bar",
    },
  });
  console.log("Response =====>", response);

  const response2 = await client.get({
    index: "test-demo",
    id: "1",
  });
  console.log(response2);
}

run().catch((err) => {
  console.log("Error 1111", err);
  process.exit(1);
});
