'use strict';

/**
 * Module dependencies.
 */
var parse = require('csv-parse'),
	mongoose = require('mongoose'),
	Course = mongoose.model('CourseOutcomeAssessmentForm'),
	errorHandler = require('./errors'),
	fs = require('fs'),
	_ = require('lodash');
	require('should');

/**
 * Store the CSV file in a variable and proceed to parse it
 */
 /** need number of students
 		 * grading scale (will be provided)
 		 * avg score
 		 * % students achieving adequate score
 		 */
exports.create = function(req, res) {
	var csv_file = req.body.data;
	var csv_file_str = csv_file.toString();
	
	parse(csv_file_str, {delimiter: ','}, function(err, output){
		
		var description = '';
 		var courseNumber = '';
 		var term = '';
 		var courseTitle = '';
 		var instructor = '';
 		var date = '';
 		var descriptionofInstrument = '';
 		var numberOfStudents = output.length-1;
 		var gradingScale = 0;
 		var averageScore = 0;
 		var scoreForAdequateOutcomeAchievement = 0;
 		var percentOfStudentsAchievingOutcomeAdequately = 0;
 		var averageLikertScaleValue = 0;
 		var instructorComments = '';
 		var totalGradeCount = 0;


 		for (var  i =0; i < output.length; i++) {
 			// Names of students: output[i][0] where i >= 1
 			// Scores of each section: output[i][j] where i & j >=1
 			for (var j = 1; j < output[i].length; j++) {
 				if (i == 0)
 					continue;
 				console.log('Adding '+output[i][j]+' to total scores');
 				averageScore += parseInt(output[i][j]);
 				totalGradeCount++;
 				console.log('Count is '+totalGradeCount+'.');
 			}
 			
 			for (var j = 0; j < output[i].length; j++) {
 				if (i == 0 ) {
 					if (output[i][j] == 'Exam') {
 						// console.log('Exam data is in column '+j+'!');
 						i++;
 						while (i < output.length) {
 							// console.log('adding ' +output[i][j]+' to average score ');
 							avgScore+=parseInt(output[i][j]);
 							i++;
 						}
 						break;
 					}
 				}
 			}
 		}
 		console.log('Total score is: '+averageScore);
 		averageScore /= totalGradeCount;
 		
 		console.log('Average score is: ' +averageScore);

 		// CREATE A NEW COURSE OUTCOME OBJECT AND SAVE THE RESULTS.
 		var course = new Course(); 		
		course.averageScore = averageScore;
		course.numberOfStudents = numberOfStudents;
		console.log(course);
		course.save(function(err) {
			if (err) {
				res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});

				console.log(err);
			} else {
				res.status(200).json(course);
			}
			
		});


	});	
	

};

