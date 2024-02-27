import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function useBookSearch(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.post(
          '/application',
          {
            pageNumber: pageNumber,
            pageSize: 3,
            token: localStorage.getItem('Landlord-Token'),
          },
          { withCredentials: true }
        );
        console.log("Response ", response.data)
        setBooks(prevBooks => [...new Set([...prevBooks, ...response.data])]);
        console.log("Books ", books)
        setHasMore(response.data.length > 0);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNumber]);

  useEffect(() => {
    setBooks([]);
  }, []);

  return { loading, error, books, hasMore };
}

function ApplicationsPage() {
  const [pageNumber, setPageNumber] = useState(1);

  const {
    books,
    hasMore,
    loading,
    error,
  } = useBookSearch(pageNumber);

  const observer = useRef();

  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && node === entries[0].target) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) observer.current.observe(node);

      return () => {
        if (node) observer.current.unobserve(node);
      };
    },
    [loading, hasMore, setPageNumber]
  );



  return (
   
    
    <div className='content-section'>
      <div className='content-section'>
      {books.map((book, index) => {
        if (books.length === index+1) {
          return <div  className='venue-list' ref={lastBookElementRef} key={book}>{book.PerformerID}</div>;
        } else {
          return <div className='venue-list' key={book}>{book.PerformerID}</div>;
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
      </div>
    </div>
    
  );
}

export default ApplicationsPage;






