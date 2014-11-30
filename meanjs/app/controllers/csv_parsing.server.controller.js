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
exports.create = function(req, res, next) {
	var csv_file = req.body.data;
	var csv_file_str = csv_file.toString();
	var cols = [2,3,4,5];
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

 		console.log('cols' + cols);
 		console.log(cols.length);
 		var averageScore, totalGradeCount, avgScore;
 		averageScore = totalGradeCount = avgScore = 0;
 		
 		//For each column in the specified parsed columns
 		for (var  i =0; i < cols.length; i++) {
 			// Names of students: output[i][0] where i >= 1
 			// Scores of each section: output[i][j] where i & j >=1
 			console.log(i + 'loop');
 			for (var j = 1; j < output.length; j++) {
 				console.log('Adding '+ j + ' ' + ' ' + (cols[i]-1) + ' ' +output[j][cols[i]-1]+' to total scores');
 				averageScore += parseInt(output[j][cols[i]-1]);
 				totalGradeCount++;
 				//console.log('Count is '+totalGradeCount+'.');
 			}
 			console.log('done with inner loop');
 			/*
 			for (var j = 0; j < output[i].length; j++) {
 				if (i === 0 ) {
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
 			*/
 		}
 		console.log('done with total loop');
 		averageScore /= totalGradeCount;
 		console.log(averageScore);
 		//res.status(200).json({hi: 'hi'});

 		// CREATE A NEW COURSE OUTCOME OBJECT AND SAVE THE RESULTS.
 		var course = {};
		course.averageScore = averageScore;
		course.numberOfStudents = numberOfStudents;
		console.log(course);
		res.status(200).json(course);
		next();
		/*
		course.save(function(err) {
			if (err) {
				console.log(err);
				res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});

				//console.log(err);
			} else {
				res.status(200).json(course);
			}
			next();
			
		});
*/

	});	
	var doLoop = function(cols, output, next) {
		var averageScore, totalGradeCount, avgScore;
 		averageScore = totalGradeCount = avgScore = 0;
		//For each column in the specified parsed columns
		console.log(output[1][1], output[1][2], output[1][3], output[1][4]);
 		for (var  i =0; i < cols.length; i++) {
 			// Names of students: output[i][0] where i >= 1
 			// Scores of each section: output[i][j] where i & j >=1
 			console.log(i + 'loop');
 			for (var j = 1; j < output.length; j++) {
 				console.log('Adding '+ j + ' ' + ' ' + (cols[i]-1) + ' ' +output[j][cols[i]-1]+' to total scores');
 				averageScore += parseInt(output[j][cols[i]-1]);
 				totalGradeCount++;
 				//console.log('Count is '+totalGradeCount+'.');
 			}
 			/*
 			for (var j = 0; j < output[i].length; j++) {
 				if (i === 0 ) {
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
 			*/
 		}
 		console.log('done with total loop');
 		averageScore /= totalGradeCount;
 		console.log(averageScore);
 		//res.status(200).json({hi: 'hi'});

 		// CREATE A NEW COURSE OUTCOME OBJECT AND SAVE THE RESULTS.
 		var course = {};
		course.averageScore = averageScore;
		course.numberOfStudents = numberOfStudents;
		console.log(course);
	}

};

