// Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import SearchApp from "./SearchApp";

export default function Dashboard() {
  const [profilePic, setProfilePic] = useState("");
   useEffect(()=>
       {
           const loadData=async()=>
           {
              const profileData=await axios.get("/api/profile",{
               withCredentials:true
              });
              console.log("profileData",profileData);
              setProfilePic(profileData.data.picture)
   
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
