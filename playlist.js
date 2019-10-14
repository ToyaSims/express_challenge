const express = require("express");
const uuid = require("uuid");
const app = express();
const path = require("path");
const artists = require("./data.js");

///midlleware body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "index.html")));

//listen on port
const PORT = process.env.PORT || 3090;
app.listen(PORT, () => console.log(`server started on port  ${PORT}`));

//get all
app.get("/", (req, res) => {
  res.json(artists);
});

//get specific
app.get("/:id", (req, res) => {
  res.json(artists.filter(artists => artists.id === parseInt(req.params.id)));
});

// Create Artist
app.post("/", (req, res) => {
  const newArtist = {
    id: uuid.v4(),
    artist: req.body,
    song: req.body
  };

  if (!newArtist.artist) {
    return res.status(400).json({ msg: "Please include a artist " });
  }

  artists.push(newArtist);
  res.json(artists);
});

// Update Artist
app.put("/:id", (req, res) => {
  const found = artists.some(Artist => Artist.id === parseInt(req.params.id));

  if (found) {
    const updateArtist = req.body;
    artists.forEach(Artist => {
      if (Artist.id === parseInt(req.params.id)) {
        Artist.artist = updateArtist.artist
          ? updateArtist.artist
          : Artist.artist;
        res.json({ msg: "Artist updated", Artist });
      }
    });
  } else {
    res.status(400).json({ msg: `No Artist with the id of ${req.params.id}` });
  }
});

// Delete Artist
app.delete("/:id", (req, res) => {
  const found = artists.some(Artist => Artist.id === parseInt(req.params.id));

  if (found) {
    res.json({
      msg: "Artist deleted",
      artists: artists.filter(Artist => Artist.id !== parseInt(req.params.id))
    });
  } else {
    res.status(400).json({ msg: `No Artist with the id of ${req.params.id}` });
  }
});

//sort
app.get("/", (req, res) => {
  artists.sort((a, b) => (a.artist > b.artist ? 1 : -1));
  res.json(artists);
});
