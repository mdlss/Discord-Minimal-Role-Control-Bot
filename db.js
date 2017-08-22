var options = require(__dirname + '/options');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : options.storageConfig.host,
  user     : options.storageConfig.user,
  password : options.storageConfig.password,
  database : options.storageConfig.db,
  port     : options.storageConfig.port
});

exports.WriteToRoleQueue = function WriteToRoleQueue(user_id, adding, role) {
  connection.query('INSERT INTO bot_queue (user_id, adding, role) VALUES (?, ?, ?)', [user_id, adding, role], function (error, results, fields) {
    if (error) {
      console.error('unable to queue ' + adding?'addition':'removal' + ' of role ' + role + ' within the database for user ' + user_id + '.')
      throw error
    }
  })
}

exports.PullQueue = function PullQueue(callback) {
  connection.query('SELECT * FROM bot_queue', function (error, results, fields) {
    if (error)
    {
      throw error
    }
    callback(results, ClearQueue)
  })
}

function ClearQueue() {
  connection.query('TRUNCATE TABLE bot_queue')
}
