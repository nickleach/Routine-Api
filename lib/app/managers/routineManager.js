import Routine from '../models/routine';
import moment from 'moment';

function createRoutine(routineModel, userId, next) {
    let routine = new Routine();
    routine.name = routineModel.name;
    routine.style = routineModel.style;
    routine.desiredFrequency = routine.style === '4-day' ? 4 : routineModel.desiredFrequency;
    routine.startDate = routineModel.startDate;
    routine.createdDate = moment().valueOf();
    routine.modifiedDate = moment().valueOf();
    routine.userId = userId;

    console.log(`Creating new routine: ${routine}`);

    return routine.save((err) => {
        if (err) {
            console.log(`Error creating routine : ${err}`);
            return next(err);
        }
        console.log("routine Created");
        return routine;
    });
}

function getRoutines(userId, next) {
    return promises.getRoutines(userId, (err, routines) => {
        if (err) {
            console.log(`Error getting routines: ${err}`)
            return next(err);
        }
        return routines;
    });
}

function getRoutine(routineId, next) {
    return promises.getRoutine(routineId, (err, routine) => {
        if (err) {
            console.log(`Error getting routines: ${err}`)
            return next(err);
        }
        if (!routine) {
            let notFound = new Error("routine not found");
            notFound.status = 404;
            return next(notFound);
        }
        return routine;
    });
}

function updateRoutine(routineId, routineModel, next) {
    return promises.getRoutine(routineId, (err, routine) => {
        if (err) {
            console.log(`Error getting routines: ${err}`)
            return next(err);
        }
        if (!routine) {
            let notFound = new Error("routine not found");
            notFound.status = 404;
            return next(notFound);
        }
        if (routineModel.name) routine.name = routineModel.name;
        if (routineModel.style) routine.style = routineModel.style;
        if (routineModel.startDate) routine.startDate = routineModel.startDate;
        if (routineModel.desiredFrequency) routine.desiredFrequency = routineModel.desiredFrequency;
        routine.modifiedDate = moment().valueOf();

        routine.save((err) => {
            if (err) {
                next(err);
            }
            console.log(`Updating routine: ${routine}`);
        });
    });
}

function deleteRoutine(routineId, next) {
    return Routine.remove({
        _id: routineId
    }, (err, routine) => {

        if (!routine) {
            var notFound = new Error("routine not found");
            notFound.status = 404;
            return next(notFound);
        }

        if (err) {
            console.log(`Error deleting routine: ${err}`);
            next(err);
        }

        console.log("Routine Deleted");
    });
}

function deleteAllRoutinesForUser(userId, next) {
    return Routine.remove({
        userId
    }, (err, routine) => {
        if (err) {
            console.log(`Error deleting routine: ${err}`);
            next(err);
        }
        console.log(`Deleted all routines for user: ${userId}`);
    });
}

const promises = {
    getRoutines(userId, callback) {
        return Routine.find({
            userId
        }, (err, routines) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, routines);
            }
        });
    },
    getRoutine(routineId, callback) {
        return Routine.findById(routineId, (err, routine) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, routine);
            }
        });
    }
}
export {
    createRoutine,
    deleteRoutine,
    deleteAllRoutinesForUser,
    getRoutines,
    getRoutine,
    updateRoutine,
}
