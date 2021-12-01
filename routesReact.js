module.exports = function() {
    const express = require("express");
    const cors = require('cors');
    const app = express();

    app.use(cors())

    app.delete("/", (req, res) => {
        removeUserFromQueue(req.query.id);
    });

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, console.log(`Server started on port ${PORT}`));
}
