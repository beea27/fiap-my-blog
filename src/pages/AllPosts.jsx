import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from 'react-paginate';

import Layout from "../components/Layout";
import { contentfulClient } from "../utils/createContentfulClient";
import Card from "../components/Card";

import '../css/pagination.css';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 4;

  const getPosts = async () => {
    try {
      const response = await contentfulClient.getEntries({
        content_type: "blogPost",
        order: "-sys.createdAt",
      });

      console.log(response.items);
      setPosts(response.items);
      setPageCount(Math.ceil(response.items.length / itemsPerPage));
      setCurrentItems(response.items.slice(0, itemsPerPage));
    } catch (error) {
      console.log("Erro ao obter posts", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
    setCurrentItems(posts.slice(newOffset, newOffset + itemsPerPage));
  };

  return (
    <Layout>
      <div className="container my-4">
        <div className="row">
          <main className="col-md-8">
            <h2 className="mb-3">Histórico de Posts</h2>

            {currentItems.map((item) => (
              <Card
                key={item.sys.id}
                title={item.fields.blogPostTitle}
                text={item.fields.blogPostDescription}
                link={"/post/" + item.fields.blogPostSlug}
              />
            ))}

            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={1}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="< previous"
              breakLabel="..."
              containerClassName="pagination"
              activeClassName="active"
            />

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
