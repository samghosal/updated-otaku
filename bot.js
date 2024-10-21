const bedrock = require('bedrock-protocol');

const botOptions = {
  host: 'ipaddress', // Server IP
    port: 00000,              // Server Port
      username: 'Sir' // Bot's Username
      };

      const reconnectDelay = 5000; // 5 seconds
      const reconnectTriggerWord = "reconnect"; // Change this to the word that triggers a reconnect
      const disconnectTriggerWord = "disconnect"; // Change this to the word that triggers a complete disconnect
      const logoutTriggerWord = "logout"; // Change this to the word that triggers a logout for a specific period

      let bot;

      function createBot() {
        bot = bedrock.createClient(botOptions);

          bot.on('join', () => {
              console.log('Bot joined the game');
                });

                  bot.on('spawn', () => {
                      console.log('Bot spawned in the world');
                        });

                          bot.on('text', (packet) => {
                              const message = packet.message;
                                  console.log(`Received message: ${message}`);
                                      
                                          // Check for the reconnect trigger word
                                              if (message.includes(reconnectTriggerWord)) {
                                                    console.log('Reconnect trigger word detected, bot will disconnect and reconnect.');
                                                          bot.close();
                                                                setTimeout(createBot, reconnectDelay); // Log back in after 5 seconds
                                                                    }
                                                                        
                                                                            // Check for the disconnect trigger word
                                                                                if (message.includes(disconnectTriggerWord)) {
                                                                                      console.log('Disconnect trigger word detected, bot will disconnect entirely.');
                                                                                            bot.close();
                                                                                                }

                                                                                                    // Check for the logout trigger word with specified duration
                                                                                                        const logoutRegex = new RegExp(`${logoutTriggerWord} (\\d+)`, 'i');
                                                                                                            const logoutMatch = message.match(logoutRegex);
                                                                                                                if (logoutMatch) {
                                                                                                                      const minutes = parseInt(logoutMatch[1], 10);
                                                                                                                            const logoutDuration = minutes * 60 * 1000; // Convert minutes to milliseconds
                                                                                                                                  console.log(`Logout trigger word detected, bot will disconnect for ${minutes} minutes.`);
                                                                                                                                        bot.close();
                                                                                                                                              setTimeout(createBot, logoutDuration); // Log back in after the specified duration
                                                                                                                                                  }
                                                                                                                                                    });

                                                                                                                                                      bot.on('disconnect', (packet) => {
                                                                                                                                                          console.log(`Bot disconnected: ${packet.reason}`);
                                                                                                                                                              // Reconnect after 5 seconds if disconnected for any reason other than the disconnect trigger word
                                                                                                                                                                  if (!packet.reason.includes(disconnectTriggerWord) && !packet.reason.includes(logoutTriggerWord)) {
                                                                                                                                                                        setTimeout(createBot, reconnectDelay);
                                                                                                                                                                            }
                                                                                                                                                                              });

                                                                                                                                                                                bot.on('error', (err) => {
                                                                                                                                                                                    console.log(`Bot error: ${err}`);
                                                                                                                                                                                      });
                                                                                                                                                                                      }

                                                                                                                                                                                      module.exports = {
                                                                                                                                                                                        createBot
                                                                                                                                                                                        };
