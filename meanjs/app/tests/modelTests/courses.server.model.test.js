'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Course = mongoose.model('Course'),
	User = mongoose.model('User'),
	request = require('supertest');

/**
 * Globals
 */
var course, course2, user;

/**
 * Unit tests
 */
describe('Courses Model Unit Tests:', function() {
	
	before(function(done) {
		course = new Course({
			courseTitle: 'CEN3101',
			professorFirstName: 'Full',
			professorLastName: 'Name',
			semester: 'FA2014'
		});
		course2 = new Course({
			courseTitle: 'CEN3101',
			professorFirstName: 'Full',
			professorLastName: 'Name',
			semester: 'FA2014'
		});
		done();

	});

	describe('Method Save', function() {
		it('should begin with no courses', function(done) {
			Course.find({}, function(err, courses) {
				courses.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			course.save(done);
		});

		it('should show an error when try to save a course without first name', function(done) {
			course.professorFirstName = '';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when try to save a course with numbers for first name', function(done) {
			course.professorFirstName = '1234';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error when trying to save a course without a course title', function(done) {
			course.courseTitle = '';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error when trying to save a course with a course title not matching XXX1234', function(done) {
			course.courseTitle = '123ABCd';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error when trying to save a course without a last name', function(done) {
			course.professorLastName = '';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should throw an error when trying to save a course with numbers in the last name', function(done) {
			course.professorLastName = 'asdf123';
			return course.save(function(err) {
				should.exist(err);
				done();
			});
		});
		/*
			Here we are checking against course2 because course gets changed in the above tests, but
			course2 does not. So what is saved in mongo should be equivalent to course 2.
	*/
		it('should be able to find the saved course', function(done) {
			Course.findOne({courseTitle : 'CEN3101'}, function (err, courses) {
  				courses.semester.should.equal(course2.semester);
  				courses.professorLastName.should.equal(course2.professorLastName);
  				courses.professorFirstName.should.equal(course2.professorFirstName);
  				courses.courseTitle.should.equal(course2.courseTitle);
			});
			done();
		});
	});
	
/*
	describe('Should get some courses using the api', function() {

		var url = 'http://localhost:3001';
		request = request(url);
		it('should save a new course', function(done) {
			request
				.get('/courses')
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;
      				courseResponse[0].courseTitle.should.equal(course2.courseTitle);
      				courseResponse[0].semester.should.equal(course2.semester);
      				done();
      			});
		});
		it('should save a new course', function(done) {
			var course3 = new Course({
			courseTitle: 'DEF1034',
			professorFirstName: 'Kyle',
			professorLastName: 'Kyrazis',
			semester: 'SP2015'
			});
			request
				.post('/courses')
				.send(course3)
      			.end(function (err,res) {
      				res.status.should.equal(200);
      				var courseResponse = res.body;

      				console.log(courseResponse);
      				Course.findOne({courseTitle : 'DEF1034'}, function (err, courses) {
						courses.professorLastName.should.equal('Kyrazis');
						done();
					});
			});
		});
		it('should return a file.', function(done) {
			request
				.get('/file/:name')
				.end(function (err,res) {
      				console.log(res);
      				done();
      			});
		});
	});


	/*
		Can't use the .update method offered by mongoose because it ignores the matching that 
		is offered by the created schema. Instead, findOne then change it and save it.
	*/
	/*
	describe('Method update', function() {
		it('should update the courseTitle to COP4600', function(done) {
			course2.courseTitle = 'COP4600';
			Course.findOne({courseTitle : 'CEN3101'}, function(err, courses) {
				courses.courseTitle = 'COP4600';
				courses.save();
				//Should be able to find the newly update course.
				Course.findOne({courseTitle: 'COP4600'}, function(err2, courses2) {
					courses.semester.should.equal(course2.semester);
  					courses.professorLastName.should.equal(course2.professorLastName);
  					courses.professorFirstName.should.equal(course2.professorFirstName);
  					courses.courseTitle.should.equal(course2.courseTitle);
				});
			});
			done();
		});

		it('should not be able to find the old course title', function(done) {
			Course.find({}, function(err,courses) {
				courses.should.have.length(1);
				done();
			});

		});


		it('should update the semester of the course', function(done) {
			course2.semester = 'SP2015';
			Course.findOne({courseTitle : 'COP4600'}, function (err, courses) {
				courses.semester = 'SP2015';
				courses.save();
				Course.findOne({courseTitle: 'COP4600'}, function(err2, courses2) {
					courses.semester.should.equal(course2.semester);
  					courses.professorLastName.should.equal(course2.professorLastName);
  					courses.professorFirstName.should.equal(course2.professorFirstName);
  					courses.courseTitle.should.equal(course2.courseTitle);
				});
			});
			done();
		});
		//TODO
		//Having issues with this one
		it('should not allow courseTitle to become some random string', function(done) {
			Course.findOne({courseTitle : 'COP4600'}, function (err, courses) {
				courses.courseTitle = '123ABCd';
				courses.save(function(err2) {
					should.exist(err2);
					done();
				});
			});
		});

	});
*/

	after(function(done) {
		Course.remove().exec();
		done();
	});

});