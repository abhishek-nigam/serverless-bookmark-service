import { useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { object as yupObject, string as yupString } from "yup";
import Header from "../elements/Header";
import { functionsBaseURL } from "../../constants";

const initialAlertData = {
  show: false,
  variant: "success", // success|failure
  message: "",
};

function CreateBookmark() {
  const [alertData, setAlertData] = useState(initialAlertData);

  function showAlert(message, variant) {
    setAlertData({
      message: message,
      show: true,
      variant: variant,
    });

    setTimeout(() => {
      setAlertData(initialAlertData);
    }, 3000);
  }

  return (
    <>
      <Header />
      <Container className="pt-3">
        {alertData.show && (
          <Alert
            variant={alertData.variant}
            dismissible
            onClose={() => {
              setAlertData(initialAlertData);
            }}
          >
            {alertData.message}
          </Alert>
        )}
        <Formik
          initialValues={{ address: "" }}
          validationSchema={yupObject().shape({
            address: yupString().trim().required().url().label("Address"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            makeCreateBookmarkAPICall(
              { address: values.address },
              setSubmitting,
              showAlert
            );
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
          }) => {
            return (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="address">
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
                  {errors.address && (
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  <span>Save</span>
                  {isSubmitting && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="ml-1"
                    />
                  )}
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </>
  );
}

function makeCreateBookmarkAPICall({ address }, setSubmitting, showAlert) {
  fetch(`${functionsBaseURL}/bookmark`, {
    method: "post",
    body: JSON.stringify({
      address: address,
      title: "Test title",
      tags: ["tag1", "tag2"],
    }),
  })
    .then((response) => {
      if (response.ok) {
        showAlert("Saved successfully", "success");
        setSubmitting(false);
      } else {
        showAlert("Error in saving", "danger");
        setSubmitting(false);
      }
    })
    .catch((error) => {
      console.error(`Error in saving bookmark. Error: ${error}`);

      showAlert(
        "Couldn't save. Please check your internet connection",
        "danger"
      );
      setSubmitting(false);
    });
}

export default CreateBookmark;
