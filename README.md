# Discord-Minimal-Role-Control-Bot

This is a minimal bot written in node.js for controlling roles of discord users on a single guild's "server". 
Commands are issued over unauthenticated websocket connections (recommend allowing localhost only, actually lock it down folks).

The following options should be set in the config.json file:

| Param | Description |
| ----- | :----------- |
| host | location of mysql database (used to store queue when discord bot encounters connection issues) |
| localOnly | boolean dictating if headers should be checked for local address |
| user | database user |
| password | database user password |
| db | database which should be connected to (will use bot_queue table) |
| port | database port to connect to |
| discord\_guild_id | id of guild to control |
| discord\_bot_token | bot token from the discord developer interface |

The possible commands over websockets are as follows:

* role\_add < user\_id > < role\_name(case insensitive) >
* role\_remove < user\_id > < role\_name(case insensitive) >

**Please be aware** this has been created in a rather rudimentary fashion at this time to allow a minimal set of abilities. 

The bot must be present in the server where these functions are to be performed.
Enjoy!
