import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "./mypost.css"
import Footer from './Footer'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function Mypost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    setLoading(true);
    const API = process.env.REACT_APP_BACKEND_URL;
    axios.get(`${API}/my-posts`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(res => {
        if (res.data && res.data.status === 1) setPosts(res.data.data || []);
      })
      .catch(err => console.error('Failed to load my-posts', err))
      .finally(() => setLoading(false));
  }, []);

  const deletePost = (id) => {
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    if (!window.confirm('Delete this post?')) return;
    const API = process.env.REACT_APP_BACKEND_URL;
    axios.delete(`${API}/post-item/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(res => {
        toast.success("Deleted succesfully")
        if (res.data && res.data.status === 1) {
          setPosts(prev => prev.filter(p => p._id !== id));
        }
      })
      .catch(err => console.error('delete failed', err));
  }

  return (
    <div className="box">
        <Navbar/>

        <div className="container cardBox">
          <h1>My Post</h1>

          {loading && <p>Loading...</p>}

          <div className='cardB'>
            {posts.length === 0 && !loading && <p>No posts yet.</p>}
            {posts.map(post => (
              <Card key={post._id} className='cardCon'>
                {(post.images && post.images.length > 0) ? (
                  <Card.Img className="cardImage" variant="top" src={post.images[0].path} alt={post.itemName} />
                ) : (
                  <Card.Img className="cardImage" variant="top" src="https://via.placeholder.com/300x180?text=No+Image" alt="No Image" />
                )}
                <Card.Body>
                  <Card.Title>{post.itemName || 'Untitled'}</Card.Title>
                  <hr />
                  <Card.Text>{post.description || ''}</Card.Text>
                  <div className='btns'>
                    <Link className='gbtn no-link-style' to={`/view/${post._id}`}>view</Link>
                    <button className='rbtn'  variant="danger" onClick={() => deletePost(post._id)}>delete</button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

        <Footer/>
        
    </div>
  )
}
