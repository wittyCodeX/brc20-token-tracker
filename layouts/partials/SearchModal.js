import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";

const SearchModal = ({ searchModal, setSearchModal }) => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch()
  const ranking = useSelector(state => state.ranking)
  // useEffect(() => {
  //   if (searchModal) {
  //     document.getElementById("searchModal").focus();
  //     document.addEventListener("keydown", async (e) => {
  //       if (e.key === "Enter") {
  //         let token;
  //         dispatch({ type: 'SET_LOADING', payload: true })
  //         if (e.target.value != '') {
  //           token = await axios.get(`https://unisat.io/brc20-api-v2/brc20/status?ticker=${e.target.value}&start=0&limit=20&complete=&sort=deploy`)
  //         }
  //         else token = await axios.get('https://unisat.io/brc20-api-v2/brc20/status?ticker=&start=0&limit=100&complete=&sort=deploy');
  //         dispatch({ type: 'GET_UNISAT_DATA', payload: token.data.data })
  //         setSearchModal(false);
  //         dispatch({ type: 'SET_LOADING', payload: false })
  //       }
  //       if (e.key === "Escape") {
  //         setSearchModal(false);
  //       }
  //     });
  //   }
  // });

  const search = async (e) => {
    if (searchModal) {
      if (e.key === "Enter") {
        let token;
        dispatch({ type: 'SET_LOADING', payload: true })
        if (e.target.value != '') {
          dispatch({type: 'SET_QUERY', payload: e.target.value})
          token = await axios.get(`https://unisat.io/brc20-api-v2/brc20/status?ticker=${e.target.value}&start=0&limit=20&complete=&sort=deploy`)
        }
        else token = await axios.get(`https://unisat.io/brc20-api-v2/brc20/status?ticker=&start=0&limit=20&complete=&sort=deploy`);
        dispatch({ type: 'GET_UNISAT_DATA', payload: token.data.data })
        // setSearchModal(false);
        dispatch({ type: 'SET_LOADING', payload: false })
      }
      if (e.key === "Escape") {
        dispatch({type: 'SET_QUERY', payload: ''});
        setSearchModal(false);
      }
    }
  }

  const handleClose = () => {
    dispatch({type: 'SET_QUERY', payload: ''});
    setSearchModal(false)
  }
  
  return (
    <div className={`search-modal ${searchModal ? "open dark:bg-[#19122b]" : ""}`}>
      <button onClick={() => handleClose()} className="search-close" style={{right: '1rem'}}>
        <IoCloseCircleOutline />
      </button>
      <input
        type="text"
        style={{paddingLeft: '2rem'}}
        className="form-input bg-body placeholder:text-base dark:bg-[#19122b]"
        id="searchModal"
        placeholder="Type and hit enter..."
        onKeyDown={(e) => search(e)}
      />
    </div>
  );
};

export default SearchModal;
