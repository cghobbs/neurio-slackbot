var defaults = require('./defaults')

function Client(accessToken) {
  this.request = defaults(accessToken)
}

Client.prototype.user = function () {
  return this.request.get('/users/current')
}

Client.prototype.defaultSensorId = function () {
  return this.request.get('/users/current').then(function (userInfo) {
    return userInfo.locations[0].sensors[0].id
  })
}

Client.prototype.liveSamples = function (sensorId) {
  if (!sensorId) throw new Error('Missing sensorId parameter')
  return this.request.get('/samples/live?sensorId=' + sensorId)
}

Client.prototype.lastSample = function (sensorId) {
  if (!sensorId) throw new Error('Missing sensorId parameter')
  return this.request.get('/samples/live/last?sensorId=' + sensorId)
}

Client.prototype.stats = function (sensorId, start, end, granularity, frequency) {
  if (!sensorId) throw new Error('Missing sensorId parameter')
  if (!start) throw new Error('Missing start parameter')
  return this.request.get({
    uri: '/samples/stats',
    qs: {sensorId: sensorId, start: start, end: end, granularity: granularity, frequency: frequency}
  })
}

Client.prototype.applianceList = function (locationId) {
  return this.request.get('/appliances?locationId=' + locationId)
}

Client.prototype.appliance = function (applianceId) {
  if (!applianceId) throw new Error('Missing applianceId parameter')
  return this.request.get('/appliances/' + applianceId)
}

Client.prototype.applianceEventsRecent = function (locationId, since) {
  if (!locationId) throw new Error('Missing locationId parameter')
  if (!since) throw new Error('Missing since parameter')
  return this.request.get({
    uri: '/appliances/events',
    qs: {locationId: locationId, since:since, perPage: 50}
  })
}

Client.prototype.applianceEvents = function (applianceId, start, end) {
  if (!applianceId) throw new Error('Missing applianceId parameter')
  if (!start) throw new Error('Missing start parameter')
  if (!end) throw new Error('Missing end parameter')
  return this.request.get({
    uri: '/appliances/events',
    qs: {applianceId: applianceId, start:start, end:end}
  })
}

Client.prototype.applianceStats = function (applianceId, start, end) {
  if (!applianceId) throw new Error('Missing applianceId parameter')
  if (!start) throw new Error('Missing start parameter')
  if (!end) throw new Error('Missing end parameter')
  return this.request.get({
    uri: '/appliances/stats',
    qs: {applianceId: applianceId, start:start, end:end}
  })
}


module.exports = Client
