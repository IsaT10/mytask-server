const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config({ path: "./config.env" });

const app = express();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cruea6x.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.use(express.json());
app.use(cors());

async function run() {
  try {
    const Tasks = client.db("mytaskmanager").collection("tasks");

    app.get("/tasks", async (req, res) => {
      try {
        const query = Tasks.find();
        const tasks = await query.toArray();

        res.send({
          success: true,
          data: tasks,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.get("/completetask", async (req, res) => {
      try {
        const query = Tasks.find({ completed: true });
        const tasks = await query.toArray();

        res.send({
          success: true,
          data: tasks,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.post("/addtask", async (req, res) => {
      try {
        const task = await Tasks.insertOne(req.body);

        res.send({
          success: true,
          data: task,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.patch("/completetask/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const task = await Tasks.updateOne(
          { _id: ObjectId(id) },
          {
            $set: { ...req.body },
          }
        );

        res.send({
          success: true,
          data: task,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await Tasks.deleteOne({
          _id: ObjectId(id),
        });

        res.send({
          success: true,
          message: `Successfully deleted the task`,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

run().catch((err) => console.error(err));

app.get('/', (req, res) => res.json({ message: 'Server running successfully' }))

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
