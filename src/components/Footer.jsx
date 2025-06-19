import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto w-100">
      <Container>
        <Row>
          <Col className="text-center py-3">
            By Ankur Kushwaha
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;