import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
const __dirname = path.resolve();
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// Serve static files from frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route to send React app for all non-API requests
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})
app.get('/dashboard/circuits', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})
app.get('/dashboard/location', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})
app.get('/dashboard/assets', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})
app.get('/dashboard/combined', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
})

// In-memory store (use DB in real apps)
let tokenStore = {};

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  FRONTEND_URL,
  WORKSPACE_ID,
  CLOUD_ID,
  ACCESS_TOKEN,
  EMAIL_ID

} = process.env;
// app.get("/auth/start", (req, res) => {
//   const state = "secureState123"; // generate per session in real apps

//   const scopes = [
//     "read:account",
//     "read:me",
//     //  "read:servicemanagement-insight-objects",
//     //  "read:cmdb-object:jira",
//     //  "read:cmdb-schema:jira",
//     //  "read:cmdb-attribute:jira",
//     //  "read:cmdb-type:jira",
//     //  "read:organization.user:jira-service-management",
//     //  "read:customer.profile:jira-service-management"
//   ].join(" ");

//   const authUrl =
//     `https://auth.atlassian.com/authorize?` +
//     `audience=api.atlassian.com` +
//     `&client_id=${CLIENT_ID}` +
//     `&scope=${encodeURIComponent(scopes)}` +
//     `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
//     `&state=${state}` +
//     `&response_type=code` +
//     `&prompt=consent`;

//   res.redirect(authUrl);
// });


async function getCloudId(accessToken) {
  const res = await axios.get(
    "https://api.atlassian.com/me",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );


   const cloudData=await res.data
   console.log("Cloud Data",cloudData);
   
    return cloudData;
}


// app.get("/auth/callback", async (req, res) => {
//   const { code } = req.query;

//   const tokenRes = await axios.post(
//     "https://auth.atlassian.com/oauth/token",
//     {
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: REDIRECT_URI,
//     }
//   );
  
//   console.log("Code==============>",code);
  
//   const tokens = tokenRes.data;
//     console.log(tokens);
    
//     const cloudData=await getCloudId(tokens.access_token)
//     console.log("cloud data ",cloudData);
    
//   // Store tokens in backend memory/DB
//   tokenStore = tokens;

//   // Save only the access token (or a session token mapping to tokens in DB)
//   res.cookie("cloudData", cloudData, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none",
//     maxAge: tokens.expires_in * 1000, // optional
//     // maxAge:10000
//   });

//   res.redirect(`/dashboard`);
// });




app.post("/api/assets", async (req, res) => {
  try {
    const cloudData = req.cookies.cloudData;
    const {  query, maxResults = 100, startAt = 0 } = req.body;
    // console.log("cloudData ",cloudData);
    const auth = Buffer.from(`${EMAIL_ID}:${ACCESS_TOKEN}`).toString("base64");

    console.log(" Assets cloud Data",cloudData);
    
    // if (!cloudData?.email) {
    //   return res.status(401).json({ error: "Not authenticated" });
    // }
    const body=JSON.stringify({
        qlQuery: query
    })


    const response = await axios.post(
      `https://api.atlassian.com/ex/jira/${CLOUD_ID}/jsm/assets/workspace/${WORKSPACE_ID}/v1/object/aql?includeAttributes=true&maxResults=${maxResults}&startAt=${startAt}`,body,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      }
    );
     res.cookie("cloudData",cloudData, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
     maxAge: 3600000
  });
    const data=await response.data
    // console.log("Data",data);                                                                                
    res.json(data);
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//////////////////////////////// fetch profile /////////////////////////////////////////

app.post("/api/profile",async(req,res)=>
{
    const auth = Buffer.from(`${EMAIL_ID}:${ACCESS_TOKEN}`).toString("base64");
    const accountId=req.body.userId;
    const response = await axios.get(
      `https://s2ssupport-sandbox.atlassian.net/rest/api/3/user?accountId=${accountId}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      }
    );
    const data=await response.data
   
   console.log("Profile handler Called ",data);
    res.cookie("cloudData",data, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
     maxAge: 3600000
  });
  res.json(data)
})




app.listen(4000, () =>
  console.log("Backend running on http://localhost:4000")
);
