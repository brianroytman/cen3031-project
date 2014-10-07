'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Course = mongoose.model('CourseOutcomeAssessmentForm'),
	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	fs = require('fs'),
	_ = require('lodash');

/**
 * Store the JSON objects for the CourseOutcomeAssessmentForm
 */
exports.create = function(req, res) {
	var course = new Course(req.body);
	course.save(function(err) {
		if (err) {
			console.log('Im throwing an error' + err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Uses phantomjs to render the provided html into a pdf.
 * 'paperSize' sets the size of the pdf generated to be what is normal looking
 * res.download(..) returns the specified file to the front end for downloading
 * Might have to change it so that is returns the url instead of the actual file.
 */
var generatePDF = function (html,id,req,res) {
	phantom.create(function (ph) {
  		ph.createPage(function (page) {
     		page.setContent(html);
     		page.set('paperSize', { format: 'A4'});
     		var path = __dirname + '/pdfs/' + id + '.pdf';
      		page.render(path, function() {
      			ph.exit();
				res.download(path, 'report.pdf', function(err) {
					if(err) {
						console.log('Err' + err);
					}
				});
      		});  	
    	});
  	});

};

/**
 * Uses Handlebarsjs to dynamically populate a html template with a json object.
 */ 
var generateHTML = function(course,filename,req,res) {
	fs.readFile(filename, function(err,data) {
		var template = Handlebars.compile(data.toString());
		var result = template(course);
		generatePDF(result,course._id,req,res);
	});
};

/**
 * Creates a pdf form based of the specified courseOutcomeEvaluationForm
 */
exports.read = function(req, res) {
	var filename = __dirname + '/pdfModels/CourseOutcomeAssessmentForm.html';
	generateHTML(req.course,filename,req,res);
};



/**
 * Update a courseOutcomeAssessmentForm
 */
exports.update = function(req, res) {
	var course = req.course;

	course = _.extend(course, req.body);

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Delete a courseOutcomeAssessmentForm
 */
exports.delete = function(req, res) {
	var course = req.course;

	course.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * List of courseOutcomeAssessmentForms
 */
exports.list = function(req, res) {
	//TODO fix this sort. Should sort by date not instructor. Set as instructor
	//because I was running into errors in my tests where Date would be the same
	//so I couldn't reasonably predict the behavior of the response.
	Course.find().sort('instructor').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});

};

/**
 * CourseOutcomeAssessmentForm middleware used to 
 */
exports.courseOutcomeAssessmentByID = function(req, res, next, id) {
	Course.findById(id).populate('user', 'displayName').exec(function(err, course) {
		if (err) return next(err);
		if (!course) return next(new Error('Failed to load course ' + id));
		req.course = course;
		next();
	});
};

/**
 * Not currently used, but will most likely need later.
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.course.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
