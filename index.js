const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware start
app.use(cors());
app.use(express.json())
// middleware end


// api start

// root api start
app.get('/',(req, res) => {
    res.send('Art-Avero Is Running Perfectly')
});
// root api end

// api end

app.listen(port, () => {
    console.log(`Art-Avero Is Running Perfectly On Port : ${port}`)
});