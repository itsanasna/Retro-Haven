// components
import "../styles/ItemDetails.css";
import BookingForm from "./BookingForm";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiURL } from "../util/apiURL";
import GoogleMap from "./GoogleMap";
import Calendar from "./Calendar";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const API = apiURL();
const stripePromise = loadStripe(
  "pk_test_51JTu2IHSic55neYrudHQjov0AEp1TxciR5lLveuKsW1O14d1XuYrtF2B7dgJxtk1sfO4tzHFTqFtExUtaag6ZE3x00HJpDxEdA"
  
);


const successMessage = () => {
  return (
    <div className="success-msg">
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 16 16"
        className="bi bi-check2"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
        />
      </svg>
      <div className="title">Request Sent!</div>
    </div>
  );
};

const ItemDetails = () => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [item, setItem] = useState({});
  const [coordinates, setCoordinates] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { id } = useParams();

  console.log(item)
  console.log(item.price)
  
  const totalPrice = item.price;

  const getItem = async () => {
    try {
      const res = await axios.get(`${API}/items/${id}`);
      setItem(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getItem()
      .then((res) => {
        geoCode(res);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const geoCode = async (location) => {
    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: location.location,
            key: process.env.REACT_APP_GOOGLE_KEY,
          },
        }
      );
      setCoordinates(res.data.results[0].geometry.location);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detailContainer">
      <div className="details">
        <div className="itemOmg">
          <h5>{item.name}</h5>
          <img src={item.photo} className="descPhoto" />
        </div>
        <section className="descContainer">
          <div className="detailLine">
            <h6>Description: </h6> {item.description}
          </div>
          <div className="detailLine">
            {" "}
            <h6>Category:</h6> Special Occasion
          </div>
          <div className="detailLine">
            <h6>Price:</h6> ${item.price}
          </div>
          <div className="detailLine">
            <h6>Location:</h6> {item.location}
            {/* <GoogleMap coordinates={coordinates} className="mapsContainer" /> */}
          </div>
        </section>
      </div>
      {/* <BookingForm item_id={id} owner_id={item.user_id} /> */}

      <div className="paymentContainer">
        {/* <Calendar
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />{" "} */}
        {paymentCompleted ? (
          successMessage()
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              totalPrice={totalPrice}
              item={item}
              item_id={id}
              setPaymentCompleted={setPaymentCompleted}

              className="paymentContainer"
            />
            </Elements>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
