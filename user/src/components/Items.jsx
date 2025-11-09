import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "./Item.css"
import axios from 'axios'

export default function Items() {
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/random-view`);
                if (res.data?.status === 1 && res.data.allItems) {
                    setPost(res.data.allItems);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);






  return (
   
        <div className="box headBox">
            <div className="container">
                <div className='heading' >
                
                    <h1>view & Sell Books, Notes, and <br />
                        Gadgets In Your College</h1>

                        <p>Save Money, Connect with Students, Fast and simple</p>
                </div>

            </div>


         <div className='container post'>
                    <div className='postDesc'>
                            <b>
                             Got books or notes lying around?<br />
                             Earn money by selling them now!
                            </b> 
                    </div>

                    <div className="postbtn ">
                        <Link className='no-link-style' to={"/post-item"}><button >Post an item</button></Link>
                    </div>

        </div>

        <div className="container items">
            <h1>Latest Items</h1>

            <div className=" container cards">




                {
  loading ? (
    <p>Loading items...</p>
  ) : post.length === 0 ? (
    <p>Currently no items found</p>
  ) : (
    post.map((item) => {
      
      const imageUrl = item.images?.[0]?.path
        ? item.images[0].path.startsWith("http")
          ? item.images[0].path
          : `${process.env.REACT_APP_BACKEND_URL}/${item.images[0].path}`
        : "https://via.placeholder.com/300x180?text=No+Image";

      return (
        <Card key={item._id} className="cardCon">
          <Card.Img
            className="cardImage"
            variant="top"
            src={imageUrl}
            alt={item.itemName || "Item image"}
          />
          <Card.Body>
            <Card.Title
              className="cardTitle"
              title={item.itemName}
            >
              {item.itemName}
            </Card.Title>

            <Link to={`/view/${item._id}`}>
              <button className="cardbtn">View</button>
            </Link>
          </Card.Body>
        </Card>
      );
    })
  )
}

            </div>
        </div> 

        <div className="container guide">

                <h1>How it works</h1>
                <div className="instruction">
                    <ul>
                        <li>
                            <div className='i1'>
                                <h3>Post an Item</h3>
                                <p>Add photo and details</p>
                             </div>
                    
                        </li>

                        <li>
                            <div className='i2'>
                                <h3>Browse Listing</h3>
                                <p>find what you need</p>
                           </div>
                        </li>


                        <li>
                             <div className='i3'>
                                <h3>Contact seller</h3>
                                <p>chat or whatsapp</p>
                            </div>
                            
                        </li>
                    </ul>     
                </div>
            </div> 
     </div>
  )
}

    