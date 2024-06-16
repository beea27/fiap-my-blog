import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { contentfulClient } from "../utils/createContentfulClient";
import Card from "../components/Card";

function AllPosts() {
  const [posts, setPosts] = useState([]);

  const getPosts = async (limit) => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: "blogPost",
        limit: limit,
        order: "-sys.createdAt",
      });

      console.log(response.items);
      setPosts(response.items);
    } catch (error) {
      console.log("Erro ao obter posts", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <main className="col-md-8">
            <h2 className="mb-3">Histórico de Posts</h2>

            {posts.map((item) => (
              <Card
                key={item.sys.id}
                title={item.fields.blogPostTitle}
                text={item.fields.blogPostDescription}
                link={"/post/" + item.fields.blogPostSlug}
              />
            ))}

            <Link to="/" className="btn btn-primary mt-4">
              Voltar para Home
            </Link>
          </main>
        </div>
      </div>
    </Layout>
  );
}

export default AllPosts;
