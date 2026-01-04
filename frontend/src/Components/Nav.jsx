// // Components/Nav.jsx
// import Nav from 'react-bootstrap/Nav';
// import { LinkContainer } from 'react-router-bootstrap';

// function MyNavbar() {
//   return (
//     <Nav variant="pills" defaultActiveKey="/location" justify className="bg-secondary p-2">
//       <Nav.Item>
//         <LinkContainer to="/location">
//           <Nav.Link className="text-light">Location</Nav.Link>
//         </LinkContainer>
//       </Nav.Item>

//       <Nav.Item>
//         <LinkContainer to="/circuits">
//           <Nav.Link className="text-light">Circuits</Nav.Link>
//         </LinkContainer>
//       </Nav.Item>

//       <Nav.Item>
//         <LinkContainer to="/assets">
//           <Nav.Link className="text-light">Assets</Nav.Link>
//         </LinkContainer>
//       </Nav.Item>
//     </Nav>
//   );
// }

// export default MyNavbar;
// Components/Nav.jsx
// Components/Nav.jsx
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

function MyNavbar() {
  return (
    <div className="d-flex align-items-center bg-secondary p-2">
      
      {/* App Name on Left */}
      <div className="me-auto text-light fw-bold fs-5">
        Advanced Asset Search
      </div>

      {/* Inline Nav Items */}
      <Nav variant="pills" defaultActiveKey="/dashboard/location" className="d-flex">
        <Nav.Item>
          <LinkContainer to="/dashboard/location">
            <Nav.Link className="text-light fw-bold">Location</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/dashboard/circuits">
            <Nav.Link className="text-light fw-bold">Circuits</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/dashboard/assets">
            <Nav.Link className="text-light fw-bold">Assets</Nav.Link>
          </LinkContainer>
        </Nav.Item>

        <Nav.Item>
          <LinkContainer to="/dashboard/combined">
            <Nav.Link className="text-light fw-bold">Combined Data</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default MyNavbar;
