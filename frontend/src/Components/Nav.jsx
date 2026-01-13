// // // Components/Nav.jsx
// // import Nav from 'react-bootstrap/Nav';
// // import { LinkContainer } from 'react-router-bootstrap';

// // function MyNavbar() {
// //   return (
// //     <Nav variant="pills" defaultActiveKey="/location" justify className="bg-secondary p-2">
// //       <Nav.Item>
// //         <LinkContainer to="/location">
// //           <Nav.Link className="text-light">Location</Nav.Link>
// //         </LinkContainer>
// //       </Nav.Item>

// //       <Nav.Item>
// //         <LinkContainer to="/circuits">
// //           <Nav.Link className="text-light">Circuits</Nav.Link>
// //         </LinkContainer>
// //       </Nav.Item>

// //       <Nav.Item>
// //         <LinkContainer to="/assets">
// //           <Nav.Link className="text-light">Assets</Nav.Link>
// //         </LinkContainer>
// //       </Nav.Item>
// //     </Nav>
// //   );
// // }

// // export default MyNavbar;
// // Components/Nav.jsx
// // Components/Nav.jsx
// import Nav from 'react-bootstrap/Nav';
// import { LinkContainer } from 'react-router-bootstrap';
// import { useLocation } from "react-router-dom";
// import { useGridData } from './GridDataContext';
// import * as XLSX from "xlsx";

// function MyNavbar() {
  
//   const location = useLocation();
//   const { gridDataMap ,loadingMap } = useGridData();

//   const downloadExcel = () => {
//     const route = location.pathname;
//     const data = gridDataMap[route];

//     if (!data || data.length === 0) {
//       alert("No filtered data to download");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
//     XLSX.writeFile(
//       workbook,
//       `${route.replace("/", "") || "data"}_filtered.xlsx`
//     );
//   };
//   return (
//     <div className="d-flex align-items-center bg-secondary p-2">
      
//       {/* App Name on Left */}
//       <div className="me-auto text-light fw-bold fs-5">
//         Advanced Asset Search
//       </div>

//       {/* Inline Nav Items */}
//       <Nav variant="pills" 
//         activeKey={location.pathname}
//         className="d-flex">

//           <Nav.Item>
//           <button
//             className="btn btn-light btn-sm me-3"
//             onClick={downloadExcel}
//           >
//             ⬇ Download Excel
//           </button>
//         </Nav.Item>

//         <Nav.Item>
//           <LinkContainer to="/location">
//             <Nav.Link className="text-light fw-bold">Location</Nav.Link>
//           </LinkContainer>
//         </Nav.Item>

//         <Nav.Item>
//           <LinkContainer to="/circuits">
//             <Nav.Link className="text-light fw-bold">Circuits</Nav.Link>
//           </LinkContainer>
//         </Nav.Item>

//         <Nav.Item>
//           <LinkContainer to="/assets">
//             <Nav.Link className="text-light fw-bold">Assets</Nav.Link>
//           </LinkContainer>
//         </Nav.Item>

//         <Nav.Item>
//           <LinkContainer to="/combined">
//             <Nav.Link className="text-light fw-bold">Combined Data</Nav.Link>
//           </LinkContainer>
//         </Nav.Item>
//       </Nav>
//     </div>
//   );
// }

// export default MyNavbar;

import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { useGridData } from './GridDataContext';



function MyNavbar() {
  const location = useLocation();
  const { gridDataMap, loadingMap } = useGridData();

  const activeRoute = location.pathname;
  const isCombined = activeRoute === "/combined";
  const isLoading = loadingMap["/combined"] === true;

  const downloadExcel = () => {
    const data = gridDataMap[activeRoute];
     console.log("Is Disabled",isCombined);
     console.log("Is Loading",isLoading);
     
    if (!data || data.length === 0) {
      alert("No filtered data to download");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(
      workbook,
      `${activeRoute.replace("/", "")}_filtered.xlsx`
    );
  };

  return (
    <div className="d-flex align-items-center bg-secondary p-2">

      <div className="me-auto text-light fw-bold fs-5">
        Advanced Asset Search
      </div>

      <Nav variant="pills" activeKey={activeRoute}>

        <Nav.Item>
          {/* <Button
            onClick={downloadExcel}
              disabled={isLoading}
            title={
              isCombined && isLoading
                ? "Please wait, combined data is loading"
                : "Download filtered data"
            }
            appearance="primary"
          >
             Excel
          </Button> */}
          <button style={{marginRight:"5px"}} type="button" onClick={downloadExcel}
              disabled={isLoading}
            title={
              isCombined && isLoading
                ? "Please wait, combined data is loading"
                : "Download filtered data"
            }class="btn btn-warning">⬇ Export</button>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/location">
            <Nav.Link className="text-light fw-bold">Location</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/circuits">
            <Nav.Link className="text-light fw-bold">Circuits</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/assets">
            <Nav.Link className="text-light fw-bold">Assets</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/combined">
            <Nav.Link className="text-light fw-bold">Combined Data</Nav.Link>
          </LinkContainer>
        </Nav.Item>

      </Nav>
    </div>
  );
}

export default MyNavbar;
