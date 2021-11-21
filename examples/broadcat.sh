curl --request POST \
  'https://youtube.googleapis.com/youtube/v3/liveBroadcasts?part=snippet%2CcontentDetails%2Cstatus&key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data '{"snippet":{"scheduledStartTime":"2021-12-21T18:30:00.000Z","title":"Hello World!!!"},"status":{"privacyStatus":"unlisted"},"contentDetails":{}}' \
  --compressed
