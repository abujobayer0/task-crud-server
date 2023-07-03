const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes

const uri =
  "mongodb+srv://muna700064:UQplDeMUKmW89FY7@cluster0.rbrmmy7.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const employeeCollection = client
      .db("employee-collection")
      .collection("employes");

    app.post("/create/employee", async (req, res) => {
      const newUser = req.body;
      const result = await employeeCollection.insertOne(newUser);
      console.log(newUser);
      res.send(result);
    });
    app.get("/employes", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const pageSize = 10;

      try {
        const totalCount = await employeeCollection.countDocuments();
        const totalPages = Math.ceil(totalCount / pageSize);

        const result = await employeeCollection
          .find()
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .toArray();

        res.json({
          data: result,
          page: page,
          pageSize: pageSize,
          totalPages: totalPages,
          totalCount: totalCount,
        });
      } catch (error) {
        console.error("Error fetching employees:", error);
        res
          .status(500)
          .json({ error: "An error occurred while fetching employees" });
      }
    });

    app.get("/employes/find", async (req, res) => {
      let { name, mobileNo } = req.query;
      let query = {};
      // Remove any non-digit characters from the mobileNo
      // Remove spaces from the mobileNo
      // mobileNo = mobileNo.toString();

      if (name) {
        // Use a regular expression to perform a case-insensitive search
        query.$or = [
          { firstName: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ];
      }

      // Check if 'mobileNo' parameter exists
      if (mobileNo) {
        query.mobileNo = mobileNo;
      }

      try {
        const result = await employeeCollection.find(query).toArray();
        console.log(name, mobileNo);
        res.send(result);
      } catch (error) {
        console.error("Error executing search query:", error);
        res.status(500).send("An error occurred while searching");
      }
    });

    app.get("/employee/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await employeeCollection.find(query).toArray();
      res.send(result);
    });
    app.put("/employee/update/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const {
        firstName,
        lastName,
        email,
        mobileNo,
        birthDate,
        Gender,
        address,
        country,
        city,
        Skills,
      } = req.body;
      const result = await employeeCollection.updateOne(query, {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNo: mobileNo,
          birthDate: birthDate,
          Gender: Gender,
          address: address,
          country: country,
          city: city,
          Skills: Skills,
        },
      });

      res.send(result);
    });

    app.delete("/employes/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await employeeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.type("html").send(html);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Task!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Task Server!
    </section>
  </body>
</html>
`;
