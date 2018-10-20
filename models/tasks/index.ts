import { Document, Schema, Model, model, connection } from "mongoose";
import { ITask } from './interfaces';
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(connection);



export interface ITaskModel extends ITask, Document {
  // fullName(): Promise<string>
}

export const TaskSchema: Schema = new Schema({
  name: { type: Schema.Types.String, required: true },
  desc: { type: Schema.Types.String, required: true },
  startAt: Schema.Types.Date,
  endAt: Schema.Types.Date,
  rate: Schema.Types.Number
}, { versionKey: false });


TaskSchema.plugin(autoIncrement.plugin, 'Task');

TaskSchema.set('toJSON', {
  transform: function (doc: any, ret: any, options: any) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Task: Model<ITaskModel> = model<ITaskModel>("Task", TaskSchema);