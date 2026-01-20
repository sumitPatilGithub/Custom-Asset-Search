

// import Nav from 'react-bootstrap/Nav';
// import { LinkContainer } from 'react-router-bootstrap';
// import { useLocation } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { useGridData } from './GridDataContext';
// // import { useGridData } from './GridDataContext';



// function MyNavbar() {
//   const location = useLocation();
//   const { gridDataMap, loadingMap } = useGridData();

//   const activeRoute = location.pathname;
//   const isCombined = activeRoute === "/combined";
//   const isLoading = loadingMap[activeRoute] === true;

//   const downloadExcel = () => {
//     const data = gridDataMap[activeRoute];
//      console.log("Is Disabled",isCombined);
//      console.log("Is Loading",isLoading);
     
//     if (!data || data.length === 0) {
//       alert("No filtered data to download");
//       return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
//     XLSX.writeFile(
//       workbook,
//       `${activeRoute.replace("/", "")}_filtered.xlsx`
//     );
//   };

//   return (
//     <div className="d-flex align-items-center bg-secondary p-2">

//       <div className="me-auto text-light fw-bold fs-5">
//         Advanced Asset Search
//       </div>

//       <Nav variant="pills" activeKey={activeRoute}>

//         <Nav.Item>
          
//           <button style={{marginRight:"5px"}} type="button" onClick={downloadExcel}
//               disabled={isLoading}
            
//           class="btn btn-warning">⬇ Export</button>
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
import { useState } from "react";
import { useGridData } from './GridDataContext';

import ModalDialog, {
  ModalTransition,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@atlaskit/modal-dialog";
import Textfield from "@atlaskit/textfield";
import Button from "@atlaskit/button/new";

function MyNavbar() {
  const location = useLocation();
  const { gridDataMap, loadingMap } = useGridData();

  const activeRoute = location.pathname;
  const isCombined = activeRoute === "/combined";
  const isLoading = loadingMap[activeRoute] === true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const openModal = () => {
    const data = gridDataMap[activeRoute];
    if (!data || data.length === 0) {
      alert("No filtered data to download");
      return;
    }
    setFileName(`${activeRoute.replace("/", "")}_filtered`);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const downloadExcel = () => {
    const data = gridDataMap[activeRoute];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, `${fileName || "export"}.xlsx`);
    closeModal();
  };

  return (
    <>
      <div className="d-flex align-items-center bg-secondary p-2">
        <div className="me-auto text-light fw-bold fs-5">
          Advanced Asset Search
        </div>

        <Nav variant="pills" activeKey={activeRoute}>
          <Nav.Item>
            <button
              style={{ marginRight: "5px" }}
              type="button"
              onClick={openModal}
              disabled={isLoading}
              className="btn btn-warning"
            >
              ⬇ Export
            </button>
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

      {/* Atlaskit Modal */}
      <ModalTransition>
        {isModalOpen && (
          <ModalDialog onClose={closeModal}>
            <ModalHeader>
              <ModalTitle>Export Excel</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <label className="mb-1 fw-bold">File name</label>
              <Textfield
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                autoFocus
              />
            </ModalBody>

            <ModalFooter>
              <Button appearance="subtle" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                onClick={downloadExcel}
                isDisabled={!fileName}
              >
                Download
              </Button>
            </ModalFooter>
          </ModalDialog>
        )}
      </ModalTransition>
    </>
  );
}

export default MyNavbar;
