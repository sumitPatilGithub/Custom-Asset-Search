// Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SearchApp from "./SearchApp";
import { jwtDecode }  from 'jwt-decode'

export default function Dashboard() {
  const [profilePic, setProfilePic] = useState("");
   useEffect(()=>
       {
           const loadData=async()=>
           {
               const params = new URLSearchParams(window.location.search);
                let user={}
    const token = params.get("token");
    if (token) {
          user = jwtDecode(token); // decode and validate
      console.log("Logged in user:", user);
    }
              const profileData=await axios.post("/api/profile",user,{
               withCredentials:true
              });
              console.log("profileData",profileData);
              setProfilePic(profileData.data.avatarUrls["16x16"])
   
           }
           loadData()
           
       })
  return (
   <div style={{ marginTop: "50px", marginInline: "10px" }}>
  {/* Profile pic at top-right */}
  <img
    src={profilePic}
    alt="profile"
    style={{
      position: "absolute",
      top: 20,
      right: 20,
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    }}
  />

  {/* SearchApp centered */}
  <div style={{marginTop:"80px"}}>
    <SearchApp />
  </div>
</div>

  );
}
