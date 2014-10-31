'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	CourseCommittee = mongoose.model('CourseCommitteeEvaluationForm'),
	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	fs = require('fs'),
	_ = require('lodash');

/**
 * Store the JSON objects for the CourseCommitteeEvaluationForm
 */
exports.create = function(req, res, next) {
	// console.log('body: '+require('util').inspect(req.body));
	var courseCommittee = new CourseCommittee(req.body);
	courseCommittee.save(function(err) {
		if (err) {
			res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(200).json(courseCommittee);
		}
		next();
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
var generateHTML = function(courseComittee,filename,req,res) {
	fs.readFile(filename, function(err,data) {
		var template = Handlebars.compile(data.toString());
		var result = template(courseComittee);
		generatePDF(result,courseComittee._id,req,res);
	});
};

/**
 * Creates a pdf form based of the specified courseCommitteeEvaluationForm
 */
exports.read = function(req, res) {
	var filename = __dirname + '/pdfModels/CourseCommitteeEvaluationForm.html';
	generateHTML(req.courseComittee,filename,req,res);
};



/**
 * Update a courseCommitteeEvaluationForm
 */
exports.update = function(req, res) {
	var courseComittee = req.courseComittee;

	courseComittee = _.extend(courseComittee, req.body);

	courseComittee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courseComittee);
		}
	});
};

/**
 * Delete a courseCommitteeEvaluationForm
 */
exports.delete = function(req, res) {
	var courseComittee = req.courseComittee;

	courseComittee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courseComittee);
		}
	});
};

/**
 * List of courseCommitteeEvaluationForms
 */
exports.list = function(req, res) {
	//TODO fix this sort. Should sort by date not instructor. Set as instructor
	//because I was running into errors in my tests where Date would be the same
	//so I couldn't reasonably predict the behavior of the response.
	CourseCommittee.find().sort('courseCommitteeParticipants').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(courses);
		}
	});

};

/**
 * CourseCommitteeEvaluationForm middleware used to 
 */
exports.courseCommitteeEvaluationByID = function(req, res, next, id) {
	CourseCommittee.findById(id).populate('user', 'displayName').exec(function(err, courseComittee) {
		if (err) return next(err);
		if (!courseComittee) return next(new Error('Failed to load course committee ' + id));
		req.courseComittee = courseComittee;
		next();
	});
};

/**
 * Not currently used, but will most likely need later.
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.courseComittee.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
