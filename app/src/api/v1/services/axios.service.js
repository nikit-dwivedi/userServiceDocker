const axios = require("axios").default;

async function axiosResponse(response) {
  if (response.status == 200) {
    return !response.data.items ? { status: response.status, message: response.message, data: response.data } : { status: response.data.status, message: response.data.message, data: response.data.items };
  } else {
    return { status: false, message: response.message, data: {} };
  }
}
module.exports = {
  post: async (endpoint, bodyData, headers) => {
    let config = {
      method: "post",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: bodyData,
    };
    if (headers) {
      Object.assign(config.headers, headers)
    }
    return axios(config)
      .then(function (response) {
        return axiosResponse(response);
      })
      .catch(function (error) {
        return axiosResponse(error);
      });
  },
  get: async (endpoint, headers) => {
    let config = {
      method: "get",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (headers) {
      Object.assign(config.headers, headers)
    }
    return axios(config)
      .then(function (response) {
        return axiosResponse(response);
      })
      .catch(function (error) {
        console.log(error.message);
        return axiosResponse(error);
      });
  },
};
