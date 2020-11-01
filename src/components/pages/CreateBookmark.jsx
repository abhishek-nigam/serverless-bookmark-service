import Header from "../elements/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Formik } from "formik";
import { object, string } from "yup";
import { functionsBaseURL } from "../../constants";

function CreateBookmark() {
  return (
    <>
      <Header />
      <Container className="pt-3">
        <Row>
          <Col>
            <Formik
              initialValues={{ address: "", tags: "" }}
              validationSchema={object().shape({
                address: string().trim().required().url(),
                tags: string(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                fetch(`${functionsBaseURL}/bookmark`, {
                  method: "post",
                  body: JSON.stringify({
                    address: values.address.trim(),
                    tags: values.tags.trim().split(","),
                  }),
                })
                  .then((data) => {
                    console.log(data);
                    setSubmitting(false);
                  })
                  .catch((err) => {
                    console.error(err);
                    setSubmitting(false);
                  });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="url"
                      name="address"
                      placeholder="Enter address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.address && errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formTags">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      name="tags"
                      placeholder="Enter tags"
                      value={values.tags}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.tags && errors.tags}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.tags}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Separate multiple tags with commas
                    </Form.Text>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateBookmark;
