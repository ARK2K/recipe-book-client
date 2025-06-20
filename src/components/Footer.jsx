import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white w-100 py-3 mt-auto">
      <Container>
        <Row>
          <Col className="text-center">
            By Ankur Kushwaha
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;