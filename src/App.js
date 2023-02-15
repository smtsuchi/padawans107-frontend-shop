import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, set, child, get } from "firebase/database";

const REACT_APP_STRIPE_KEY = process.env.REACT_APP_STRIPE_API_KEY


export default function App() {
  const getUserFromLS = () => {
    const foundUser = localStorage.getItem('user_shop');
    if (foundUser){
      return JSON.parse(foundUser)
    }
    return {}
  };

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({size:0});
  const [user, setUser] = useState(getUserFromLS());

  const getProducts = async () => {
    const url = 'https://api.stripe.com/v1/products';
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${REACT_APP_STRIPE_KEY}`
      }
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data)
    setProducts(data.data)
  };

  useEffect(()=>{getProducts()}, [])

  const addToDB = (cart) => {
    const db = getDatabase();
    set(ref(db, `/cart/${user.uid}`), cart)
  };

  const getCart = async (user) => {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `/cart/${user.uid}`))
    if (snapshot.exists()){
      setCart(snapshot.val())
    }
  };

  useEffect(()=>{
    getCart(user)
  }, [user]);

  const addToCart = (item) => {
    const copy = {...cart};
    if (item.id in copy){
      copy[item.id].qty++
    }
    else {
      copy[item.id] = item
      copy[item.id].qty = 1
    }
    copy.size++
    setCart(copy)
    if (user.uid){
      addToDB(copy)
    }
  };


  const showProducts = () => {
    return products.map(p=>(
    <div key={p.id} style={{width:'250px', border:'1px solid grey'}}>
      <h2>{p.name}</h2>
      <p>{p.description}</p>
      <button onClick={()=>{addToCart(p)}}>Add to cart</button>
    </div>)
    )
  };
  const showCart = () => {
    return Object.keys(cart).map((key, index) => (key==='size'?<></>:<p key={index}>
      {cart[key].name} x{cart[key].qty}
    </p>))
  };

  const createPopup = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    setUser(user)
    localStorage.setItem('user_shop', JSON.stringify(user))
  };



  return (
    <div>
      <h1>Shoha's Polaroid Shop</h1>
      <h2>{user.uid?user.displayName:'GUEST'} | {cart.size}</h2>


      <div id='product-list' className='row'>
        {showProducts()}
      </div>
      <div id='cart-list'>
        {showCart()}
      </div>
      {user.uid?
      <button className='btn btn-danger' onClick={()=>{setUser({}); localStorage.removeItem('user_shop');setCart({size:0})}}>Log Out</button>
      :
      <button className='btn btn-primary' onClick={createPopup}>Log In With Google</button>
      }
      <button className='btn btn-success'>CHECKOUT</button>
    </div>
  )
}
