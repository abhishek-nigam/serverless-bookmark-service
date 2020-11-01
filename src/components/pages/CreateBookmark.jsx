import Header from "../elements/Header";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Toast from "react-bootstrap/Toast";
import { Formik } from "formik";
import { object, string } from "yup";
import { functionsBaseURL } from "../../constants";
import { useState } from "react";
import { nanoid } from "nanoid";

function CreateBookmark() {
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({
    toastHeader: "",
    toastBody: "",
    toastHasError: false,
  });
  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  function tagClickHandler(tag) {
    setTags(
      tags.map((el) => {
        if (el.id !== tag.id) {
          return el;
        } else {
          return {
            ...el,
            active: !el.active,
          };
        }
      })
    );
  }

  function tagAddButtonClickHandler() {
    setTags([
      ...tags,
      ...tagInputValue.split(",").map((value) => ({
        id: nanoid(),
        name: value.trim(),
        active: true,
      })),
    ]);
    setTagInputValue("");
  }

  function saveBookmark(values, setSubmitting) {
    fetch(`${functionsBaseURL}/bookmark`, {
      method: "post",
      body: JSON.stringify({
        title: values.title.trim(),
        address: values.address.trim(),
        tags: tags.filter((tag) => tag.active).map((tag) => tag.name),
      }),
    })
      .then((response) => {
        if (response.ok) {
          setToastData({
            toastHeader: "Success",
            toastBody: "Bookmark successfully saved",
            toastHasError: false,
          });
        } else {
          setToastData({
            toastHeader: "Error",
            toastBody: "Error in saving bookmark",
            toastHasError: false,
          });
        }
        setShowToast(true);
        setSubmitting(false);
      })
      .catch((err) => {
        setToastData({
          toastHeader: "Error",
          toastBody: "Error in saving bookmark",
          toastHasError: true,
        });
        setShowToast(true);
        setSubmitting(false);
      });
  }

  return (
    <>
      <Header />
      <Container className="pt-3">
        <Row>
          <Col>
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              autohide={3000}
            >
              <Toast.Header>
                <strong
                  className={`mr-auto ${
                    toastData.toastHasError ? "text-danger" : "text-success"
                  }`}
                >
                  {toastData.toastHeader}
                </strong>
              </Toast.Header>
              <Toast.Body>{toastData.toastBody}</Toast.Body>
            </Toast>
            <Formik
              initialValues={{ title: "", address: "" }}
              validationSchema={object().shape({
                title: string().trim().required(),
                address: string().trim().required().url(),
              })}
              onSubmit={(values, { setSubmitting }) => {
                saveBookmark(values, setSubmitting);
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
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="test"
                      name="title"
                      placeholder="Enter title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.title && errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
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
                  <div className="my-2">
                    {tags.map((tag) => (
                      <Button
                        size="sm"
                        variant={tag.active ? "success" : "light"}
                        className="mr-1 mb-1"
                        key={tag.id}
                        onClick={() => tagClickHandler(tag)}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                  <Form.Group controlId="formTag">
                    <Form.Label>Tag</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        name="tag"
                        placeholder="Enter tag"
                        className="mr-2"
                        value={tagInputValue}
                        onChange={(e) => setTagInputValue(e.target.value)}
                      />
                      <Button
                        onClick={() => tagAddButtonClickHandler()}
                        disabled={tagInputValue.trim().length === 0}
                      >
                        Add
                      </Button>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    block
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
