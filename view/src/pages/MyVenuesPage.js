import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function useBookSearch(pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [images, setImages] = useState([]);
  const [userData, setUserData] = useState(null);




  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.post(
          '/venue/mine',
          {
            pageNumber: pageNumber,
            pageSize: 5,
            token: localStorage.getItem('Landlord-Token'),
          },
          { withCredentials: true }
        );
        setBooks(prevBooks => [...new Set([...prevBooks, ...response.data.result])]);
      setImages(prevImages => [...prevImages, ...response.data.images]); // Append new images to existing ones


        //setBooks(prevBooks => [...new Set([...prevBooks, ...response.data.map(b => b.Name)])]);
        setHasMore(response.data.result.length > 0);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [pageNumber]); 



  return { loading, error, books, hasMore, images };
}


function MyVenuesPage() {

  const [pageNumber, setPageNumber] = useState(1);


  const {
    books,
    hasMore,
    loading,
    error, 
    images
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
    <div className='venue-container'>
   

      <div className='content-section'>
        {books.map((book, index) => {
          
          const key = `${book.ID}-${index}`; // Assuming `id` is a unique identifier for each book
          const imageIndex = book.ID - 1; // Adjust the index since IDs usually start from 1
          const image = images[imageIndex]; // Get the corresponding image from the `images` array

          if (books.length === index + 1) {
            return <Link  to={`/venue/${book.Name}`+ `-${book.ID}`} key ={key} className="custom-link">
              <div className='venue-list' ref={lastBookElementRef} key={key}>
                 <div className='list-image'>
              {<img src={`data:image/png;base64,${image}`} alt={`Image ${book.ID}`} width="90%" height="100%" />}
              </div>
                <div className='desc'>
                <h1>{book.Name}</h1>
                <p>{book.Description}</p>
                </div>
               

              </div>
              </Link>;
          } else {
            return <Link  to={`/venue/${book.Name}` + `-${book.ID}`} key ={key} className="custom-link">
              <div className='venue-list' key={key}>
              <div className='list-image'>
                {<img src={`data:image/png;base64,${image}`} alt={`Image ${book.ID}`} width="90%" height="100%" />}</div>
              
               <div className='desc'> 
                <h1>{book.Name}</h1>
                <p>{book.Description}</p>
              </div>
             
            </div>
              </Link>;
          }
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
      </div>
    </div>
  );
}

export default MyVenuesPage;