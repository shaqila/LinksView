import { useState } from "react";
import { FaEye, FaLink } from "react-icons/fa";
import { FcLink } from "react-icons/fc";
import { BiReset, BiCopy } from "react-icons/bi";
import axios from "axios";

const Card = () => {
  const [link, setLink] = useState("");
  const [linkData, setLinkData] = useState(null);
  const [linkShrink, setLinkShrink] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchLinkData = async () => {
    try {
      const response = await fetch(
        `https://api.linkpreview.net/?key=4b842ed8a29d229c1c449965955e2cec&q=${encodeURIComponent(
          link
        )}`
      );
      const data = await response.json();
      setLinkData(data);
    } catch (error) {
      console.error("Error fetching link data:", error);
    }
  };

  // const generateLinkShrink = async (longUrl) => {
  //   try {
  //     const response = await axios.post(
  //       "https://api-ssl.bitly.com/v4/shorten",
  //       {
  //         long_url: longUrl,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer 1BFXmg1C1g2EHaLvdbE4H0hSPRb0y32L8muQESTnOuWHW",
  //         },
  //       }
  //     );
  //     return response.data.id;
  //   } catch (error) {
  //     console.error("Error generating short link:", error);
  //   }
  // };

  const generateLinkShrink = async (longUrl) => {
    try {
      const response = await axios.get(
        `https://is.gd/create.php?format=json&url=${encodeURIComponent(
          longUrl
        )}`
      );

      if (response.data.shorturl) {
        console.log(response.data.shorturl);
        return response.data.shorturl;
      } else {
        console.error("Error generating short link:", response.data.error);
      }
    } catch (error) {
      console.error("Error generating short link:", error);
    }
  };

  const handleLinkPreview = (e) => {
    e.preventDefault();
    fetchLinkData();
  };

  const handleLinkShrink = async (e) => {
    e.preventDefault();
    const newLinkShrink = await generateLinkShrink(link);
    setLinkShrink(newLinkShrink);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(linkShrink);
      setCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleClear = () => {
    setLink("");
    setLinkShrink("");
    setLinkData(null);
    setCopied(false);
  };

  return (
    <div className="card">
      <div className="card__body">
        <div className="card__icon">
          <FcLink size={60} />
        </div>
        <form onSubmit={handleLinkPreview}>
          <input
            className="card__input"
            type="text"
            placeholder="Paste Link Of Your Post"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              // fetchLinkData();
            }}
          />
        </form>
        <div className="card__reset" onClick={handleClear}>
          <BiReset size={24} />
        </div>
      </div>
      <div className="card__footer">
        <div className="card__button" onClick={handleLinkShrink}>
          <FaLink />
          Link Shrink
        </div>
        {/* <label className="card__label"> */}
        {/* <input type="radio" name="pick" className="card__pick" /> */}
        <div className="card__button" onClick={handleLinkPreview}>
          <FaEye />
          Link Preview
        </div>
        {/* </label> */}
      </div>
      {/* <div className="card__footer">
        <label className="card__label">
          <input type="radio" name="pick" className="card__pick" />
          <div className="card__button">
            <FaComment />
            From Comments
          </div>
        </label>
        <label className="card__label">
          <input type="radio" name="pick" className="card__pick" />
          <div className="card__button">
            <FaHeart />
            From Likes
          </div>
        </label>
      </div> */}

      {linkData && (
        <div className="preview">
          <div className="preview__img">
            <img src={linkData.image} alt="Link Preview" />
          </div>
          <div className="preview__info">
            <div className="preview__info-title">{linkData.title}</div>
            <div className="preview__info-desc">{linkData.description}</div>
            {/* <div className="preview__total">
              <p>
                <FaComment className="preview__total-icon" />
                2458 Comments
              </p>
              <p>
                <FaHeart className="preview__total-icon" />
                1,594,808 Likes
              </p>
            </div> */}
          </div>
        </div>
      )}
      {linkShrink && (
        <div className="preview">
          <div className="preview__shrink">
            <h3>Short Link : {linkShrink}</h3>
            <div
              className={copied ? "card__reset--copied" : "card__reset"}
              onClick={handleCopy}
            >
              <BiCopy size={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
