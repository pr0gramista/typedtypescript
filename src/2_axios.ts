import axios from "axios";
import { z } from "zod";

interface User {
  name: string;
  email: string;
}

const PostZod = z.object({
  title: z.string(),
  authorId: z.number(),
  content: z.string(),
});

const PostsZod = z.array(PostZod);

type Post = z.infer<typeof PostZod>;

const main = async () => {
  const usersResponse = await axios.get<User>("http://localhost:3000/users");

  console.log(usersResponse.data); // Just guessing or lying...

  const postsResponse = await axios.get("http://localhost:3000/posts");
  const posts: Post[] = PostsZod.parse(postsResponse.data);

  console.log(posts); // The data is proven to match the schema
};

main();
