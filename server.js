const express = require('express');
const app = exress();
const PORT = 3000;

app.get('/', (req,res) => {
  res.send("Success");
})

app.listen(PORT, () => {
  console.log("Listening on port, " + PORT);
})
