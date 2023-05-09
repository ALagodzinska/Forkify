import { async } from 'regenerator-runtime';
import { KEY, TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// contain functions to reuse many times
// export const getJSON = async function (url) {
//   try {
//     const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     return data;
//   } catch (err) {
//     // rethrowing an error
//     throw err;
//   }
// };

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          // to know which format we are sending
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrowing an error
    throw err;
  }
};

export const deleteAJAX = async function (url) {
  try {
    fetch(url, {
      method: 'DELETE',
    })
      .then(res => res.text())
      .then(res => console.log(res));
  } catch (err) {
    // rethrowing an error
    throw err;
  }
};

// deleteAJAX(
//   `https:forkify-api.herokuapp.com/api/v2/recipes/644f06a7dfb45d0014b05718?key=${KEY}`
// );

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       // to know which format we are sending
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${data.message} (${response.status})`);

//     return data;
//   } catch (err) {
//     // rethrowing an error
//     throw err;
//   }
// };
