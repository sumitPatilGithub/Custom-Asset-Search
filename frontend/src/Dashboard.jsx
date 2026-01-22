// Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SearchApp from "./SearchApp";
import { jwtDecode }  from 'jwt-decode'
import AuthErrorCard from "./AuthErrorCard";

export default function Dashboard() {
  const [profilePic, setProfilePic] = useState("");
  const [userEmail,setUserEmail]=useState("");
  const [authError,setAuthError]=useState(false)
   useEffect(()=>
       {
           const loadData=async()=>
           {
               const params = new URLSearchParams(window.location.search);
                let user={}
    const token = params.get("token");
    // const email=params.get("email")
    if (token) {
        try {
          user = jwtDecode(token); // decode token
          console.log("Logged in user:", user);

          const profileData = await axios.post("/api/profile", user, {
            withCredentials: true,
          });

          setProfilePic(profileData.data.avatarUrls["16x16"]);
          setUserEmail(user.email);
          localStorage.setItem("profilePic", profileData.data.avatarUrls["16x16"]);
          localStorage.setItem("email", user.email);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setAuthError(true); // show AuthErrorCard
          } else {
            console.error("Error fetching profile:", err);
          }
        }
      } else {
        setProfilePic(localStorage.getItem("profilePic"));
        setUserEmail(localStorage.getItem("email"));
      }
           }
           loadData()
           
       },[])
  return (
   <div style={{ marginTop: "50px", marginInline: "10px" }}>

    {authError??<AuthErrorCard message={"Not Authenticated !"}/>}
  {/* Profile pic at top-right */}
  <img
  onClick={() => {
    window.location.href = "https://test-s2s.refined.site"; // redirect on click
  }}
  src={profilePic}
  alt="profile"
  title={userEmail} // shows email on hover
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    cursor: "pointer", // indicates clickable
  }}
/>

  {/* SearchApp centered */}
  <div style={{marginTop:"80px"}}>
    {
      profilePic!="" ? <SearchApp userEmail={userEmail}/>:"LOADING . . ."
    }
    
  </div>
</div>

  );
}
