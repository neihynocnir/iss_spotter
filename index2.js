const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
.then((passTimes) => { printPassTimes(passTimes) })
.catch((error) => { console.log("It did not work: ", error.message);
});

printPassTimes = (passTimes) => {
  for (let pass of passTimes){
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds`);
  }
};
