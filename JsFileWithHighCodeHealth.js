import React, { Component } from "react";
import Progress from "./Progress";
import axios from "axios";
import "../App.css";
import { Container, Row, Col, Card, CardImg } from "reactstrap";

const BASE_URL = "http://localhost:8000/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imageUrls: [],
      message: "",
      loaded: 0
    };
  }

  selectImages = event => {
    let images = [];
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }

    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/));
    if (images) {
      let message = `${images.length} valid image(s) selected`;
      this.setState({ images, message });
    }
  };

  uploadImages = () => {
    return this.state.images.map(image => {
      const data = new FormData();
      data.append("image", image, image.name);

      let config = {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      };

      return axios.post(BASE_URL + "upload", data, config).then(response => {
        this.setState({
          imageUrls: [response.data.imageUrl, ...this.state.imageUrls]
        });
      });
    });
  };

  showImages = () => {
    const { imageUrls } = this.state;
    return imageUrls.map((url, i) => {
      return (
        <Col md="3" className="mt-2 mb-2 parent" key={i}>
          <Card>
            <CardImg
              top
              width="100%"
              src={BASE_URL + url}
              alt="Card image cap"
            />
            <p
              className="btn btn-danger btn-sm"
              onClick={() => this.removeItem(i)}
            >
              <i className="fa fa-trash"></i>
            </p>
          </Card>
        </Col>
      );
    });
  };

  removeItem(item) {
    this.setState({
      imageUrls: this.state.imageUrls.filter((x, i) => i !== item)
    });
  }

  render() {
    return (
      <Container>
        <h1 className="text-center">Image Uploader</h1>
        <Progress percentage={this.state.loaded} />
        <Row>
          <Col md="4">
            <input className="mt-2" type="file" onChange={this.selectImages} multiple />
          </Col>
          <Col md="4">
            <button
              className="btn btn-primary mt-2"
              value="Submit"
              onClick={this.uploadImages}
            >
              Submit
            </button>

            <p className="text-info">{this.state.message}</p>
          </Col>
        </Row>
        <Row>{this.showImages()}</Row>
      </Container>
    );
  }
}
export default App;
