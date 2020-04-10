const request = require('request');

const fetchMyIP = (callback) => {
  const url = 'https://api.ipify.org?format=json';

  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  const url = `https://ipvigilante.com/${ip}`;
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude});
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url =`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request (url,(error, response, body)=> {
    if (error) return callback(error, null);
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }

    const passTimes = JSON.parse(body).response;
    callback(null, passTimes );

  })
};

const nextISSTimesForMyLocation = (callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error){
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passTimes);
      });
    });
  });
};



module.exports = {nextISSTimesForMyLocation};