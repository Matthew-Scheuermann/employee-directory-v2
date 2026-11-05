import express from "express";
import { getEmployee, getEmployees, getRandomEmployee } from "#db/employees";

const app = express();

app.use(express.json());

app.post("/employees", (req, res) => {
  const name = req.body?.name;

  if (!name) {
    return res.status(400).send("A name is required.");
  }

  const employees = getEmployees();
  const newEmployee = { id: employees.length + 1, name };
  employees.push(newEmployee);

  res.status(201).send(newEmployee);
});

export default app;

app.get("/", (req, res) => {
  res.send("Hello employees!");
});

app.get("/employees", (req, res) => {
  const employees = getEmployees();
  res.send(employees);
});

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
app.get("/employees/random", (req, res) => {
  const employee = getRandomEmployee();
  res.send(employee);
});

app.get("/employees/:id", (req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = getEmployee(+id);

  if (!employee) {
    return res.status(404).send(`Employee #${id} not found.`);
  }

  res.send(employee);
});
