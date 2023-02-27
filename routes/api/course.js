// let path=require('path');
let courseModel = require('../../models/Course');
let lectureModel = require('../../models/Lecture');
let usermodel = require('../../models/User');
let catmodel = require('../../models/Category');
let express = require('express');
let router = express.Router();
const auth = require('../../middlewares/auth');
const passport = require('passport');

router.post(
  '/course/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.body) return res.status(400).json('request body is missing');
    catmodel.find({ categoryName: req.body.category }, function (error, cat) {
      if (!error && cat.length !== 0) req.body.category = cat[0]._id;
      const model = new courseModel(req.body);
      model
        .save()
        .then((doc) => {
          if (!doc || doc.length === 0) return res.status(500).send(doc);
          res.status(200).json(doc);
        })
        .catch((err) => res.status(500).json(err));
    });
  }
);

// ?query=html
router.get('/courses', async (req, res, next) => {
  const { query, limit } = req.query;
  const match = {};
  if (query) {
    match.courseName = { $regex: query, $options: 'i' };
  }
  courseModel
    .find(match)
    .populate({ path: 'category', model: 'category' })
    .populate({ path: 'instructor', model: 'users' })

    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      if (results) {
        return res.json(results);
      }
    });
});

router.get('/course', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  courseModel
    .findOne({
      _id: req.query.id,
    })

    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//get courses by instructor id
router.get(
  '/coursebyinstructor',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('sdfjsflk');
    try {
      const doc = await courseModel
        .find({ instructor: req.user._id })
        .populate({ path: 'category', model: 'category' })
        .populate({ path: 'instructor', model: 'users' });
      // const courseId = doc._id;
      // const lectures = await lectureModel.find({});
      // console.log(lectures, doc);
      // const toSeconds = (lecture) => {
      //   if (lecture?.duration) {
      //     var minutes = Number(lecture?.duration?.minutes);
      //     var seconds = Number(lecture?.duration?.seconds);
      //     return seconds + minutes * 60;
      //   }
      //   return 0;
      // };
      // const sum = (a = 0, b) => a + b;
      // Assuming your array is named 'arr'
      // var totalSeconds = lectures.map(toSeconds);
      // console.log(totalSeconds, "total");
      res.json(doc);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

router.put('/course/', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  courseModel
    .findOneAndUpdate(
      {
        _id: req.query.id,
      },
      req.body,
      {
        new: true,
      }
    )
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete('/course', (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  courseModel
    .findOneAndRemove({
      _id: req.query.id,
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// ?query=${inputValue}
router.get('/courses/search', async (req, res) => {
  const { query } = req.query;
  console.log(query, 'query');
  if (!query) res.status(201).send([]);
  const courses = await courseModel.aggregate([
    { $match: { courseName: { $regex: query, $options: 'i' } } },
    // { $project: { courseName: 1 } },
  ]);
  res.status(200).send(courses);
  console.log(courses, 'cour');

  // res.status(500).json();
});

module.exports = router;
