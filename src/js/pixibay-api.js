import axios from 'axios';

const API_KEY = '44796717-c9697056d5a7f56baa85540ad';
const BASE_URL = 'https://pixabay.com/api/';
axios.defaults.baseURL = BASE_URL;

function getPicture({ q = '', page = 1, per_page = 15 } = {}) {
  return axios
    .get('', {
      params: {
        key: API_KEY,
        q,
        page,
        per_page,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(({ data }) => data);
}

export { getPicture };
