const router = require('express').Router();
const Workout = require('../models/workout.js');

router.post('/api/workouts', (req, res) => {
  Workout.create({})
  .then((dbWorkout) => {
    res.json(dbWorkout);
  })
  .catch((err)=> {
    res.json(err);
  })
})

router.get('/api/workouts', (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration'
        }
      }
    }
  ])
  .then((dbWorkoutData) => {
    res.json(dbWorkoutData);
  })
  .catch((error) => {
    res.json(error);
  });
});

router.put('/api/workouts/:id', ({ body, params }, res) => {
  Workout.findByIdAndUpdate(
    params.id,
    { $push: { exercises: body } },
    { new: true, runValidators: true }
  )
  .then((dbWorkoutData) => {
    res.json(dbWorkoutData);
  })
  .catch((err) => {
    res.json(err);
  })
})

router.get('/api/workouts/range', (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration'
        }
      }
    }
  ])
  .sort({_id: -1})
  .limit(7)
  .then((dbWorkoutData) => {
    console.log(dbWorkoutData)
    res.json(dbWorkoutData)
  })
  .catch((err)=> {
    res.json(err)
  })
})

router.delete('/api/workouts', ({ body}, res) => {
  Workout.findByUpIdAndDelete(body.id)
  .then(()=> {
    res.json(true);
  })
  .catch((error)=> {
    res.json(error);
  })
})

module.exports = router;