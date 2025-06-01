import { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const { keyword, pageNumber } = useParams(); // Get keyword and pageNumber from URL

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        const config = {
          params: {
            keyword: keyword || '', // Pass keyword if present
            pageNumber: pageNumber || 1, // Pass pageNumber if present
          },
        };

        const { data } = await axios.get('http://localhost:5000/api/recipes', config);
        setRecipes(data.recipes);
        setPage(data.page);
        setPages(data.pages);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [keyword, pageNumber]); // Re-fetch when keyword or pageNumber changes

  return (
    <>
      <h1>Latest Recipes</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Row>
            {recipes.map((recipe) => (
              <Col key={recipe._id} sm={12} md={6} lg={4} xl={3}>
                <RecipeCard recipe={recipe} />
              </Col>
            ))}
          </Row>
          {pages > 1 && (
            <Pagination className="justify-content-center">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  to={
                    keyword
                      ? `/search/${keyword}/page/${x + 1}`
                      : `/page/${x + 1}`
                  }
                >
                  <Pagination.Item active={x + 1 === page}>
                    {x + 1}
                  </Pagination.Item>
                </Link>
              ))}
            </Pagination>
          )}
        </>
      )}
    </>
  );
};

export default HomePage;