import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    id:{
        type: String, required: true
    },
    name:{
        type: String, required: true
    },
    company:{
        type: String, required: true
    },
    description:{
        type: String, required: false
    },
    applyLink:{
        type: String, required: true
    },
// }, {
//     timestamps: true //createdAt, updatedAt
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
