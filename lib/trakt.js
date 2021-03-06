const config = require("../config");

const BASE_URL = "https://api-v2launch.trakt.tv/";
let request = require("request");
request = request.defaults({
  "headers": {
    "Content-Type": "application/json",
    "trakt-api-version": 2,
    "trakt-api-key": config.traktKey
  },
  "baseUrl": BASE_URL,
  "timeout": config.webRequestTimeout * 1000
});

/* Get a single show. */
const getShow = (slug, retry = true) => {
  return new Promise(function(resolve, reject) {
    request("shows/" + slug + "?extended=full,images", (err, res, body) => {
      if (err && retry) {
        resolve(getShow(slug, false));
      } else if (err) {
        reject(err + " with link: 'shows/" + slug + "?extended=full,images'");
      } else if (!body || res.statusCode >= 400) {
        reject("Trakt: Could not find info on show: '" + slug + "'");
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

/* Get a single season of a show. */
const getSeason = (slug, season, retry = true) => {
  return new Promise(function(resolve, reject) {
    request("shows/" + slug + "/seasons/" + season + "/?extended=full,images", (err, res, body) => {
      if (err && retry) {
        resolve(getSeason(slug, season, false));
      } else if (err) {
        reject(err + " with link: 'shows/" + slug + "/seasons/" + season + "/?extended=full,images'");
      } else if (!body || res.statusCode >= 400) {
        reject("Trakt: Could not find info on show: '" + slug + "', season: '" + season + "'");
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

/* Get people watching a given show. */
const getShowWatching = (slug, retry = true) => {
  return new Promise(function(resolve, reject) {
    request("shows/" + slug + "/watching", (err, res, body) => {
      if (err && retry) {
        resolve(getShowWatching(slug, false));
      } else if (err) {
        reject(err + " with link: 'shows/" + slug + "/watching'");
      } else if (!body || res.statusCode >= 400) {
        reject("Trakt: Could not find watching info on: '" + slug + "'");
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
};

module.exports = {
  getShow: getShow,
  getSeason: getSeason,
  getShowWatching: getShowWatching
};
