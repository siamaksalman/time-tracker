#!/usr/bin/env node
const argv = require('optimist').argv;
import { Task } from "./models/tasks";
import { connect } from "./ds/mongoose";




async function app() {
  if (argv.add) {
    const new_task = new Task(argv);
    new_task.startAt = Date.now();
    await new_task.save();
    console.log(new_task.toJSON());
  }
  else if (argv.end) {
    const task = await Task.findById(argv.id);
    if (task.endAt) {
      console.log(task.toJSON());
      throw new Error("This task has already eneded");
    }
    task.endAt = Date.now();
    await task.save();
    console.log(task.toJSON());
  }
  else if (argv.list) {
    let tasks;
    if (argv.from) {
      tasks = await Task.find({
        startAt: { $gt: argv.from }
      });
    }
    else if (argv.to) {
      tasks = await Task.find({
        endAt: { $lt: argv.to }
      });
    }
    else if (argv.from && argv.to) {
      tasks = await Task.find({
        startAt: {
          $gt: argv.from,
        },
        endAt: {
          $lt: argv.to
        }
      });
    }
    else {
      tasks = await Task.find();
    }
    let sum = 0;
    for (let i = 0; i < tasks.length; i++) {
      let total: any = (tasks[i].endAt - tasks[i].startAt) / 3600000;
      if (total) {
        sum += total;
      }
      total = total.toFixed(2) + "h";
      console.log({ ...tasks[i].toJSON(), total })
    }
    console.log(`Sum: ${sum.toFixed(2)}h`);
  }


}



async function init() {
  try {
    await connect();
    await app();
    process.exit(0);
  }
  catch (e) {
    console.log(e.message);
    process.exit(1);
  }
}

init();