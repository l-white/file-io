const { parse } = require('csv-parse')
const fs = require('fs')
const path = require('path')

const spotifyArtists = []
const songsInKeyOfE = []

// find most popular artist
const columnToAnalyze = 'artist(s)_name'
const columnValues = []
const counts = {}
let mostCommonValue = null
let maxCount = 0

// function to find the number of songs in the key of E
function keyOfE(artist) {
  return artist['key'] === 'E'
}

fs.createReadStream(path.join(__dirname, 'data', 'spotify-2023.csv'))
  .pipe(parse({
    columns: true
  }))
  .on('data', (data) => {
    spotifyArtists.push(data)

    if (keyOfE(data)) {
      songsInKeyOfE.push(data)
    }
  })
  .on('data', (row) => {
    const columnValue = row[columnToAnalyze];

    if (columnValue) {
      columnValues.push(columnValue);
    }
  })
  .on('error', (err) => {
    console.log(err)
  })
  .on('end', () => {

  
  columnValues.forEach((value) => {
    !counts[value] ? counts[value] = 1 : counts[value]++

    if (counts[value] > maxCount) {
      mostCommonValue = value;
      maxCount = counts[value];
    }
  });

  // Log the results to the console
  console.log(`There are ${spotifyArtists.length} songs in this list.`)
  console.log(`There are ${songsInKeyOfE.length} songs in the key of E.`)
  console.log(`The most popular artist is ${mostCommonValue} with ${maxCount} songs.`);
  })